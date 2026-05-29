const express = require('express');

const orderController = require('../controllers/orderController');
const { protect, restrictTo } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);

router.post('/', restrictTo('owner', 'manager', 'cashier', 'waiter', 'customer'), orderController.createOrder);
router.get('/', restrictTo('owner', 'manager', 'cashier', 'chef', 'waiter'), orderController.listOrders);
router.get('/live', restrictTo('owner', 'manager', 'cashier', 'chef', 'waiter'), orderController.listLiveOrders);
router.patch('/:id/status', restrictTo('owner', 'manager', 'cashier', 'chef', 'waiter'), orderController.updateOrderStatus);

module.exports = router;
