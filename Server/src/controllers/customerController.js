const Customer = require('../models/customer');
const Lead = require('../models/lead');
const yup = require('yup');

// customer schema
const customerSchema = yup.object().shape({
  name: yup.string().required('Name is required').trim(),
  email: yup.string().email('Invalid email format').required('Email is required').trim().lowercase(),
  phone: yup.string().trim(),
  company: yup.string().trim(),
});

// add a new customer
exports.addCustomer = async (req, res) => {
  try {
    await customerSchema.validate(req.body);

    const { name, email, phone, company } = req.body;

    const customer = await Customer.create({
      name,
      email,
      phone,
      company,
      ownerId: req.user.id, 
    });

    res.status(201).json({ success: true, data: customer, message: 'Customer added successfully' });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// get all customers for the logged-in user
exports.getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({ ownerId: req.user.id });
    res.status(200).json({ success: true, data: customers });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// get a single customer by ID
exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findOne({
      _id: req.params.id,
      ownerId: req.user.id,
    });

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    res.status(200).json({ success: true, data: customer });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// update a customer
exports.updateCustomer = async (req, res) => {
  try {
    await customerSchema.validate(req.body);

    let customer = await Customer.findOne({
      _id: req.params.id,
      ownerId: req.user.id,
    });

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: customer, message: 'Customer updated successfully' });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// delete a customer
exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOne({
      _id: req.params.id,
      ownerId: req.user.id,
    });

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    // Also delete all leads associated with this customer
    await Lead.deleteMany({ customerId: req.params.id });

    await customer.deleteOne();

    res.status(200).json({ success: true, data: {}, message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};