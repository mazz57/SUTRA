const warehouseService = require("../services/warehouse.service");

async function list(req, res, next) {
  try {
    const result = await warehouseService.list(req.validated.query);
    res.status(200).json({ status: "success", ...result });
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  try {
    const warehouse = await warehouseService.getById(req.validated.params.id);
    res.status(200).json({ status: "success", data: warehouse });
  } catch (error) {
    next(error);
  }
}

// Nested route: POST /api/disasters/:disasterId/warehouses
async function createUnderDisaster(req, res, next) {
  try {
    const warehouse = await warehouseService.create(
      req.validated.params.disasterId,
      req.validated.body,
    );
    res.status(201).json({ status: "success", data: warehouse });
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const warehouse = await warehouseService.update(
      req.validated.params.id,
      req.validated.body,
    );
    res.status(200).json({ status: "success", data: warehouse });
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    const result = await warehouseService.remove(req.validated.params.id);
    res.status(200).json({ status: "success", data: result });
  } catch (error) {
    next(error);
  }
}

module.exports = { list, getById, createUnderDisaster, update, remove };
