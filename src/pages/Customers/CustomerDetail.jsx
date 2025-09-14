import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeads, deleteLead } from '../../store/features/leads/leadSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import LeadForm from '../Leads/LeadForm';

const CustomerDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { customers } = useSelector((state) => state.customers);
  const { leads, loading, error } = useSelector((state) => state.leads);
  const [statusFilter, setStatusFilter] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);

  const customer = customers.find((c) => c._id === id);

  useEffect(() => {
    if (id) {
      dispatch(fetchLeads(id));
    }
  }, [dispatch, id]);

  const handleDelete = (id) => {
    dispatch(deleteLead(id));
  };

  const handleFormSave = () => {
    setIsFormOpen(false);
    setEditingLead(null);
  };

  const filteredLeads = leads.filter(
    (lead) => statusFilter === 'all' || lead.status === statusFilter
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!customer) {
    return <div>Customer not found</div>;
  }

  return (
    <main className="p-8 bg-gray-50">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{customer.name}</h1>
        <p>{customer.email}</p>
        <p>{customer.phone}</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Leads</CardTitle>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingLead(null)}>Add Lead</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingLead ? 'Edit Lead' : 'Add Lead'}</DialogTitle>
              </DialogHeader>
              <LeadForm lead={editingLead} customerId={id} onSave={handleFormSave} />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Select onValueChange={setStatusFilter} defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Contacted">Contacted</SelectItem>
                <SelectItem value="Lost">Lost</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => (
                <TableRow key={lead._id}>
                  <TableCell>{lead.title}</TableCell>
                  <TableCell>{lead.status}</TableCell>
                  <TableCell>${lead.value}</TableCell>
                  <TableCell>{new Date(lead.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setEditingLead(lead);
                        setIsFormOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button variant="ghost" onClick={() => handleDelete(lead._id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
};

export default CustomerDetail;
