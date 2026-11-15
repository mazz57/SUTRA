const { prisma } = require("../config/database");

async function getApplicationInfo() {
  return {
    name: "sutra-backend",
    version: "1.0.0",
    env: process.env.NODE_ENV || "development",
    uptimeSeconds: Math.floor(process.uptime()),
  };
}

async function checkDatabase() {
  const startedAt = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { status: "connected", latencyMs: Date.now() - startedAt };
  } catch (error) {
    return { status: "disconnected", error: error.code || "DATABASE_ERROR" };
  }
}

async function getHealthReport() {
  const [application, database] = await Promise.all([
    getApplicationInfo(),
    checkDatabase(),
  ]);

  return { status: database.status === "connected" ? "ok" : "degraded", application, database };
}

module.exports = { getHealthReport };
