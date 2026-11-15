const { z } = require("zod");

const DISASTER_STATUSES = ["ACTIVE", "CONTAINED", "CLOSED"];

const disasterBodySchema = z
  .object({
    name: z.string().min(1).max(150),
    disasterType: z.string().min(1).max(100),
    location: z.string().min(1).max(200),
    description: z.string().max(1000).optional(),
    status: z.enum(DISASTER_STATUSES).optional(),
  })
  .strict();

const disasterCreateSchema = disasterBodySchema;

const disasterUpdateSchema = disasterBodySchema.partial();

const disasterParamsSchema = z
  .object({
    id: z.uuid(),
  })
  .strict();

const disasterListQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),
    status: z.enum(DISASTER_STATUSES).optional(),
  })
  .strict();

module.exports = {
  disasterCreateSchema,
  disasterUpdateSchema,
  disasterParamsSchema,
  disasterListQuerySchema,
};
