const { z } = require("zod");
const { idParamSchema, paginatedQuerySchema } = require("./common.validation");

const inventoryCreateSchema = z
  .object({
    resourceId: z.uuid(),
    availableQuantity: z.number().int().min(0).default(0),
  })
  .strict();

const inventoryUpdateSchema = z
  .object({
    availableQuantity: z.number().int().min(0).optional(),
  })
  .strict();

const inventoryParamsSchema = idParamSchema("id");

const warehouseParamsSchema = idParamSchema("warehouseId");

const inventoryListQuerySchema = paginatedQuerySchema({
  warehouseId: z.uuid().optional(),
  resourceId: z.uuid().optional(),
});

module.exports = {
  inventoryCreateSchema,
  inventoryUpdateSchema,
  inventoryParamsSchema,
  warehouseParamsSchema,
  inventoryListQuerySchema,
};
