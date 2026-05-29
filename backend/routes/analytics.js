const express = require('express');

const analyticsController = require('../controllers/analyticsController');
const { protect, restrictTo } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);
router.get('/dashboard', restrictTo('owner', 'manager'), analyticsController.getDashboard);

module.exports = router;
