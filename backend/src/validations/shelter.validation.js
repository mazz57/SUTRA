const { z } = require("zod");

const SHELTER_PRIORITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

const shelterBodySchema = z
  .object({
    name: z.string().min(1).max(150),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    population: z.number().int().min(0).default(0),
    capacity: z.number().int().min(0),
    priority: z.enum(SHELTER_PRIORITIES).optional(),
    isActive: z.boolean().optional(),
  })
  .strict();

const shelterCreateSchema = shelterBodySchema;

const shelterUpdateSchema = shelterBodySchema.partial();

const disasterParamsSchema = z
  .object({
    disasterId: z.uuid(),
  })
  .strict();

const shelterParamsSchema = z
  .object({
    id: z.uuid(),
  })
  .strict();

const shelterListQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),
    disasterId: z.uuid().optional(),
  })
  .strict();

module.exports = {
  shelterCreateSchema,
  shelterUpdateSchema,
  disasterParamsSchema,
  shelterParamsSchema,
  shelterListQuerySchema,
};
