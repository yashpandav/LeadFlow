const Customer = require('../models/customer');
const Lead = require('../models/lead');

exports.getReportData = async (req, res) => {
  try {
    const userId = req.user.id;

    const userCustomers = await Customer.find({ ownerId: userId }).select('_id');
    const customerIds = userCustomers.map(customer => customer._id);

    const customers = await Customer.find({ ownerId: userId });
    const leads = await Lead.find({ customerId: { $in: customerIds } }).populate('customerId', 'name');

    const leadsByStatus = await Lead.aggregate([
      { $match: { customerId: { $in: customerIds } } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const leadsByStatusFormatted = leadsByStatus.map(status => ({
      name: status._id,
      value: status.count,
    }));

    res.status(200).json({
      success: true,
      data: {
        customers,
        leads,
        leadsByStatus: leadsByStatusFormatted,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};