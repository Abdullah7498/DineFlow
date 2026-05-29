const express = require('express');

const loyaltyController = require('../controllers/loyaltyController');
const { protect, restrictTo } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);
router.get('/wallet', restrictTo('customer'), loyaltyController.getMyWallet);

module.exports = router;
