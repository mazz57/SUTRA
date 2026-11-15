function notFoundHandler(req, res) {
  res.status(404).json({
    status: "error",
    error: {
      code: "NOT_FOUND",
      message: `Route ${req.method} ${req.originalUrl} does not exist`,
    },
  });
}

// Central error handler. Express 5 forwards thrown/rejected errors here.
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const code = err.code || "INTERNAL_ERROR";

  // Full details stay on the server; only a safe message is returned.
  if (statusCode >= 500) {
    console.error("[error]", err);
  }

  res.status(statusCode).json({
    status: "error",
    error: {
      code,
      message: statusCode >= 500 ? "Internal server error" : err.message,
    },
  });
}

module.exports = { notFoundHandler, errorHandler };
