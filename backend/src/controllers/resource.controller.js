const resourceService = require("../services/resource.service");

async function list(req, res, next) {
  try {
    const result = await resourceService.list(req.validated.query);
    res.status(200).json({ status: "success", ...result });
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  try {
    const resource = await resourceService.getById(req.validated.params.id);
    res.status(200).json({ status: "success", data: resource });
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const resource = await resourceService.create(req.validated.body);
    res.status(201).json({ status: "success", data: resource });
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const resource = await resourceService.update(
      req.validated.params.id,
      req.validated.body,
    );
    res.status(200).json({ status: "success", data: resource });
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    const result = await resourceService.remove(req.validated.params.id);
    res.status(200).json({ status: "success", data: result });
  } catch (error) {
    next(error);
  }
}

module.exports = { list, getById, create, update, remove };
