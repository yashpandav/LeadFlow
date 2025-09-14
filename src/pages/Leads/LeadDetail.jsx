import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeads, updateLead } from '../../store/features/leads/leadSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const LeadDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { leads, loading, error } = useSelector((state) => state.leads);
  const [status, setStatus] = useState('');

  const lead = leads.find((l) => l._id === id);

  useEffect(() => {
    if (!lead) {
      dispatch(fetchLeads());
    }
    if (lead) {
      setStatus(lead.status);
    }
  }, [dispatch, lead]);

  const handleUpdateStatus = () => {
    dispatch(updateLead({ id, lead: { status } }));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!lead) {
    return <div>Lead not found</div>;
  }

  return (
    <main className="p-8 bg-gray-50">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{lead.title}</h1>
        <p className="text-lg text-gray-600">{lead.customer.name}</p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Lead Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="font-semibold">Description</p>
            <p>{lead.description}</p>
          </div>
          <div>
            <p className="font-semibold">Value</p>
            <p>${lead.value}</p>
          </div>
          <div>
            <p className="font-semibold">Created At</p>
            <p>{new Date(lead.createdAt).toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Update Status</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center space-x-4">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a status" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Contacted">Contacted</SelectItem>
                <SelectItem value="Qualified">Qualified</SelectItem>
                <SelectItem value="Proposal">Proposal</SelectItem>
                <SelectItem value="Converted">Converted</SelectItem>
                <SelectItem value="Lost">Lost</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleUpdateStatus}>Update</Button>
        </CardContent>
      </Card>
    </main>
  );
};

export default LeadDetail;
