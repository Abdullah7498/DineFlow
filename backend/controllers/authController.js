const authService = require('../services/authService');

const getTenantKey = (req) => req.headers['x-tenant'] || req.query.tenant;

const seedSuperAdmin = async (req, res, next) => {
  try {
    const superAdmin = await authService.seedSuperAdmin(req.body);

    res.status(201).json({
      success: true,
      message: 'Superadmin account seeded successfully',
      data: superAdmin,
    });
  } catch (error) {
    next(error);
  }
};

const loginSuperAdmin = async (req, res, next) => {
  try {
    const { token, user } = await authService.loginSuperAdmin(req.body);

    res.status(200).json({
      success: true,
      token,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const registerTenant = async (req, res, next) => {
  try {
    const tenant = await authService.registerTenant(req.body);

    res.status(201).json({
      success: true,
      message: 'Tenant DB provisioned & Restaurant Owner registered successfully!',
      data: tenant,
    });
  } catch (error) {
    next(error);
  }
};

const registerEmployee = async (req, res, next) => {
  try {
    const employee = await authService.registerEmployee({
      tenantDb: req.tenantDb,
      models: req.models,
      ...req.body,
    });

    res.status(201).json({
      success: true,
      message: 'Employee registered successfully!',
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

const loginEmployee = async (req, res, next) => {
  try {
    const { token, user } = await authService.loginEmployee(req.body);

    res.status(200).json({
      success: true,
      token,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const loginOwner = async (req, res, next) => {
  try {
    const { token, user } = await authService.loginOwner({
      tenantKey: getTenantKey(req),
      ...req.body,
    });

    res.status(200).json({
      success: true,
      token,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const registerCustomer = async (req, res, next) => {
  try {
    const customer = await authService.registerCustomer({
      tenantKey: getTenantKey(req),
      ...req.body,
    });

    res.status(201).json({
      success: true,
      message: 'Customer registered successfully!',
      data: customer,
    });
  } catch (error) {
    next(error);
  }
};

const loginCustomer = async (req, res, next) => {
  try {
    const { token, user } = await authService.loginCustomer({
      tenantKey: getTenantKey(req),
      ...req.body,
    });

    res.status(200).json({
      success: true,
      token,
      data: user,
    });
  } catch (error) {
    next(error);
  }
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
