const { prisma } = require("../config/database");
const { ApiError } = require("../utils/api-error");
const {
  isForeignKeyViolation,
  isUniqueConstraintViolation,
} = require("../utils/db-errors");

async function list({ page, limit, warehouseId, resourceId }) {
  const where = {};
  if (warehouseId) where.warehouseId = warehouseId;
  if (resourceId) where.resourceId = resourceId;

  const [total, data] = await prisma.$transaction([
    prisma.inventory.count({ where }),
    prisma.inventory.findMany({
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
  const inventory = await prisma.inventory.findUnique({ where: { id } });
  if (!inventory) {
    throw new ApiError(404, "NOT_FOUND", "Inventory record not found");
  }
  return inventory;
}

async function create(warehouseId, body) {
  // Validate that the parent warehouse exists before creating inventory.
  const warehouse = await prisma.warehouse.findUnique({ where: { id: warehouseId } });
  if (!warehouse) {
    throw new ApiError(404, "WAREHOUSE_NOT_FOUND", "Warehouse not found");
  }

  // Validate that the referenced resource exists.
  const resource = await prisma.resource.findUnique({ where: { id: body.resourceId } });
  if (!resource) {
    throw new ApiError(404, "RESOURCE_NOT_FOUND", "Resource not found");
  }

  try {
    return await prisma.inventory.create({
      data: {
        warehouseId,
        resourceId: body.resourceId,
        availableQuantity: body.availableQuantity,
      },
    });
  } catch (error) {
    // @@unique([warehouseId, resourceId]) prevents duplicate combinations.
    if (isUniqueConstraintViolation(error)) {
      throw new ApiError(
        409,
        "INVENTORY_EXISTS",
        "Inventory record for this warehouse and resource already exists",
      );
    }
    throw error;
  }
}

async function update(id, body) {
  await getById(id);
  return prisma.inventory.update({ where: { id }, data: body });
}

async function remove(id) {
  await getById(id);
  try {
    await prisma.inventory.delete({ where: { id } });
  } catch (error) {
    // No model currently references Inventory, so this should not fire, but the
    // guard is kept for consistency with the other services and schema changes.
    if (isForeignKeyViolation(error)) {
      throw new ApiError(
        409,
        "RELATION_CONFLICT",
        "Inventory has related records and cannot be deleted",
      );
    }
    throw error;
  }
  return { id };
}

module.exports = { list, getById, create, update, remove };
