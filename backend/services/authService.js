const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const env = require('../config/env');
const { getTenantConnection } = require('../config/tenantConnectionManager');
const { Tenant, SuperAdmin } = require('../models/masterModels');

const EMPLOYEE_ROLES = ['manager', 'cashier', 'chef', 'waiter'];
const OWNER_LOGIN_ROLES = ['owner', 'manager'];

const signToken = (payload) => {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: '1d' });
};

const normalizeTenantKey = (tenantKey) => {
  return tenantKey ? tenantKey.toLowerCase().trim() : '';
};

const getTenantByKey = async (tenantKey) => {
  const normalizedTenantKey = normalizeTenantKey(tenantKey);

  if (!normalizedTenantKey) {
    return null;
  }

  return Tenant.findOne({
    $or: [
      { prefix: normalizedTenantKey },
      { slug: normalizedTenantKey },
    ],
  });
};

const seedSuperAdmin = async ({ name, email, password }) => {
  const count = await SuperAdmin.countDocuments();
  if (count > 0) {
    const error = new Error('SaaS platform Superadmin account has already been seeded');
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const superAdmin = await SuperAdmin.create({
    name,
    email,
    password: hashedPassword,
  });

  return {
    id: superAdmin._id,
    name: superAdmin.name,
    email: superAdmin.email,
  };
};

const loginSuperAdmin = async ({ email, password }) => {
  const superAdmin = await SuperAdmin.findOne({ email });
  if (!superAdmin || !(await bcrypt.compare(password, superAdmin.password))) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const token = signToken({ id: superAdmin._id, role: 'superadmin' });

  return {
    token,
    user: {
      id: superAdmin._id,
      name: superAdmin.name,
      email: superAdmin.email,
      role: 'superadmin',
    },
  };
};

const registerTenant = async ({ name, slug, prefix, adminEmail, adminName, adminPassword }) => {
  if (!name || !slug || !prefix || !adminEmail || !adminPassword) {
    const error = new Error('Missing required fields for tenant registration');
    error.statusCode = 400;
    throw error;
  }

  const normalizedSlug = slug.toLowerCase().trim();
  const normalizedPrefix = prefix.toLowerCase().trim();

  const existingTenant = await Tenant.findOne({
    $or: [{ slug: normalizedSlug }, { prefix: normalizedPrefix }],
  });
  if (existingTenant) {
    const error = new Error('Tenant slug or prefix is already registered');
    error.statusCode = 400;
    throw error;
  }

  const dbName = `saas-restaurant_tenant_${normalizedSlug}`;

  const tenant = await Tenant.create({
    name,
    slug: normalizedSlug,
    prefix: normalizedPrefix,
    dbName,
    adminEmail,
  });

  const { models } = await getTenantConnection(dbName);

  const hashedOwnerPassword = await bcrypt.hash(adminPassword, 10);
  const owner = await models.User.create({
    name: adminName || 'Restaurant Owner',
    email: adminEmail,
    password: hashedOwnerPassword,
    role: 'owner',
  });

  return {
    tenantId: tenant._id,
    tenantName: tenant.name,
    tenantPrefix: tenant.prefix,
    tenantDb: tenant.dbName,
    owner: {
      id: owner._id,
      name: owner.name,
      email: owner.email,
      role: owner.role,
    },
  };
};

const registerEmployee = async ({ tenantDb, models, name, email, password, role, phone }) => {
  if (!EMPLOYEE_ROLES.includes(role)) {
    const error = new Error('Invalid employee role specified');
    error.statusCode = 400;
    throw error;
  }

  const tenant = await Tenant.findOne({ dbName: tenantDb });
  if (!tenant) {
    const error = new Error('Associated tenant registry not found');
    error.statusCode = 404;
    throw error;
  }

  const existingUser = await models.User.findOne({ email });
  if (existingUser) {
    const error = new Error('Email is already registered under this restaurant');
    error.statusCode = 400;
    throw error;
  }

  const updatedTenant = await Tenant.findByIdAndUpdate(
    tenant._id,
    { $inc: { lastEmployeeNumber: 1 } },
    { new: true }
  );

  const employeeKey = `${updatedTenant.prefix}${updatedTenant.lastEmployeeNumber}`;
  const hashedEmployeePassword = await bcrypt.hash(password, 10);
  const employee = await models.User.create({
    name,
    email,
    password: hashedEmployeePassword,
    role,
    employeeKey,
    phone,
  });

  return {
    id: employee._id,
    name: employee.name,
    role: employee.role,
    employeeKey: employee.employeeKey,
    email: employee.email,
  };
};

const loginEmployee = async ({ employeeKey, password }) => {
  if (!employeeKey || !password) {
    const error = new Error('Please enter both employee key and password');
    error.statusCode = 400;
    throw error;
  }

  const match = employeeKey.match(/^([a-zA-Z]+)(\d+)$/);
  if (!match) {
    const error = new Error('Invalid employee key format (expected e.g., kfc101)');
    error.statusCode = 400;
    throw error;
  }

  const prefix = match[1].toLowerCase().trim();
  const tenant = await Tenant.findOne({ prefix });
  if (!tenant) {
    const error = new Error('No restaurant registered with this prefix');
    error.statusCode = 404;
    throw error;
  }

  const { models } = await getTenantConnection(tenant.dbName);
  const employee = await models.User.findOne({ employeeKey });
  if (!employee || !(await bcrypt.compare(password, employee.password))) {
    const error = new Error('Invalid employee key or password');
    error.statusCode = 401;
    throw error;
  }

  if (!employee.isActive) {
    const error = new Error('This employee profile is currently deactivated');
    error.statusCode = 403;
    throw error;
  }

  const token = signToken({
    id: employee._id,
    role: employee.role,
    tenantDb: tenant.dbName,
  });

  return {
    token,
    user: {
      id: employee._id,
      name: employee.name,
      role: employee.role,
      employeeKey: employee.employeeKey,
      tenantName: tenant.name,
    },
  };
};

const loginOwner = async ({ tenantKey, email, password }) => {
  if (!tenantKey) {
    const error = new Error('Please specify your tenant prefix or slug in headers as x-tenant or query params');
    error.statusCode = 400;
    throw error;
  }

  const tenant = await getTenantByKey(tenantKey);
  if (!tenant) {
    const error = new Error('Restaurant tenant not found');
    error.statusCode = 404;
    throw error;
  }

  const { models } = await getTenantConnection(tenant.dbName);
  const user = await models.User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  if (!OWNER_LOGIN_ROLES.includes(user.role)) {
    const error = new Error('Access denied: Unauthorized access role');
    error.statusCode = 403;
    throw error;
  }

  const token = signToken({
    id: user._id,
    role: user.role,
    tenantDb: tenant.dbName,
  });

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      role: user.role,
      email: user.email,
      tenantName: tenant.name,
    },
  };
};

const registerCustomer = async ({ tenantKey, name, email, password, phone }) => {
  if (!tenantKey) {
    const error = new Error('Please specify restaurant tenant slug in x-tenant header or query params');
    error.statusCode = 400;
    throw error;
  }

  const tenant = await getTenantByKey(tenantKey);
  if (!tenant) {
    const error = new Error('Restaurant not found');
    error.statusCode = 404;
    throw error;
  }

  const { models } = await getTenantConnection(tenant.dbName);
  const duplicateCustomer = await models.User.findOne({ email });
  if (duplicateCustomer) {
    const error = new Error('Email is already registered under this restaurant');
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const customer = await models.User.create({
    name,
    email,
    password: hashedPassword,
    role: 'customer',
    phone,
  });

  return {
    id: customer._id,
    name: customer.name,
    email: customer.email,
    role: 'customer',
  };
};

const loginCustomer = async ({ tenantKey, email, password }) => {
  if (!tenantKey) {
    const error = new Error('Please specify restaurant tenant slug in x-tenant header or query params');
    error.statusCode = 400;
    throw error;
  }

  const tenant = await getTenantByKey(tenantKey);
  if (!tenant) {
    const error = new Error('Restaurant not found');
    error.statusCode = 404;
    throw error;
  }

  const { models } = await getTenantConnection(tenant.dbName);
  const customer = await models.User.findOne({ email, role: 'customer' });
  if (!customer || !(await bcrypt.compare(password, customer.password))) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  if (!customer.isActive) {
    const error = new Error('Your user account has been deactivated');
    error.statusCode = 403;
    throw error;
  }

  const token = signToken({
    id: customer._id,
    role: 'customer',
    tenantDb: tenant.dbName,
  });

  return {
    token,
    user: {
      id: customer._id,
      name: customer.name,
      email: customer.email,
      role: 'customer',
      tenantName: tenant.name,
    },
  };
};

module.exports = {
  seedSuperAdmin,
  loginSuperAdmin,
  registerTenant,
  registerEmployee,
  loginEmployee,
  loginOwner,
  registerCustomer,
  loginCustomer,
};
