import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCustomers, deleteCustomer } from '../../store/features/customer/customerSlice';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import CustomerForm from './CustomerForm';
import LeadForm from '../Leads/LeadForm';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const CustomersList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { customers, loading, error } = useSelector((state) => state.customers);

  const [search, setSearch] = useState('');
  const [isCustomerFormOpen, setIsCustomerFormOpen] = useState(false);
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteCustomer(id));
  };

  const handleCustomerFormSave = () => {
    setIsCustomerFormOpen(false);
    setEditingCustomer(null);
  };

  const handleLeadFormSave = () => {
    setIsLeadFormOpen(false);
    setSelectedCustomerId(null);
    dispatch(fetchCustomers()); // Refresh customer list to update lead counts
  };

  const handleRowClick = (customerId) => {
    navigate(`/customers/${customerId}`);
  };

  const openAddLeadModal = (customerId) => {
    setSelectedCustomerId(customerId);
    setIsLeadFormOpen(true);
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(search.toLowerCase()) ||
      customer.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <LoadingSpinner message="Fetching customer data..." />;
  }

  if (error) {
    return <div className="text-red-500 p-8">Error: {error}</div>;
  }

  return (
    <main className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Customers</h1>
        <Dialog open={isCustomerFormOpen} onOpenChange={setIsCustomerFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingCustomer(null)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCustomer ? 'Edit Customer' : 'Add Customer'}</DialogTitle>
            </DialogHeader>
            <CustomerForm customer={editingCustomer} onSave={handleCustomerFormSave} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="mb-4">
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="bg-white rounded-lg shadow-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className="text-center">Total Leads</TableHead>
              <TableHead className="text-right pr-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <TableRow 
                  key={customer._id} 
                  onClick={() => handleRowClick(customer._id)}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell className="text-center">{customer.totalLeads}</TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleRowClick(customer._id)}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openAddLeadModal(customer._id)}>
                          Add Lead
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setEditingCustomer(customer);
                            setIsCustomerFormOpen(true);
                          }}
                        >
                          Edit Customer
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDelete(customer._id)} className="text-red-600">
                          Delete Customer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No customers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Lead Modal */}
      <Dialog open={isLeadFormOpen} onOpenChange={setIsLeadFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Lead</DialogTitle>
          </DialogHeader>
          <LeadForm customerId={selectedCustomerId} onSave={handleLeadFormSave} />
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default CustomersList;
