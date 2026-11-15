const { ApiError } = require("../utils/api-error");

// Reusable Zod validation middleware. `source` is "body" | "query" | "params".
// Parsed data is attached to req.validated because Express 5 does not allow
// reassigning req.query, and controllers should read validated values.
function validate(schema, source = "body") {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      }));
      return next(new ApiError(400, "VALIDATION_ERROR", "Invalid request", details));
    }
    req.validated = req.validated || {};
    req.validated[source] = result.data;
    next();
  };
}

module.exports = { validate };
