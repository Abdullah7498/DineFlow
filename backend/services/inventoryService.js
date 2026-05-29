const createHttpError = require('../utils/httpError');

const listInventory = ({ models, branchId, lowStockOnly }) => {
  const filter = {};
  if (branchId) filter.branch = branchId;
  if (lowStockOnly) filter.$expr = { $lte: ['$quantityOnHand', '$reorderLevel'] };

  return models.InventoryItem.find(filter).sort({ name: 1 });
};

const createInventoryItem = async ({ models, body }) => {
  const branch = await models.Branch.findById(body.branchId);
  if (!branch) throw createHttpError('Branch not found', 404);

  return models.InventoryItem.create({
    branch: branch._id,
    name: body.name,
    unit: body.unit,
    quantityOnHand: body.quantityOnHand,
    reorderLevel: body.reorderLevel,
    costPerUnit: body.costPerUnit,
  });
};

const adjustStock = async ({ models, itemId, body }) => {
  const quantity = Number(body.quantity);
  const item = await models.InventoryItem.findById(itemId);
  if (!item) throw createHttpError('Inventory item not found', 404);

  const nextQuantity = body.type === 'decrease'
    ? item.quantityOnHand - quantity
    : item.quantityOnHand + quantity;

  if (nextQuantity < 0) throw createHttpError('Stock cannot go below zero');
  item.quantityOnHand = nextQuantity;
  await item.save();

  return item;
};

module.exports = {
  listInventory,
  createInventoryItem,
  adjustStock,
};
