const { z } = require("zod");
const { idParamSchema, paginatedQuerySchema } = require("./common.validation");

const resourceCreateSchema = z
  .object({
    name: z.string().min(1).max(100),
    unit: z.string().min(1).max(30),
    weightPerUnit: z.number().positive().default(1),
    isActive: z.boolean().optional(),
  })
  .strict();

const resourceUpdateSchema = z
  .object({
    name: z.string().min(1).max(100).optional(),
    unit: z.string().min(1).max(30).optional(),
    // No default here: a partial update must not reset weightPerUnit to 1.
    weightPerUnit: z.number().positive().optional(),
    isActive: z.boolean().optional(),
  })
  .strict();

const resourceParamsSchema = idParamSchema("id");

const resourceListQuerySchema = paginatedQuerySchema();

module.exports = {
  resourceCreateSchema,
  resourceUpdateSchema,
  resourceParamsSchema,
  resourceListQuerySchema,
};
