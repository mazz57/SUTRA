const { z } = require("zod");

const warehouseBodySchema = z
  .object({
    name: z.string().min(1).max(150),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    isActive: z.boolean().optional(),
  })
  .strict();

const warehouseCreateSchema = warehouseBodySchema;

const warehouseUpdateSchema = warehouseBodySchema.partial();

const disasterParamsSchema = z
  .object({
    disasterId: z.uuid(),
  })
  .strict();

const warehouseParamsSchema = z
  .object({
    id: z.uuid(),
  })
  .strict();

const warehouseListQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),
    disasterId: z.uuid().optional(),
  })
  .strict();

module.exports = {
  warehouseCreateSchema,
  warehouseUpdateSchema,
  disasterParamsSchema,
  warehouseParamsSchema,
  warehouseListQuerySchema,
};
