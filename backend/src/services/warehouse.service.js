const { prisma } = require("../config/database");
const { ApiError } = require("../utils/api-error");

async function list({ page, limit, disasterId }) {
  const where = disasterId ? { disasterId } : {};

  const [total, data] = await prisma.$transaction([
    prisma.warehouse.count({ where }),
    prisma.warehouse.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
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
  const warehouse = await prisma.warehouse.findUnique({ where: { id } });
  if (!warehouse) {
    throw new ApiError(404, "NOT_FOUND", "Warehouse not found");
  }
  return warehouse;
}

async function create(disasterId, body) {
  // Validate that the parent disaster exists before creating the warehouse.
  const disaster = await prisma.disaster.findUnique({ where: { id: disasterId } });
  if (!disaster) {
    throw new ApiError(404, "DISASTER_NOT_FOUND", "Disaster not found");
  }

  return prisma.warehouse.create({
    data: { ...body, disasterId },
  });
}

async function update(id, body) {
  await getById(id);
  return prisma.warehouse.update({ where: { id }, data: body });
}

async function remove(id) {
  await getById(id);
  try {
    await prisma.warehouse.delete({ where: { id } });
  } catch (error) {
    // P2003: foreign key violation (e.g. warehouse has inventory or allocation lines).
    // Postgres 23001 (RESTRICT violation, seen on Neon) surfaces as an unknown
    // error, so the message is checked as well.
    if (
      error.code === "P2003" ||
      /violates (RESTRICT setting of )?foreign key/i.test(error.message || "")
    ) {
      throw new ApiError(
        409,
        "RELATION_CONFLICT",
        "Warehouse has related records and cannot be deleted",
      );
    }
    throw error;
  }
  return { id };
}

module.exports = { list, getById, create, update, remove };
