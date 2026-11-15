const { Router } = require("express");

const disasterController = require("../controllers/disaster.controller");
const { validate } = require("../middleware/validate.middleware");
const {
  disasterCreateSchema,
  disasterUpdateSchema,
  disasterParamsSchema,
  disasterListQuerySchema,
} = require("../validations/disaster.validation");

const router = Router();

router.get("/", validate(disasterListQuerySchema, "query"), disasterController.list);

router.post("/", validate(disasterCreateSchema, "body"), disasterController.create);

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
