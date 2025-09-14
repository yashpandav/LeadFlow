const Customer = require('../models/customer');
const Lead = require('../models/lead');
const mongoose = require('mongoose');

exports.getReports = async (req, res) => {
  try {
    const userId = req.user.id;
    const { dateRange } = req.query;

    let startDate;
    const endDate = new Date();

    if (dateRange === 'last7days') {
      startDate = new Date();
      startDate.setDate(endDate.getDate() - 7);
    } else if (dateRange === 'last30days') {
      startDate = new Date();
      startDate.setDate(endDate.getDate() - 30);
    } else if (dateRange === 'thisYear') {
      startDate = new Date(endDate.getFullYear(), 0, 1);
    }

    const dateFilter = startDate ? { createdAt: { $gte: startDate, $lte: endDate } } : {};

    const customers = await Customer.find({ ownerId: userId });
    const customerIds = customers.map((c) => c._id);

    const leads = await Lead.find({ customerId: { $in: customerIds }, ...dateFilter }).populate('customerId', 'name');

    const leadsByStatus = await Lead.aggregate([
      { $match: { customerId: { $in: customerIds }, ...dateFilter } },
      { $group: { _id: '$status', value: { $sum: 1 } } },
      { $project: { name: '$_id', value: 1, _id: 0 } },
    ]);

    const leadConversionFunnel = await Lead.aggregate([
        { $match: { customerId: { $in: customerIds } } },
        {
            $group: {
                _id: null,
                New: { $sum: { $cond: [{ $eq: ['$status', 'New'] }, 1, 0] } },
                Contacted: { $sum: { $cond: [{ $eq: ['$status', 'Contacted'] }, 1, 0] } },
                Converted: { $sum: { $cond: [{ $eq: ['$status', 'Converted'] }, 1, 0] } },
                Lost: { $sum: { $cond: [{ $eq: ['$status', 'Lost'] }, 1, 0] } },
            },
        },
        {
            $project: {
                _id: 0,
                stages: [
                    { stage: 'New', count: '$New' },
                    { stage: 'Contacted', count: '$Contacted' },
                    { stage: 'Converted', count: '$Converted' },
                    { stage: 'Lost', count: '$Lost' },
                ],
            },
        },
    ]);

    const leadValueByStatus = await Lead.aggregate([
      { $match: { customerId: { $in: customerIds }, ...dateFilter } },
      { $group: { _id: '$status', totalValue: { $sum: '$value' } } },
      { $project: { name: '$_id', value: '$totalValue', _id: 0 } },
    ]);

    const customerGrowth = await Customer.aggregate([
      { $match: { ownerId: new mongoose.Types.ObjectId(userId), ...dateFilter } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { name: '$_id', value: '$count', _id: 0 } },
    ]);

    const topCustomersByLeadValue = await Lead.aggregate([
        { $match: { customerId: { $in: customerIds } } },
        { $group: { _id: '$customerId', totalLeadValue: { $sum: '$value' } } },
        { $sort: { totalLeadValue: -1 } },
        { $limit: 10 },
        {
            $lookup: {
                from: 'customers',
                localField: '_id',
                foreignField: '_id',
                as: 'customer',
            },
        },
        { $unwind: '$customer' },
        { $project: { name: '$customer.name', value: '$totalLeadValue', _id: 0 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        customers,
        leads,
        leadsByStatus,
        leadConversionFunnel: leadConversionFunnel.length > 0 ? leadConversionFunnel[0].stages : [],
        leadValueByStatus,
        customerGrowth,
        topCustomersByLeadValue,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
