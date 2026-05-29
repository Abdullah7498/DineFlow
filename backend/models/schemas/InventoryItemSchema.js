const { Schema } = require('mongoose');

const InventoryItemSchema = new Schema({
  branch: { type: Schema.Types.ObjectId, ref: 'Branch', required: true, index: true },
  name: { type: String, required: true, trim: true },
  unit: { type: String, required: true, trim: true },
  quantityOnHand: { type: Number, default: 0, min: 0 },
  reorderLevel: { type: Number, default: 0, min: 0 },
  costPerUnit: { type: Number, default: 0, min: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

InventoryItemSchema.index({ branch: 1, name: 1 }, { unique: true });

module.exports = InventoryItemSchema;
