const { Router } = require("express");

const disasterController = require("../controllers/disaster.controller");
const shelterController = require("../controllers/shelter.controller");
const warehouseController = require("../controllers/warehouse.controller");
const { validate } = require("../middleware/validate.middleware");
const {
  disasterCreateSchema,
  disasterUpdateSchema,
  disasterParamsSchema,
  disasterListQuerySchema,
} = require("../validations/disaster.validation");
const {
  shelterCreateSchema,
  disasterParamsSchema: shelterDisasterParamsSchema,
} = require("../validations/shelter.validation");
const {
  warehouseCreateSchema,
  disasterParamsSchema: warehouseDisasterParamsSchema,
} = require("../validations/warehouse.validation");

const router = Router();

router.get("/", validate(disasterListQuerySchema, "query"), disasterController.list);

router.post("/", validate(disasterCreateSchema, "body"), disasterController.create);

// Nested shelter creation: POST /api/disasters/:disasterId/shelters
router.post(
  "/:disasterId/shelters",
  validate(shelterDisasterParamsSchema, "params"),
  validate(shelterCreateSchema, "body"),
  shelterController.createUnderDisaster,
);

// Nested warehouse creation: POST /api/disasters/:disasterId/warehouses
router.post(
  "/:disasterId/warehouses",
  validate(warehouseDisasterParamsSchema, "params"),
  validate(warehouseCreateSchema, "body"),
  warehouseController.createUnderDisaster,
);

router.get(
  "/:id",
  validate(disasterParamsSchema, "params"),
  disasterController.getById,
);

router.patch(
  "/:id",
  validate(disasterParamsSchema, "params"),
  validate(disasterUpdateSchema, "body"),
  disasterController.update,
);

router.delete(
  "/:id",
  validate(disasterParamsSchema, "params"),
  disasterController.remove,
);

module.exports = router;
