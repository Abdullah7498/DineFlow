const express = require('express');

const restaurantController = require('../controllers/restaurantController');
const { protect, restrictTo } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);

router
  .route('/branches')
  .get(restrictTo('owner', 'manager', 'cashier', 'chef', 'waiter'), restaurantController.listBranches)
  .post(restrictTo('owner', 'manager'), restaurantController.createBranch);

router
  .route('/tables')
  .get(restrictTo('owner', 'manager', 'cashier', 'waiter'), restaurantController.listTables)
  .post(restrictTo('owner', 'manager'), restaurantController.createTable);

router.patch(
  '/tables/:id/status',
  restrictTo('owner', 'manager', 'cashier', 'waiter'),
  restaurantController.updateTableStatus
);

module.exports = router;
