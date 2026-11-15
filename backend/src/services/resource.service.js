const { prisma } = require("../config/database");
const { ApiError } = require("../utils/api-error");
const {
  isForeignKeyViolation,
  isUniqueConstraintViolation,
} = require("../utils/db-errors");

async function list({ page, limit }) {
  const where = {};

  const [total, data] = await prisma.$transaction([
    prisma.resource.count({ where }),
    prisma.resource.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { name: "asc" },
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
  const resource = await prisma.resource.findUnique({ where: { id } });
  if (!resource) {
    throw new ApiError(404, "NOT_FOUND", "Resource not found");
  }
  return resource;
}

async function create(body) {
  try {
    return await prisma.resource.create({ data: body });
  } catch (error) {
    if (isUniqueConstraintViolation(error)) {
      throw new ApiError(409, "NAME_CONFLICT", "Resource name already exists");
    }
    throw error;
  }
}

async function update(id, body) {
  await getById(id);
  try {
    return await prisma.resource.update({ where: { id }, data: body });
  } catch (error) {
    if (isUniqueConstraintViolation(error)) {
      throw new ApiError(409, "NAME_CONFLICT", "Resource name already exists");
    }
    throw error;
  }
}

async function remove(id) {
  await getById(id);
  try {
    await prisma.resource.delete({ where: { id } });
  } catch (error) {
    if (isForeignKeyViolation(error)) {
      throw new ApiError(
        409,
        "RELATION_CONFLICT",
        "Resource has related records and cannot be deleted",
      );
    }
    throw error;
  }
  return { id };
}

module.exports = { list, getById, create, update, remove };
