const createHttpError = require('../utils/httpError');
const loyaltyService = require('./loyaltyService');

const createBill = async ({ models, user, body }) => {
  const order = await models.Order.findById(body.orderId);
  if (!order) throw createHttpError('Order not found', 404);
  if (order.paymentStatus === 'paid') throw createHttpError('Order is already paid');

  const payment = await models.Payment.create({
    order: order._id,
    branch: order.branch,
    method: body.method,
    amount: body.amount || order.totalAmount,
    reference: body.reference,
    receivedBy: user && user._id,
  });

  const paidTotal = await models.Payment.aggregate([
    { $match: { order: order._id, status: 'paid' } },
    { $group: { _id: '$order', total: { $sum: '$amount' } } },
  ]);

  const totalPaid = paidTotal[0] ? paidTotal[0].total : 0;
  order.paymentStatus = totalPaid >= order.totalAmount ? 'paid' : 'partial';
  if (order.paymentStatus === 'paid' && order.status !== 'completed') {
    order.status = 'completed';
    order.statusHistory.push({ status: 'completed', changedBy: user && user._id });
  }
  await order.save();
  const wallet = await loyaltyService.awardCoinsForOrder({ models, order });

  return { order, payment, wallet };
};

const refund = async ({ models, user, body }) => {
  const order = await models.Order.findById(body.orderId);
  if (!order) throw createHttpError('Order not found', 404);

  const payment = await models.Payment.create({
    order: order._id,
    branch: order.branch,
    method: body.method || 'cash',
    amount: body.amount || order.totalAmount,
    status: 'refunded',
    reference: body.reference,
    receivedBy: user && user._id,
  });

  order.paymentStatus = 'refunded';
  await order.save();

  return { order, payment };
};

module.exports = {
  createBill,
  refund,
};
