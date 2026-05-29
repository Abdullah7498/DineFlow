const { Schema } = require('mongoose');

const LoyaltyWalletSchema = new Schema({
  customer: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  coins: { type: Number, default: 0, min: 0 },
  lifetimeEarned: { type: Number, default: 0, min: 0 },
  lifetimeRedeemed: { type: Number, default: 0, min: 0 },
}, { timestamps: true });

module.exports = LoyaltyWalletSchema;
