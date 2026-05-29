const restaurantService = require('../services/restaurantService');

const listBranches = async (req, res, next) => {
  try {
    res.json({ success: true, data: await restaurantService.listBranches({ models: req.models }) });
  } catch (error) { next(error); }
};

const createBranch = async (req, res, next) => {
  try {
    const branch = await restaurantService.createBranch({ models: req.models, body: req.body });
    res.status(201).json({ success: true, data: branch });
  } catch (error) { next(error); }
};

const listTables = async (req, res, next) => {
  try {
    const tables = await restaurantService.listTables({ models: req.models, branchId: req.query.branchId });
    res.json({ success: true, data: tables });
  } catch (error) { next(error); }
};

const createTable = async (req, res, next) => {
  try {
    const table = await restaurantService.createTable({ models: req.models, tenantDb: req.tenantDb, body: req.body });
    res.status(201).json({ success: true, data: table });
  } catch (error) { next(error); }
};

const updateTableStatus = async (req, res, next) => {
  try {
    const table = await restaurantService.updateTableStatus({
      models: req.models,
      tableId: req.params.id,
      status: req.body.status,
    });
    res.json({ success: true, data: table });
  } catch (error) { next(error); }
};

module.exports = {
  listBranches,
  createBranch,
  listTables,
  createTable,
  updateTableStatus,
};
