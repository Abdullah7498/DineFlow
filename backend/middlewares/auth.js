const jwt = require('jsonwebtoken')
const env = require('../config/env')
const { getTenantConnection } = require('../config/tenantConnectionManager')
const { SuperAdmin } = require('../models/masterModels')

/**
 * Centralized authentication middleware verifying tokens and mounting tenant DB connection scopes dynamically.
 */
const protect = async (req, res, next) => {
  try {
    let token

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1]
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token
    }

    if (!token) {
      res.status(401)
      throw new Error('Not authorized, no token provided')
    }

    // Verify and decode JWT
    const decoded = jwt.verify(token, env.JWT_SECRET)

    // CASE 1: Super Admin (Belongs to Master Database)
    if (decoded.role === 'superadmin') {
      const superAdmin = await SuperAdmin.findById(decoded.id).select(
        '-password'
      )
      if (!superAdmin) {
        res.status(401)
        throw new Error('Superadmin account does not exist')
      }

      req.user = superAdmin
      req.isSuperAdmin = true
      return next()
    }

    // CASE 2: Tenant-scoped user (Restaurant Owner, Manager, Cashier, Chef, Waiter, Customer)
    if (!decoded.tenantDb) {
      res.status(401)
      throw new Error(
        'Access denied: Tenant database mapping is missing in token scope'
      )
    }

    // Resolve isolated tenant database connection and models
    const { connection, models } = await getTenantConnection(decoded.tenantDb)

    // Verify user exists inside the isolated database
    const user = await models.User.findById(decoded.id).select('-password')
    if (!user) {
      res.status(401)
      throw new Error('User no longer exists in this restaurant database')
    }

    if (!user.isActive) {
      res.status(403)
      throw new Error('Your user profile has been deactivated')
    }

    // Mount user identity and dynamic database model scopes onto the request object
    req.user = user
    req.db = connection
    req.models = models
    req.tenantDb = decoded.tenantDb
    req.isSuperAdmin = false

    next()
  } catch (error) {
    res.status(401)
    next(new Error(error.message || 'Token validation failed, not authorized'))
  }
}

/**
 * Middleware restricting access to specified roles.
 * Works seamlessly with both SuperAdmin and Tenant user roles.
 */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401)
      return next(new Error('User identity context not found'))
    }

    if (!roles.includes(req.user.role)) {
      res.status(403)
      return next(
        new Error(
          `Permission denied: Access restricted to [${roles.join(', ')}]`
        )
      )
    }

    next()
  }
}

module.exports = {
  protect,
  restrictTo
}
