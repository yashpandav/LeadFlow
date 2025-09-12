const express = require('express');
const router = express.Router();
const {
  getAllLeads,
  updateLead,
  deleteLead,
  addLead,
  getLeads,
} = require('../controllers/leadController');
const { protect } = require('../middleware/auth');
const { authorizeLeadAccess } = require('../middleware/leadAuthorization');

router.use(protect);

router.route('/').get(getAllLeads).post(addLead);

router
  .route('/:id')
  .get(getLeads)
  .put(authorizeLeadAccess, updateLead)
  .delete(authorizeLeadAccess, deleteLead);

module.exports = router;
