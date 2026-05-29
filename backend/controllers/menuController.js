const menuService = require('../services/menuService');

const listMenu = async (req, res, next) => {
  try {
    const menu = await menuService.listMenu({
      models: req.models,
      branchId: req.query.branchId,
      publicOnly: req.query.public === 'true',
    });
    res.json({ success: true, data: menu });
  } catch (error) { next(error); }
};

const createCategory = async (req, res, next) => {
  try {
    const category = await menuService.createCategory({ models: req.models, body: req.body });
    res.status(201).json({ success: true, data: category });
  } catch (error) { next(error); }
};

const createItem = async (req, res, next) => {
  try {
    const item = await menuService.createItem({ models: req.models, body: req.body });
    res.status(201).json({ success: true, data: item });
  } catch (error) { next(error); }
};

const updateItemAvailability = async (req, res, next) => {
  try {
    const item = await menuService.updateItemAvailability({
      models: req.models,
      itemId: req.params.id,
      available: req.body.available,
    });
    res.json({ success: true, data: item });
  } catch (error) { next(error); }
};

module.exports = {
  listMenu,
  createCategory,
  createItem,
  updateItemAvailability,
};
