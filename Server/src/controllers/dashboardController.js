const Customer = require('../models/customer');
const Lead = require('../models/lead');

exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const userCustomers = await Customer.find({ ownerId: userId }).select('_id');
    const customerIds = userCustomers.map(customer => customer._id);

    const totalCustomers = await Customer.countDocuments({ ownerId: userId });
    const totalLeads = await Lead.countDocuments({ customerId: { $in: customerIds } });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const newCustomers = await Customer.countDocuments({ ownerId: userId, createdAt: { $gte: sevenDaysAgo } });
    const newLeads = await Lead.countDocuments({ customerId: { $in: customerIds }, status: 'New' });
    const convertedLeads = await Lead.countDocuments({ customerId: { $in: customerIds }, status: 'Converted' });

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
        totalCustomers,
        totalLeads,
        newCustomers,
        newLeads,
        convertedLeads,
        leadsByStatus: leadsByStatusFormatted,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
