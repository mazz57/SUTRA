const { z } = require("zod");

// Reusable param/query schema factories so each entity does not re-declare
// the same UUID and pagination shapes.

function idParamSchema(key) {
  return z
    .object({
      [key]: z.uuid(),
    })
    .strict();
}

function paginatedQuerySchema(filters = {}) {
  return z
    .object({
      page: z.coerce.number().int().min(1).default(1),
      limit: z.coerce.number().int().min(1).max(50).default(10),
      ...filters,
    })
    .strict();
}

module.exports = { idParamSchema, paginatedQuerySchema };
