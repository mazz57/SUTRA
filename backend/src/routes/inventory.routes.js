const { Router } = require("express");

const inventoryController = require("../controllers/inventory.controller");
const { validate } = require("../middleware/validate.middleware");
const {
  inventoryCreateSchema,
  inventoryUpdateSchema,
  inventoryParamsSchema,
  inventoryListQuerySchema,
} = require("../validations/inventory.validation");

const router = Router();

router.get("/", validate(inventoryListQuerySchema, "query"), inventoryController.list);

router.get(
  "/:id",
  validate(inventoryParamsSchema, "params"),
  inventoryController.getById,
);

router.patch(
  "/:id",
  validate(inventoryParamsSchema, "params"),
  validate(inventoryUpdateSchema, "body"),
  inventoryController.update,
);

router.delete(
  "/:id",
  validate(inventoryParamsSchema, "params"),
  inventoryController.remove,
);

module.exports = router;
