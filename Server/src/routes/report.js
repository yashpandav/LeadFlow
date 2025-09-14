const express = require('express');
const router = express.Router();
const { getReportData } = require('../controllers/reportController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/').get(getReportData);

module.exports = router;