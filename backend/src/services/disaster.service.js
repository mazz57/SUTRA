const { prisma } = require("../config/database");
const { ApiError } = require("../utils/api-error");

async function list({ page, limit, status }) {
  const where = status ? { status } : {};

  const [total, data] = await prisma.$transaction([
    prisma.disaster.count({ where }),
    prisma.disaster.findMany({
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
  const disaster = await prisma.disaster.findUnique({ where: { id } });
  if (!disaster) {
    throw new ApiError(404, "NOT_FOUND", "Disaster not found");
  }
  return disaster;
}

async function create(body) {
  return prisma.disaster.create({ data: body });
}

async function update(id, body) {
  await getById(id);
  return prisma.disaster.update({ where: { id }, data: body });
}

async function remove(id) {
  await getById(id);
  try {
    await prisma.disaster.delete({ where: { id } });
  } catch (error) {
    // P2003: foreign key violation. Postgres 23001 (RESTRICT violation, seen on
    // Neon) surfaces as an unknown error, so the message is checked as well.
    if (
      error.code === "P2003" ||
      /violates (RESTRICT setting of )?foreign key/i.test(error.message || "")
    ) {
      throw new ApiError(
        409,
        "RELATION_CONFLICT",
        "Disaster has related records and cannot be deleted",
      );
    }
    throw error;
  }
  return { id };
}

module.exports = { list, getById, create, update, remove };
