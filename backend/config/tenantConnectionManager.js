const mongoose = require('mongoose');
const env = require('./env');

const UserSchema = require('../models/schemas/UserSchema');

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
  };

  connectionCache[dbName] = { connection, models };

  return connectionCache[dbName];
};

module.exports = {
  getTenantConnection,
};
