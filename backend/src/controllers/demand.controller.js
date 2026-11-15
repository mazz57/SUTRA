const demandService = require("../services/demand.service");

async function list(req, res, next) {
  try {
    const result = await demandService.list(req.validated.query);
    res.status(200).json({ status: "success", ...result });
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  try {
    const demand = await demandService.getById(req.validated.params.id);
    res.status(200).json({ status: "success", data: demand });
  } catch (error) {
    next(error);
  }
}

// Nested route: POST /api/shelters/:shelterId/demands
async function createUnderShelter(req, res, next) {
  try {
    const demand = await demandService.create(
      req.validated.params.shelterId,
      req.validated.body,
    );
    res.status(201).json({ status: "success", data: demand });
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const demand = await demandService.update(
      req.validated.params.id,
      req.validated.body,
    );
    res.status(200).json({ status: "success", data: demand });
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    const result = await demandService.remove(req.validated.params.id);
    res.status(200).json({ status: "success", data: result });
  } catch (error) {
    next(error);
  }
}

module.exports = { list, getById, createUnderShelter, update, remove };
