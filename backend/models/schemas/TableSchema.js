const { Schema } = require('mongoose');

const TableSchema = new Schema({
  branch: { type: Schema.Types.ObjectId, ref: 'Branch', required: true, index: true },
  tableNumber: { type: String, required: true, trim: true },
  capacity: { type: Number, default: 4, min: 1 },
  status: {
    type: String,
    enum: ['available', 'occupied', 'reserved', 'needs_cleaning', 'inactive'],
    default: 'available',
  },
  qrPayload: {
    tenantDb: String,
    branchId: String,
    tableId: String,
    tableNumber: String,
  },
}, { timestamps: true });

TableSchema.index({ branch: 1, tableNumber: 1 }, { unique: true });

module.exports = TableSchema;
