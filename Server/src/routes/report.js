const express = require('express');
const router = express.Router();
const { getReports } = require('../controllers/reportController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getReports);

module.exports = router;