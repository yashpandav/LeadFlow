const Lead = require('../models/lead');
const Customer = require('../models/customer');
const yup = require('yup');

const leadSchema = yup.object().shape({
  title: yup.string().required(),
  description: yup.string(),
  status: yup.string().oneOf(['New', 'Contacted', 'Qualified', 'Proposal', 'Converted', 'Lost']),
  value: yup.number(),
  customerId: yup.string().required(),
});

const updateLeadSchema = yup.object().shape({
  title: yup.string(),
  description: yup.string(),
  status: yup.string().oneOf(['New', 'Contacted', 'Qualified', 'Proposal', 'Converted', 'Lost']),
  value: yup.number(),
});


// create a new lead for a customer
exports.addLead = async (req, res) => {
  try {
    await leadSchema.validate(req.body);

    const { title, description, status, value, customerId } = req.body;

    const customer = await Customer.findOne({
      _id: customerId,
      ownerId: req.user.id,
    });

    if (!customer) {
      return res
        .status(404)
        .json({ success: false, message: 'Customer not found or user not authorized' });
    }

    const lead = await Lead.create({
      customerId,
      title,
      description,
      status,
      value,
    });

    const populatedLead = await Lead.findById(lead._id).populate('customerId', 'name');


    res.status(201).json({ success: true, data: populatedLead });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// get all leads for a customer
exports.getLeads = async (req, res) => {
  try {
    const customerId = req.params.id;

    const customer = await Customer.findOne({
      _id: customerId,
      ownerId: req.user.id,
    });

    if (!customer) {
      return res
        .status(404)
        .json({ success: false, message: 'Customer not found or user not authorized' });
    }

    const leads = await Lead.find({ customerId });
    res.status(200).json({ success: true, data: leads });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// get all leads for the logged-in user with pagination
exports.getAllLeads = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const userCustomers = await Customer.find({ ownerId: req.user.id }).select('_id');
    const customerIds = userCustomers.map(customer => customer._id);

    const query = { customerId: { $in: customerIds } };

    const leads = await Lead.find(query)
      .populate('customerId', 'name')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Lead.countDocuments(query);

    res.status(200).json({
      success: true,
      data: leads,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// update a lead
exports.updateLead = async (req, res) => {
  try {
    await updateLeadSchema.validate(req.body);

    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    const populatedLead = await Lead.findById(lead._id).populate('customerId', 'name');

    res.status(200).json({ success: true, data: populatedLead });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// delete a lead
exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    
    await lead.remove();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};