const inventoryService = require("../services/inventory.service");

async function list(req, res, next) {
  try {
    const result = await inventoryService.list(req.validated.query);
    res.status(200).json({ status: "success", ...result });
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  try {
    const inventory = await inventoryService.getById(req.validated.params.id);
    res.status(200).json({ status: "success", data: inventory });
  } catch (error) {
    next(error);
  }
}

// Nested route: POST /api/warehouses/:warehouseId/inventory
async function createUnderWarehouse(req, res, next) {
  try {
    const inventory = await inventoryService.create(
      req.validated.params.warehouseId,
      req.validated.body,
    );
    res.status(201).json({ status: "success", data: inventory });
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const inventory = await inventoryService.update(
      req.validated.params.id,
      req.validated.body,
    );
    res.status(200).json({ status: "success", data: inventory });
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    const result = await inventoryService.remove(req.validated.params.id);
    res.status(200).json({ status: "success", data: result });
  } catch (error) {
    next(error);
  }
}

module.exports = { list, getById, createUnderWarehouse, update, remove };
