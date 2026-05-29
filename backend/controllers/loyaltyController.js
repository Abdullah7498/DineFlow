const loyaltyService = require('../services/loyaltyService');

const getMyWallet = async (req, res, next) => {
  try {
    const wallet = await loyaltyService.getWallet({ models: req.models, customerId: req.user._id });
    res.json({ success: true, data: wallet });
  } catch (error) { next(error); }
};

module.exports = {
  getMyWallet,
};
