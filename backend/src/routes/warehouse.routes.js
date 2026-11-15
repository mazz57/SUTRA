const { Router } = require("express");

const warehouseController = require("../controllers/warehouse.controller");
const inventoryController = require("../controllers/inventory.controller");
const { validate } = require("../middleware/validate.middleware");
const {
  warehouseCreateSchema,
  warehouseUpdateSchema,
  warehouseParamsSchema,
  warehouseListQuerySchema,
} = require("../validations/warehouse.validation");
const {
  inventoryCreateSchema,
  warehouseParamsSchema: inventoryWarehouseParamsSchema,
} = require("../validations/inventory.validation");

const router = Router();

// Nested inventory creation: POST /api/warehouses/:warehouseId/inventory
// Declared before /:id so Express does not treat "inventory" as an id.
router.post(
  "/:warehouseId/inventory",
  validate(inventoryWarehouseParamsSchema, "params"),
  validate(inventoryCreateSchema, "body"),
  inventoryController.createUnderWarehouse,
);

router.get("/", validate(warehouseListQuerySchema, "query"), warehouseController.list);

router.get(
  "/:id",
  validate(warehouseParamsSchema, "params"),
  warehouseController.getById,
);

router.patch(
  "/:id",
  validate(warehouseParamsSchema, "params"),
  validate(warehouseUpdateSchema, "body"),
  warehouseController.update,
);

router.delete(
  "/:id",
  validate(warehouseParamsSchema, "params"),
  warehouseController.remove,
);

module.exports = router;
