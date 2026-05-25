const express = require('express');

const authController = require('../controllers/authController');
const { protect, restrictTo } = require('../middlewares/auth');

const router = express.Router();

router.post('/superadmin/setup', authController.seedSuperAdmin);
router.post('/superadmin/login', authController.loginSuperAdmin);

router.post(
  '/tenant/register',
  protect,
  restrictTo('superadmin'),
  authController.registerTenant
);

router.post(
  '/employee/register',
  protect,
  restrictTo('owner', 'manager'),
  authController.registerEmployee
);

router.post('/employee/login', authController.loginEmployee);
router.post('/owner/login', authController.loginOwner);
router.post('/customer/register', authController.registerCustomer);
router.post('/customer/login', authController.loginCustomer);

module.exports = router;
