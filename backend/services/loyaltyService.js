const COINS_PER_1000 = 50;

const awardCoinsForOrder = async ({ models, order }) => {
  if (!order.customer || order.paymentStatus !== 'paid') return null;

  const coins = Math.floor((order.totalAmount / 1000) * COINS_PER_1000);
  if (coins <= 0) return null;

  return models.LoyaltyWallet.findOneAndUpdate(
    { customer: order.customer },
    {
      $inc: {
        coins,
        lifetimeEarned: coins,
      },
    },
    { upsert: true, new: true }
  );
};

const getWallet = ({ models, customerId }) => {
  return models.LoyaltyWallet.findOneAndUpdate(
    { customer: customerId },
    { $setOnInsert: { customer: customerId } },
    { upsert: true, new: true }
  );
};

module.exports = {
  awardCoinsForOrder,
  getWallet,
};
