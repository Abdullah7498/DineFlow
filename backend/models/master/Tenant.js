const mongoose = require('mongoose');

const TenantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  prefix: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  dbName: {
    type: String,
    required: true,
    unique: true,
  },
  lastEmployeeNumber: {
    type: Number,
    default: 0,
  },
  adminEmail: {
    type: String,
    required: true,
    lowercase: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

module.exports = TenantSchema;
