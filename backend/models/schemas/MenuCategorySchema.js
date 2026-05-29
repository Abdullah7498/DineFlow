const { Schema } = require('mongoose');

const MenuCategorySchema = new Schema({
  branch: { type: Schema.Types.ObjectId, ref: 'Branch', required: true, index: true },
  name: { type: String, required: true, trim: true },
  displayOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

MenuCategorySchema.index({ branch: 1, name: 1 }, { unique: true });

module.exports = MenuCategorySchema;
