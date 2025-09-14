const Customer = require('../models/customer');
const Lead = require('../models/lead');

exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const userCustomers = await Customer.find({ ownerId: userId }).select('_id');
    const customerIds = userCustomers.map(customer => customer._id);

    const totalCustomers = await Customer.countDocuments({ ownerId: userId });
    const totalLeads = await Lead.countDocuments({ customerId: { $in: customerIds } });
    const convertedLeads = await Lead.countDocuments({ customerId: { $in: customerIds }, status: 'Converted' });

    const leadConversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const newCustomers = await Customer.countDocuments({ ownerId: userId, createdAt: { $gte: sevenDaysAgo } });
    
    const recentLeads = await Lead.find({ customerId: { $in: customerIds } })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('customerId', 'name');

    const leadsByStatus = await Lead.aggregate([
      { $match: { customerId: { $in: customerIds } } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $project: { name: '$_id', value: '$count', _id: 0 } },
    ]);

    const topCustomers = await Lead.aggregate([
      { $match: { customerId: { $in: customerIds } } },
      { $group: { _id: '$customerId', leadCount: { $sum: 1 } } },
      { $sort: { leadCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'customers',
          localField: '_id',
          foreignField: '_id',
          as: 'customer',
        },
      },
      { $unwind: '$customer' },
      { $project: { name: '$customer.name', value: '$leadCount', _id: 0 } },
    ]);

    const leadsOverTime = await Lead.aggregate([
      { $match: { customerId: { $in: customerIds }, createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { date: '$_id', count: 1, _id: 0 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalCustomers,
        totalLeads,
        convertedLeads,
        newCustomers,
        leadConversionRate,
        recentLeads,
        leadsByStatus,
        topCustomers,
        leadsOverTime,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
