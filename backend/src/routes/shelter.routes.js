const { Router } = require("express");

const shelterController = require("../controllers/shelter.controller");
const demandController = require("../controllers/demand.controller");
const { validate } = require("../middleware/validate.middleware");
const {
  shelterCreateSchema,
  shelterUpdateSchema,
  shelterParamsSchema,
  shelterListQuerySchema,
} = require("../validations/shelter.validation");
const {
  demandCreateSchema,
  shelterParamsSchema: demandShelterParamsSchema,
} = require("../validations/demand.validation");

const router = Router();

// Nested demand creation: POST /api/shelters/:shelterId/demands
// Declared before /:id so Express does not treat "demands" as an id.
router.post(
  "/:shelterId/demands",
  validate(demandShelterParamsSchema, "params"),
  validate(demandCreateSchema, "body"),
  demandController.createUnderShelter,
);

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
