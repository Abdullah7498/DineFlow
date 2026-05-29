const createHttpError = require('../utils/httpError');

const listMenu = async ({ models, branchId, publicOnly = false }) => {
  const branchFilter = branchId ? { branch: branchId } : {};
  const activeFilter = publicOnly ? { isActive: true } : {};
  const itemActiveFilter = publicOnly ? { available: true } : {};

  const categories = await models.MenuCategory.find({ ...branchFilter, ...activeFilter })
    .sort({ displayOrder: 1, name: 1 })
    .lean();
  const items = await models.MenuItem.find({ ...branchFilter, ...itemActiveFilter })
    .sort({ name: 1 })
    .lean();

  return categories.map((category) => ({
    ...category,
    items: items.filter((item) => item.category.toString() === category._id.toString()),
  }));
};

const createCategory = async ({ models, body }) => {
  const branch = await models.Branch.findById(body.branchId);
  if (!branch) throw createHttpError('Branch not found', 404);

  return models.MenuCategory.create({
    branch: branch._id,
    name: body.name,
    displayOrder: body.displayOrder,
    isActive: body.isActive,
  });
};

const createItem = async ({ models, body }) => {
  const category = await models.MenuCategory.findById(body.categoryId);
  if (!category) throw createHttpError('Menu category not found', 404);

  return models.MenuItem.create({
    branch: category.branch,
    category: category._id,
    name: body.name,
    description: body.description,
    imageUrl: body.imageUrl,
    imageKey: body.imageKey,
    price: body.price,
    taxRate: body.taxRate,
    available: body.available,
    preparationMinutes: body.preparationMinutes,
  });
};

const updateItemAvailability = async ({ models, itemId, available }) => {
  const item = await models.MenuItem.findByIdAndUpdate(itemId, { available }, { new: true });
  if (!item) throw createHttpError('Menu item not found', 404);
  return item;
};

module.exports = {
  listMenu,
  createCategory,
  createItem,
  updateItemAvailability,
};
