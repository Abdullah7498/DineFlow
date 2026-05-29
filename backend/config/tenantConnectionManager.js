const mongoose = require('mongoose');
const env = require('./env');

const UserSchema = require('../models/schemas/UserSchema');
const BranchSchema = require('../models/schemas/BranchSchema');
const TableSchema = require('../models/schemas/TableSchema');
const MenuCategorySchema = require('../models/schemas/MenuCategorySchema');
const MenuItemSchema = require('../models/schemas/MenuItemSchema');
const OrderSchema = require('../models/schemas/OrderSchema');
const PaymentSchema = require('../models/schemas/PaymentSchema');
const InventoryItemSchema = require('../models/schemas/InventoryItemSchema');
const LoyaltyWalletSchema = require('../models/schemas/LoyaltyWalletSchema');

// Cache to store tenant connections and dynamically compiled models
const connectionCache = {};

/**
 * Retrieves or establishes a separate, isolated database connection for a tenant.
 * @param {string} dbName - The exact database name of the tenant (e.g., 'saas-restaurant_tenant_kfc').
 * @returns {Promise<Object>} Object containing the tenant-specific connection and its models.
 */
const getTenantConnection = async (dbName) => {
  if (connectionCache[dbName]) {
    return connectionCache[dbName];
  }

  // Parse parent base URI
  const baseUri = env.MONGO_URI.endsWith('/') ? env.MONGO_URI.slice(0, -1) : env.MONGO_URI;
  
  // Clean base connection path to extract host details and append the custom tenant DB name
  const lastSlashIndex = baseUri.lastIndexOf('/');
  const connectionString = baseUri.substring(0, lastSlashIndex + 1) + dbName;

  console.log(`🔌 Dynamic Connection: Establishing isolated pool for DB [${dbName}]`);

  const connection = mongoose.createConnection(connectionString, {
    maxPoolSize: 10,
  });

  await new Promise((resolve, reject) => {
    connection.once('open', () => {
      console.log(`📡 MongoDB Connected: Isolated DB pool established for [${dbName}]`);
      resolve();
    });
    connection.once('error', (err) => {
      console.error(`❌ MongoDB Connection Error for DB [${dbName}]:`, err.message);
      reject(err);
    });
  });

  // Dynamically compile and bind schemas specifically to this connection instance
  const models = {
    User: connection.model('User', UserSchema),
    Branch: connection.model('Branch', BranchSchema),
    Table: connection.model('Table', TableSchema),
    MenuCategory: connection.model('MenuCategory', MenuCategorySchema),
    MenuItem: connection.model('MenuItem', MenuItemSchema),
    Order: connection.model('Order', OrderSchema),
    Payment: connection.model('Payment', PaymentSchema),
    InventoryItem: connection.model('InventoryItem', InventoryItemSchema),
    LoyaltyWallet: connection.model('LoyaltyWallet', LoyaltyWalletSchema),
  };

  connectionCache[dbName] = { connection, models };

  return connectionCache[dbName];
};

module.exports = {
  getTenantConnection,
};
