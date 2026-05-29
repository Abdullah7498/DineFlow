const QRCode = require('qrcode');

const createHttpError = require('../utils/httpError');

const listBranches = ({ models }) => models.Branch.find().sort({ createdAt: -1 });

const createBranch = ({ models, body }) => {
  return models.Branch.create({
    name: body.name,
    address: body.address,
    phone: body.phone,
    timezone: body.timezone,
  });
};

const listTables = ({ models, branchId }) => {
  return models.Table.find(branchId ? { branch: branchId } : {}).sort({ tableNumber: 1 });
};

const createTable = async ({ models, tenantDb, body }) => {
  const branch = await models.Branch.findById(body.branchId);
  if (!branch) throw createHttpError('Branch not found', 404);

  const table = await models.Table.create({
    branch: branch._id,
    tableNumber: body.tableNumber,
    capacity: body.capacity,
    status: body.status,
  });

  table.qrPayload = {
    tenantDb,
    branchId: branch._id.toString(),
    tableId: table._id.toString(),
    tableNumber: table.tableNumber,
  };
  await table.save();

  const qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify(table.qrPayload));
  return { table, qrCodeDataUrl };
};

const updateTableStatus = async ({ models, tableId, status }) => {
  const table = await models.Table.findByIdAndUpdate(tableId, { status }, { new: true });
  if (!table) throw createHttpError('Table not found', 404);
  return table;
};

module.exports = {
  listBranches,
  createBranch,
  listTables,
  createTable,
  updateTableStatus,
};
