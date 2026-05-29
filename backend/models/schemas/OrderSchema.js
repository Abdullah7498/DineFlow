const { Schema } = require('mongoose');

const OrderItemSchema = new Schema({
  menuItem: { type: Schema.Types.ObjectId, ref: 'MenuItem', required: true },
  name: { type: String, required: true },
  unitPrice: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1 },
  notes: { type: String, trim: true },
  lineTotal: { type: Number, required: true, min: 0 },
}, { _id: false });

const OrderSchema = new Schema({
  branch: { type: Schema.Types.ObjectId, ref: 'Branch', required: true, index: true },
  table: { type: Schema.Types.ObjectId, ref: 'Table', index: true },
  customer: { type: Schema.Types.ObjectId, ref: 'User', index: true },
  source: {
    type: String,
    enum: ['qr', 'pos', 'waiter', 'web'],
    default: 'qr',
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'preparing', 'prepared', 'served', 'completed', 'cancelled'],
    default: 'pending',
    index: true,
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'partial', 'paid', 'refunded'],
    default: 'unpaid',
  },
  items: { type: [OrderItemSchema], default: [] },
  subtotal: { type: Number, required: true, min: 0 },
  taxTotal: { type: Number, default: 0, min: 0 },
  discountTotal: { type: Number, default: 0, min: 0 },
  totalAmount: { type: Number, required: true, min: 0 },
  notes: { type: String, trim: true },
  statusHistory: [{
    status: String,
    changedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    changedAt: { type: Date, default: Date.now },
  }],
}, { timestamps: true });

OrderSchema.index({ branch: 1, createdAt: -1 });

module.exports = OrderSchema;
