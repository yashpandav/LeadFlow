const Lead = require('../models/lead');
const Customer = require('../models/customer');

// middleware to validate valid owner of customer and lead
exports.authorizeLeadAccess = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    const customer = await Customer.findOne({
      _id: lead.customerId,
      ownerId: req.user.id,
    });

    if (!customer) {
      return res
        .status(403)
        .json({ success: false, message: 'User not authorized to access this lead' });
    }

    req.lead = lead;
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
