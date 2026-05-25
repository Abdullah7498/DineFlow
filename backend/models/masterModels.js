const mongoose = require('mongoose');
const TenantSchema = require('./master/Tenant');
const SuperAdminSchema = require('./master/SuperAdmin');

const Tenant = mongoose.model('Tenant', TenantSchema);
const SuperAdmin = mongoose.model('SuperAdmin', SuperAdminSchema);

module.exports = {
  Tenant,
  SuperAdmin,
};
