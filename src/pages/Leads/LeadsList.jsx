import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllLeads, deleteLead } from '../../store/features/leads/leadSlice';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import LeadForm from './LeadForm';
import LeadCard from '../../components/ui/LeadCard';
import Pagination from '../../components/ui/Pagination';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const LeadsList = () => {
  const dispatch = useDispatch();
  const { leads, loading, error, totalPages, currentPage } = useSelector((state) => state.leads);
  const { customers } = useSelector((state) => state.customers);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchAllLeads(page));
  }, [dispatch, page]);

  const handleDelete = (id) => {
    dispatch(deleteLead(id));
  };

  const handleEdit = (lead) => {
    setEditingLead(lead);
    setIsFormOpen(true);
  };

  const handleFormSave = () => {
    setIsFormOpen(false);
    setEditingLead(null);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const filteredLeads = leads
    .filter(
      (lead) =>
        lead.title.toLowerCase().includes(search.toLowerCase()) ||
        (lead.customerId && lead.customerId.name.toLowerCase().includes(search.toLowerCase()))
    )
    .filter((lead) => statusFilter === 'all' || lead.status === statusFilter);

  if (loading) {
    return <LoadingSpinner message="Searching for leads..." />;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <main className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Leads</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingLead(null)}>Add Lead</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingLead ? 'Edit Lead' : 'Add Lead'}</DialogTitle>
            </DialogHeader>
            <LeadForm lead={editingLead} onSave={handleFormSave} customers={customers} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Search by title or customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select onValueChange={setStatusFilter} defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="New">New</SelectItem>
            <SelectItem value="Contacted">Contacted</SelectItem>
            <SelectItem value="Converted">Converted</SelectItem>
            <SelectItem value="Lost">Lost</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredLeads.map((lead) => (
          <LeadCard key={lead._id} lead={lead} onEdit={handleEdit} onDelete={handleDelete} />
        ))}
      </div>
      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </main>
  );
};

export default LeadsList;
