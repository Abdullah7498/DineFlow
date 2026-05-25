const { Schema } = require('mongoose');

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['owner', 'manager', 'cashier', 'chef', 'waiter', 'customer'],
    required: true,
  },
  employeeKey: {
    type: String, // e.g. kfc1, kfc2
    unique: true,
    sparse: true, // Allows null for customers/users who do not have an employeeKey
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

module.exports = UserSchema;
