const { Router } = require("express");

const demandController = require("../controllers/demand.controller");
const { validate } = require("../middleware/validate.middleware");
const {
  demandCreateSchema,
  demandUpdateSchema,
  demandParamsSchema,
  demandListQuerySchema,
} = require("../validations/demand.validation");

const router = Router();

router.get("/", validate(demandListQuerySchema, "query"), demandController.list);

router.get("/:id", validate(demandParamsSchema, "params"), demandController.getById);

router.patch(
  "/:id",
  validate(demandParamsSchema, "params"),
  validate(demandUpdateSchema, "body"),
  demandController.update,
);

router.delete("/:id", validate(demandParamsSchema, "params"), demandController.remove);

module.exports = router;
