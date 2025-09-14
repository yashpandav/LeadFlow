import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getReportData } from '../../store/features/report/reportSlice';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const COLORS = ['#14b8a6', '#7c3aed', '#f97316', '#3b82f6', '#ef4444'];

const EmptyChart = () => (
    <div className="flex items-center justify-center h-full">
      <p className="text-gray-500">No data to display for the selected period</p>
    </div>
);

const Reports = () => {
  const dispatch = useDispatch();
  const { 
    customers, 
    leads, 
    leadsByStatus, 
    leadConversionFunnel, 
    leadValueByStatus, 
    customerGrowth, 
    topCustomersByLeadValue, 
    status 
  } = useSelector((state) => state.report);
  
  const [dateRange, setDateRange] = useState('all');

  useEffect(() => {
    dispatch(getReportData({ dateRange }));
  }, [dispatch, dateRange]);

  if (status === 'loading') {
    return (
        <LoadingSpinner message="Generating your reports..." />
    );
  }

  return (
    <main className="p-6 sm:p-10 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800">Reports</h1>
        <Select onValueChange={setDateRange} value={dateRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="last7days">Last 7 Days</SelectItem>
            <SelectItem value="last30days">Last 30 Days</SelectItem>
            <SelectItem value="thisYear">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <h2 className="text-3xl font-semibold text-gray-700 mb-6">Lead Reports</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
        <Card className="shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle>Leads by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              {leadsByStatus.length > 0 ? (
                <PieChart>
                  <Pie data={leadsByStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                    {leadsByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              ) : (
                <EmptyChart />
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle>Lead Conversion Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              {leadConversionFunnel.length > 0 ? (
                <BarChart data={leadConversionFunnel} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="stage" width={80} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#14b8a6" name="Count" />
                </BarChart>
              ) : (
                <EmptyChart />
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle>Lead Value by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              {leadValueByStatus.length > 0 ? (
                <BarChart data={leadValueByStatus}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#7c3aed" name="Total Value" />
                </BarChart>
              ) : (
                <EmptyChart />
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-3xl font-semibold text-gray-700 mb-6">Customer Reports</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <Card className="shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle>Customer Growth Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              {customerGrowth.length > 0 ? (
                <LineChart data={customerGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#14b8a6" name="New Customers" />
                </LineChart>
              ) : (
                <EmptyChart />
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle>Top Customers by Lead Value</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              {topCustomersByLeadValue.length > 0 ? (
                <BarChart data={topCustomersByLeadValue} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={100} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#7c3aed" name="Total Lead Value" />
                </BarChart>
              ) : (
                <EmptyChart />
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg rounded-lg mb-10">
        <CardHeader>
          <CardTitle>All Customers</CardTitle>
        </CardHeader>
        <CardContent>
          {customers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Company</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer._id}>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>{customer.company}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-gray-500 py-4">No customers found for this period.</p>
          )}
        </CardContent>
      </Card>

      <h2 className="text-3xl font-semibold text-gray-700 mb-6">Lead Drilldown</h2>
      <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle>All Leads</CardTitle>
        </CardHeader>
        <CardContent>
          {leads.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Created At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead._id}>
                    <TableCell>{lead.title}</TableCell>
                    <TableCell>{lead.customerId.name}</TableCell>
                    <TableCell>{lead.status}</TableCell>
                    <TableCell>${lead.value.toLocaleString()}</TableCell>
                    <TableCell>{new Date(lead.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-gray-500 py-4">No leads found for this period.</p>
          )}
        </CardContent>
      </Card>
    </main>
  );
};

export default Reports;
