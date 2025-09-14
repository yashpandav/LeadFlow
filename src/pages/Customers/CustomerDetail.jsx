import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeads, deleteLead } from '../../store/features/leads/leadSlice';
import { fetchCustomers } from '../../store/features/customer/customerSlice';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MoreHorizontal, PlusCircle, Edit, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import LeadForm from '../Leads/LeadForm';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const CustomerDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { customers, status: customerStatus } = useSelector((state) => state.customers);
  const { leads, loading: leadsLoading, error: leadsError } = useSelector((state) => state.leads);
  
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);

  const customer = customers.find((c) => c._id === id);

  useEffect(() => {
    if (!customer) {
      dispatch(fetchCustomers());
    }
    dispatch(fetchLeads(id));
  }, [dispatch, id, customer]);

  const handleDelete = (leadId) => {
    dispatch(deleteLead(leadId));
  };

  const handleLeadFormSave = () => {
    setIsLeadFormOpen(false);
    setEditingLead(null);
    dispatch(fetchLeads(id)); // Refresh leads for the customer
  };

  const filteredLeads = leads.filter(
    (lead) => statusFilter === 'all' || lead.status === statusFilter
  );

  const totalLeads = leads.length;
  const convertedLeads = leads.filter(lead => lead.status === 'Converted').length;
  const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;
  const totalValue = leads.reduce((sum, lead) => sum + lead.value, 0);

  if (customerStatus === 'loading' || leadsLoading) {
    return <LoadingSpinner message="Loading customer details..." />;
  }

  if (!customer) {
    return <div className="text-center p-8">Customer not found.</div>;
  }

  return (
    <main className="p-8 bg-gray-50 min-h-screen">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">{customer.name}</h1>
        <p className="text-lg text-gray-600">{customer.company}</p>
        <div className="flex items-center space-x-4 mt-2">
            <a href={`mailto:${customer.email}`} className="text-sm text-gray-500 hover:text-primary">{customer.email}</a>
            <span className="text-sm text-gray-500">{customer.phone}</span>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalLeads}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Converted Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{convertedLeads}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{conversionRate.toFixed(1)}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Lead Value</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${totalValue.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Leads Table */}
      <Card className="shadow-md rounded-lg">
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Customer Leads</CardTitle>
                <CardDescription>A list of all leads associated with this customer.</CardDescription>
            </div>
          <Dialog open={isLeadFormOpen} onOpenChange={setIsLeadFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingLead(null)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Lead
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingLead ? 'Edit Lead' : 'Add Lead'}</DialogTitle>
              </DialogHeader>
              <LeadForm lead={editingLead} customerId={id} onSave={handleLeadFormSave} />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Select onValueChange={setStatusFilter} defaultValue="all">
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Contacted">Contacted</SelectItem>
                <SelectItem value="Converted">Converted</SelectItem>
                <SelectItem value="Lost">Lost</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="border rounded-lg">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {filteredLeads.length > 0 ? (
                    filteredLeads.map((lead) => (
                    <TableRow key={lead._id}>
                        <TableCell className="font-medium">{lead.title}</TableCell>
                        <TableCell>{lead.status}</TableCell>
                        <TableCell>${lead.value.toLocaleString()}</TableCell>
                        <TableCell>{new Date(lead.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                onClick={() => {
                                    setEditingLead(lead);
                                    setIsLeadFormOpen(true);
                                }}
                                >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDelete(lead._id)} className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        </TableCell>
                    </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                        No leads found for this customer.
                        </TableCell>
                    </TableRow>
                )}
                </TableBody>
            </Table>
          </div>
          {leadsError && <p className="text-red-500 mt-4">Error loading leads: {leadsError}</p>}
        </CardContent>
      </Card>
    </main>
  );
};

export default CustomerDetail;
