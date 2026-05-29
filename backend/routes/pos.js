const express = require('express');

const posController = require('../controllers/posController');
const { protect, restrictTo } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);

router.post('/create-bill', restrictTo('owner', 'manager', 'cashier'), posController.createBill);
router.post('/refund', restrictTo('owner', 'manager', 'cashier'), posController.refund);

module.exports = router;
