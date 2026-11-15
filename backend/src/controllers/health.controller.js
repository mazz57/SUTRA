const healthService = require("../services/health.service");

async function getHealth(req, res, next) {
  try {
    const report = await healthService.getHealthReport();
    const statusCode = report.status === "ok" ? 200 : 503;
    res.status(statusCode).json(report);
  } catch (error) {
    next(error);
  }
}

module.exports = { getHealth };
