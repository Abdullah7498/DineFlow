const orderService = require('../services/orderService');

const createOrder = async (req, res, next) => {
  try {
    const order = await orderService.createOrder({
      models: req.models,
      io: req.io,
      user: req.user,
      body: req.body,
    });
    res.status(201).json({ success: true, data: order });
  } catch (error) { next(error); }
};

const listLiveOrders = async (req, res, next) => {
  try {
    const orders = await orderService.listLiveOrders({ models: req.models, branchId: req.query.branchId });
    res.json({ success: true, data: orders });
  } catch (error) { next(error); }
};

const listOrders = async (req, res, next) => {
  try {
    const orders = await orderService.listOrders({
      models: req.models,
      branchId: req.query.branchId,
      status: req.query.status,
      paymentStatus: req.query.paymentStatus,
      limit: req.query.limit,
    });
    res.json({ success: true, data: orders });
  } catch (error) { next(error); }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await orderService.updateOrderStatus({
      models: req.models,
      io: req.io,
      user: req.user,
      orderId: req.params.id,
      status: req.body.status,
    });
    res.json({ success: true, data: order });
  } catch (error) { next(error); }
};

module.exports = {
  createOrder,
  listOrders,
  listLiveOrders,
  updateOrderStatus,
};
