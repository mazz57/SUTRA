const { Router } = require("express");

const shelterController = require("../controllers/shelter.controller");
const { validate } = require("../middleware/validate.middleware");
const {
  shelterCreateSchema,
  shelterUpdateSchema,
  shelterParamsSchema,
  shelterListQuerySchema,
} = require("../validations/shelter.validation");

const router = Router();

router.get("/", validate(shelterListQuerySchema, "query"), shelterController.list);

router.get("/:id", validate(shelterParamsSchema, "params"), shelterController.getById);

router.patch(
  "/:id",
  validate(shelterParamsSchema, "params"),
  validate(shelterUpdateSchema, "body"),
  shelterController.update,
);

router.delete("/:id", validate(shelterParamsSchema, "params"), shelterController.remove);

module.exports = router;
