import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getReportData } from '../../store/features/report/reportSlice';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Reports = () => {
  const dispatch = useDispatch();
  const { customers, leads, leadsByStatus, status } = useSelector((state) => state.report);
  const reportRef = useRef();

  useEffect(() => {
    dispatch(getReportData());
  }, [dispatch]);

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Report', 20, 10);

    autoTable(doc, {
      head: [['Name', 'Email', 'Phone', 'Company']],
      body: customers.map(customer => [customer.name, customer.email, customer.phone, customer.company]),
      startY: 20,
    });

    autoTable(doc, {
      head: [['Title', 'Description', 'Status', 'Value', 'Customer']],
      body: leads.map(lead => [lead.title, lead.description, lead.status, lead.value, lead.customerId.name]),
      startY: doc.previous.finalY + 10,
    });

    doc.save('report.pdf');
  };

  if (status === 'loading') {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="text-2xl font-bold">Loading...</div>
        </div>
    );
  }

  return (
    <main className="p-6 sm:p-10 bg-gray-100 min-h-screen" ref={reportRef}>
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800">Reports</h1>
        <button
          onClick={exportToPDF}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
        >
          Export to PDF
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-10">
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Leads by Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={leadsByStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
              >
                {leadsByStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="lg:col-span-2">
            {/* Placeholder for future charts or summaries */}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg mb-10">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Customers</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg">
            <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <tr>
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-left">Phone</th>
                <th className="py-3 px-6 text-left">Company</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {customers.map(customer => (
                <tr key={customer._id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left whitespace-nowrap">{customer.name}</td>
                  <td className="py-3 px-6 text-left">{customer.email}</td>
                  <td className="py-3 px-6 text-left">{customer.phone}</td>
                  <td className="py-3 px-6 text-left">{customer.company}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Leads</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg">
            <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <tr>
                <th className="py-3 px-6 text-left">Title</th>
                <th className="py-3 px-6 text-left">Description</th>
                <th className="py-3 px-6 text-left">Status</th>
                <th className="py-3 px-6 text-left">Value</th>
                <th className="py-3 px-6 text-left">Customer</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {leads.map(lead => (
                <tr key={lead._id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left whitespace-nowrap">{lead.title}</td>
                  <td className="py-3 px-6 text-left">{lead.description}</td>
                  <td className="py-3 px-6 text-left">{lead.status}</td>
                  <td className="py-3 px-6 text-left">{lead.value}</td>
                  <td className="py-3 px-6 text-left">{lead.customerId.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default Reports;