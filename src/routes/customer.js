const express = require('express');
const router = express.Router();
const {
  addCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} = require('../controllers/customerController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/').post(addCustomer).get(getCustomers);

router
  .route('/:id')
  .get(getCustomerById)
  .put(updateCustomer)
  .delete(deleteCustomer);

module.exports = router;
