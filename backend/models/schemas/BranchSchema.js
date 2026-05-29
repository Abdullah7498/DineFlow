const { Schema } = require('mongoose');

const BranchSchema = new Schema({
  name: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  phone: { type: String, trim: true },
  timezone: { type: String, default: 'Asia/Karachi' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = BranchSchema;
