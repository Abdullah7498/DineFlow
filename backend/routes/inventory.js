const express = require('express');

const inventoryController = require('../controllers/inventoryController');
const { protect, restrictTo } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(restrictTo('owner', 'manager', 'chef'), inventoryController.listInventory)
  .post(restrictTo('owner', 'manager'), inventoryController.createInventoryItem);

router.patch('/:id/adjust', restrictTo('owner', 'manager', 'chef'), inventoryController.adjustStock);

module.exports = router;
