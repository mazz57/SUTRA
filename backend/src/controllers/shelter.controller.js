const shelterService = require("../services/shelter.service");

async function list(req, res, next) {
  try {
    const result = await shelterService.list(req.validated.query);
    res.status(200).json({ status: "success", ...result });
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  try {
    const shelter = await shelterService.getById(req.validated.params.id);
    res.status(200).json({ status: "success", data: shelter });
  } catch (error) {
    next(error);
  }
}

// Nested route: POST /api/disasters/:disasterId/shelters
async function createUnderDisaster(req, res, next) {
  try {
    const shelter = await shelterService.create(
      req.validated.params.disasterId,
      req.validated.body,
    );
    res.status(201).json({ status: "success", data: shelter });
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const shelter = await shelterService.update(
      req.validated.params.id,
      req.validated.body,
    );
    res.status(200).json({ status: "success", data: shelter });
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    const result = await shelterService.remove(req.validated.params.id);
    res.status(200).json({ status: "success", data: result });
  } catch (error) {
    next(error);
  }
}

module.exports = { list, getById, createUnderDisaster, update, remove };
