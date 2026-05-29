const express = require('express');

const menuController = require('../controllers/menuController');
const { protect, restrictTo } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);

router.get('/', restrictTo('owner', 'manager', 'cashier', 'chef', 'waiter', 'customer'), menuController.listMenu);
router.post('/categories', restrictTo('owner', 'manager'), menuController.createCategory);
router.post('/items', restrictTo('owner', 'manager'), menuController.createItem);
router.patch('/items/:id/availability', restrictTo('owner', 'manager', 'chef'), menuController.updateItemAvailability);

module.exports = router;
