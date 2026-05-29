const createHttpError = require('../utils/httpError');

const ORDER_STATUSES = ['pending', 'accepted', 'preparing', 'prepared', 'served', 'completed', 'cancelled'];

const calculateOrderItems = async (models, requestedItems) => {
  if (!Array.isArray(requestedItems) || requestedItems.length === 0) {
    throw createHttpError('At least one order item is required');
  }

  const itemIds = requestedItems.map((item) => item.menuItemId);
  const menuItems = await models.MenuItem.find({ _id: { $in: itemIds }, available: true });
  const menuItemMap = new Map(menuItems.map((item) => [item._id.toString(), item]));

  let subtotal = 0;
  let taxTotal = 0;

  const items = requestedItems.map((requestedItem) => {
    const menuItem = menuItemMap.get(requestedItem.menuItemId);
    if (!menuItem) throw createHttpError(`Menu item unavailable: ${requestedItem.menuItemId}`, 400);

    const quantity = Number(requestedItem.quantity || 1);
    const lineTotal = Number((menuItem.price * quantity).toFixed(2));
    const lineTax = Number((lineTotal * ((menuItem.taxRate || 0) / 100)).toFixed(2));
    subtotal += lineTotal;
    taxTotal += lineTax;

    return {
      menuItem: menuItem._id,
      name: menuItem.name,
      unitPrice: menuItem.price,
      quantity,
      notes: requestedItem.notes,
      lineTotal,
    };
  });

  subtotal = Number(subtotal.toFixed(2));
  taxTotal = Number(taxTotal.toFixed(2));

  return {
    items,
    subtotal,
    taxTotal,
    totalAmount: Number((subtotal + taxTotal).toFixed(2)),
  };
};

const emitOrderEvent = (io, branchId, event, payload) => {
  if (!io || !branchId) return;
  io.to(`branch:${branchId}`).emit(event, payload);
};

const createOrder = async ({ models, io, user, body }) => {
  const branch = await models.Branch.findById(body.branchId);
  if (!branch) throw createHttpError('Branch not found', 404);

  if (body.tableId) {
    const table = await models.Table.findOne({ _id: body.tableId, branch: branch._id });
    if (!table) throw createHttpError('Table not found for this branch', 404);
  }

  const totals = await calculateOrderItems(models, body.items);
  const order = await models.Order.create({
    branch: branch._id,
    table: body.tableId,
    customer: user && user.role === 'customer' ? user._id : body.customerId,
    source: body.source || (user && user.role === 'customer' ? 'qr' : 'pos'),
    notes: body.notes,
    statusHistory: [{ status: 'pending', changedBy: user && user._id }],
    ...totals,
  });

  emitOrderEvent(io, branch._id.toString(), 'order:new', order);
  return order;
};

const listLiveOrders = ({ models, branchId }) => {
  const filter = {
    status: { $in: ['pending', 'accepted', 'preparing', 'prepared'] },
  };
  if (branchId) filter.branch = branchId;

  return models.Order.find(filter)
    .populate('table', 'tableNumber')
    .sort({ createdAt: 1 });
};

const listOrders = ({ models, branchId, status, paymentStatus, limit = 100 }) => {
  const filter = {};
  if (branchId) filter.branch = branchId;
  if (status) filter.status = status;
  if (paymentStatus) filter.paymentStatus = paymentStatus;

  return models.Order.find(filter)
    .populate('table', 'tableNumber')
    .sort({ createdAt: -1 })
    .limit(Math.min(Number(limit) || 100, 500));
};

const updateOrderStatus = async ({ models, io, user, orderId, status }) => {
  if (!ORDER_STATUSES.includes(status)) throw createHttpError('Invalid order status');

  const order = await models.Order.findById(orderId);
  if (!order) throw createHttpError('Order not found', 404);

  order.status = status;
  order.statusHistory.push({ status, changedBy: user && user._id });
  await order.save();

  emitOrderEvent(io, order.branch.toString(), 'order:status', order);
  return order;
};

module.exports = {
  createOrder,
  listOrders,
  listLiveOrders,
  updateOrderStatus,
};
