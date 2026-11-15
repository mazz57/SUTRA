const disasterService = require("../services/disaster.service");

async function list(req, res, next) {
  try {
    const result = await disasterService.list(req.validated.query);
    res.status(200).json({ status: "success", ...result });
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  try {
    const disaster = await disasterService.getById(req.validated.params.id);
    res.status(200).json({ status: "success", data: disaster });
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const disaster = await disasterService.create(req.validated.body);
    res.status(201).json({ status: "success", data: disaster });
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const disaster = await disasterService.update(
      req.validated.params.id,
      req.validated.body,
    );
    res.status(200).json({ status: "success", data: disaster });
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    const result = await disasterService.remove(req.validated.params.id);
    res.status(200).json({ status: "success", data: result });
  } catch (error) {
    next(error);
  }
}

module.exports = { list, getById, create, update, remove };
