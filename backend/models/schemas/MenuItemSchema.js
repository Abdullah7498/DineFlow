const { Schema } = require('mongoose');

const MenuItemSchema = new Schema({
  branch: { type: Schema.Types.ObjectId, ref: 'Branch', required: true, index: true },
  category: { type: Schema.Types.ObjectId, ref: 'MenuCategory', required: true, index: true },
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  imageUrl: { type: String, trim: true },
  imageKey: { type: String, trim: true },
  price: { type: Number, required: true, min: 0 },
  taxRate: { type: Number, default: 0, min: 0 },
  available: { type: Boolean, default: true },
  preparationMinutes: { type: Number, default: 15, min: 0 },
}, { timestamps: true });

MenuItemSchema.index({ branch: 1, category: 1, name: 1 }, { unique: true });

module.exports = MenuItemSchema;
