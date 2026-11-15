const { z } = require("zod");
const { idParamSchema, paginatedQuerySchema } = require("./common.validation");

const SHELTER_PRIORITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

const demandCreateSchema = z
  .object({
    resourceId: z.uuid(),
    requiredQuantity: z.number().int().min(1),
    currentStock: z.number().int().min(0).default(0),
    priority: z.enum(SHELTER_PRIORITIES).optional(),
    isVerified: z.boolean().optional(),
  })
  .strict();

const demandUpdateSchema = z
  .object({
    requiredQuantity: z.number().int().min(1).optional(),
    currentStock: z.number().int().min(0).optional(),
    priority: z.enum(SHELTER_PRIORITIES).optional(),
    isVerified: z.boolean().optional(),
  })
  .strict();

const demandParamsSchema = idParamSchema("id");

const shelterParamsSchema = idParamSchema("shelterId");

const demandListQuerySchema = paginatedQuerySchema({
  shelterId: z.uuid().optional(),
  resourceId: z.uuid().optional(),
});

module.exports = {
  demandCreateSchema,
  demandUpdateSchema,
  demandParamsSchema,
  shelterParamsSchema,
  demandListQuerySchema,
};
