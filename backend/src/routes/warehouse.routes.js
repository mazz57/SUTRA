const { Router } = require("express");

const warehouseController = require("../controllers/warehouse.controller");
const { validate } = require("../middleware/validate.middleware");
const {
  warehouseCreateSchema,
  warehouseUpdateSchema,
  warehouseParamsSchema,
  warehouseListQuerySchema,
} = require("../validations/warehouse.validation");

const router = Router();

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
