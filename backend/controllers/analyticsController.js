const analyticsService = require('../services/analyticsService');

const getDashboard = async (req, res, next) => {
  try {
    const dashboard = await analyticsService.getDashboard({ models: req.models, branchId: req.query.branchId });
    res.json({ success: true, data: dashboard });
  } catch (error) { next(error); }
};

module.exports = {
  getDashboard,
};
