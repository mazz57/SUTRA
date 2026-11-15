const { Router } = require("express");

const resourceController = require("../controllers/resource.controller");
const { validate } = require("../middleware/validate.middleware");
const {
  resourceCreateSchema,
  resourceUpdateSchema,
  resourceParamsSchema,
  resourceListQuerySchema,
} = require("../validations/resource.validation");

const router = Router();

router.get("/", validate(resourceListQuerySchema, "query"), resourceController.list);

router.post("/", validate(resourceCreateSchema, "body"), resourceController.create);

router.get(
  "/:id",
  validate(resourceParamsSchema, "params"),
  resourceController.getById,
);

router.patch(
  "/:id",
  validate(resourceParamsSchema, "params"),
  validate(resourceUpdateSchema, "body"),
  resourceController.update,
);

router.delete(
  "/:id",
  validate(resourceParamsSchema, "params"),
  resourceController.remove,
);

module.exports = router;
