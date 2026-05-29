const { Schema } = require('mongoose');

const PaymentSchema = new Schema({
  order: { type: Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
  branch: { type: Schema.Types.ObjectId, ref: 'Branch', required: true, index: true },
  method: {
    type: String,
    enum: ['cash', 'card', 'wallet', 'bank_transfer', 'split'],
    required: true,
  },
  amount: { type: Number, required: true, min: 0 },
  status: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'paid',
  },
  reference: { type: String, trim: true },
  receivedBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = PaymentSchema;
