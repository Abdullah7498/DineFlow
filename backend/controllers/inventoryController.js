const inventoryService = require('../services/inventoryService');

const listInventory = async (req, res, next) => {
  try {
    const inventory = await inventoryService.listInventory({
      models: req.models,
      branchId: req.query.branchId,
      lowStockOnly: req.query.lowStockOnly === 'true',
    });
    res.json({ success: true, data: inventory });
  } catch (error) { next(error); }
};

const createInventoryItem = async (req, res, next) => {
  try {
    const item = await inventoryService.createInventoryItem({ models: req.models, body: req.body });
    res.status(201).json({ success: true, data: item });
  } catch (error) { next(error); }
};

const adjustStock = async (req, res, next) => {
  try {
    const item = await inventoryService.adjustStock({ models: req.models, itemId: req.params.id, body: req.body });
    res.json({ success: true, data: item });
  } catch (error) { next(error); }
};

module.exports = {
  listInventory,
  createInventoryItem,
  adjustStock,
};
