require("dotenv").config();

const app = require("./app");
const { prisma } = require("./config/database");

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  console.log(`SUTRA backend listening on port ${PORT}`);
});

async function shutdown(signal) {
  console.log(`${signal} received, shutting down...`);
  server.close(async () => {
    await prisma.$disconnect();
    console.log("HTTP server closed and Prisma disconnected");
    process.exit(0);
  });

  // Force exit if connections do not drain in time.
  setTimeout(async () => {
    await prisma.$disconnect();
    process.exit(1);
  }, 10000).unref();
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
