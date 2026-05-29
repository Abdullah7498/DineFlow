const posService = require('../services/posService');

const createBill = async (req, res, next) => {
  try {
    const bill = await posService.createBill({ models: req.models, user: req.user, body: req.body });
    res.status(201).json({ success: true, data: bill });
  } catch (error) { next(error); }
};

const refund = async (req, res, next) => {
  try {
    const refundResult = await posService.refund({ models: req.models, user: req.user, body: req.body });
    res.status(201).json({ success: true, data: refundResult });
  } catch (error) { next(error); }
};

module.exports = {
  createBill,
  refund,
};
