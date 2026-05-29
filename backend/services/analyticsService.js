const mongoose = require('mongoose');

const buildBranchMatch = (branchId) => {
  if (!branchId) return {};

  return {
    branch: new mongoose.Types.ObjectId(branchId),
  };
};

const getDashboard = async ({ models, branchId }) => {
  const match = buildBranchMatch(branchId);
  const queryMatch = branchId ? { branch: branchId } : {};

  const [sales] = await models.Order.aggregate([
    { $match: { ...match, paymentStatus: { $in: ['paid', 'partial'] } } },
    {
      $group: {
        _id: null,
        paidOrderCount: { $sum: 1 },
        revenue: { $sum: '$totalAmount' },
      },
    },
  ]);

  const totalOrders = await models.Order.countDocuments(queryMatch);
  const unpaidOrders = await models.Order.countDocuments({
    ...queryMatch,
    paymentStatus: { $in: ['unpaid', 'partial'] },
  });

  const liveOrders = await models.Order.countDocuments({
    ...queryMatch,
    status: { $in: ['pending', 'accepted', 'preparing', 'prepared'] },
  });

  const lowStockCount = await models.InventoryItem.countDocuments({
    ...queryMatch,
    $expr: { $lte: ['$quantityOnHand', '$reorderLevel'] },
  });

  const topItems = await models.Order.aggregate([
    { $match: match },
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.menuItem',
        name: { $first: '$items.name' },
        quantity: { $sum: '$items.quantity' },
        revenue: { $sum: '$items.lineTotal' },
      },
    },
    { $sort: { quantity: -1 } },
    { $limit: 10 },
  ]);

  return {
    totalOrders,
    paidOrderCount: sales ? sales.paidOrderCount : 0,
    unpaidOrders,
    orderCount: totalOrders,
    revenue: sales ? Number(sales.revenue.toFixed(2)) : 0,
    liveOrders,
    lowStockCount,
    topItems,
  };
};

module.exports = {
  getDashboard,
};
