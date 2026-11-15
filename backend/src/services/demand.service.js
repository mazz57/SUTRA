const { prisma } = require("../config/database");
const { ApiError } = require("../utils/api-error");
const {
  isForeignKeyViolation,
  isUniqueConstraintViolation,
} = require("../utils/db-errors");

async function list({ page, limit, shelterId, resourceId }) {
  const where = {};
  if (shelterId) where.shelterId = shelterId;
  if (resourceId) where.resourceId = resourceId;

  const [total, data] = await prisma.$transaction([
    prisma.demand.count({ where }),
    prisma.demand.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

async function getById(id) {
  const demand = await prisma.demand.findUnique({ where: { id } });
  if (!demand) {
    throw new ApiError(404, "NOT_FOUND", "Demand record not found");
  }
  return demand;
}

async function create(shelterId, body) {
  // Validate that the parent shelter exists before creating demand.
  const shelter = await prisma.shelter.findUnique({ where: { id: shelterId } });
  if (!shelter) {
    throw new ApiError(404, "SHELTER_NOT_FOUND", "Shelter not found");
  }

  // Validate that the referenced resource exists.
  const resource = await prisma.resource.findUnique({ where: { id: body.resourceId } });
  if (!resource) {
    throw new ApiError(404, "RESOURCE_NOT_FOUND", "Resource not found");
  }

  // Note: requiredQuantity is demand, not stock. It is accepted regardless of
  // available inventory; shortage calculation belongs to the optimisation phase.
  try {
    return await prisma.demand.create({
      data: {
        shelterId,
        resourceId: body.resourceId,
        requiredQuantity: body.requiredQuantity,
        currentStock: body.currentStock,
        priority: body.priority,
        isVerified: body.isVerified,
      },
    });
  } catch (error) {
    // @@unique([shelterId, resourceId]) prevents duplicate combinations.
    if (isUniqueConstraintViolation(error)) {
      throw new ApiError(
        409,
        "DEMAND_EXISTS",
        "Demand record for this shelter and resource already exists",
      );
    }
    throw error;
  }
}

async function update(id, body) {
  await getById(id);
  return prisma.demand.update({ where: { id }, data: body });
}

async function remove(id) {
  await getById(id);
  try {
    await prisma.demand.delete({ where: { id } });
  } catch (error) {
    // No model currently references Demand, so this should not fire, but the
    // guard is kept for consistency with the other services and schema changes.
    if (isForeignKeyViolation(error)) {
      throw new ApiError(
        409,
        "RELATION_CONFLICT",
        "Demand has related records and cannot be deleted",
      );
    }
    throw error;
  }
  return { id };
}

module.exports = { list, getById, create, update, remove };
