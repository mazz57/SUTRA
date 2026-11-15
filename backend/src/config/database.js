const { PrismaClient } = require("@prisma/client");

// Singleton Prisma Client so hot reloads (nodemon) reuse one connection pool.
const prisma = global.__sutraPrisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.__sutraPrisma = prisma;
}

module.exports = { prisma };
