const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/').get(getDashboardStats);

module.exports = router;
