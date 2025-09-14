import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllLeads, updateLead, deleteLead } from '../../store/features/leads/leadSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const LeadDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { leads, loading, error } = useSelector((state) => state.leads);
  const [status, setStatus] = useState('');

  const lead = leads.find((l) => l._id === id);

  useEffect(() => {
    if (!lead) {
      dispatch(fetchAllLeads());
    }
    if (lead) {
      setStatus(lead.status);
    }
  }, [dispatch, lead]);

  const handleUpdateStatus = () => {
    dispatch(updateLead({ id, lead: { status } }))
      .unwrap()
      .then(() => {
        toast.success('Lead status updated successfully!');
      })
      .catch((err) => {
        toast.error(`Failed to update lead status: ${err.message}`);
      });
  };

  const handleDelete = () => {
    dispatch(deleteLead(id))
      .unwrap()
      .then(() => {
        toast.success('Lead deleted successfully!');
        navigate('/leads');
      })
      .catch((err) => {
        toast.error(`Failed to delete lead: ${err.message}`);
      });
  };

  if (loading) {
    return <LoadingSpinner message="Loading lead details..." />;
  }

  if (error) {
    return <div className="text-red-500 text-center mt-8">Error: {error}</div>;
  }

  if (!lead) {
    return <div className="text-center mt-8">Lead not found</div>;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'New':
        return 'bg-blue-500';
      case 'Contacted':
        return 'bg-yellow-500';
      case 'Converted':
        return 'bg-green-700';
      case 'Lost':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <main className="container mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-4xl font-bold">{lead.title}</h1>
            <p className="text-xl text-gray-500">{lead.customer?.name}</p>
          </div>
        </div>
        <Badge className={`${getStatusColor(lead.status)} text-white`}>{lead.status}</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Lead Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-sm font-medium text-gray-500">Value</p>
                <p className="text-lg font-semibold">${lead.value?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Created At</p>
                <p className="text-lg">{new Date(lead.createdAt).toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Update Status</label>
                <div className="flex items-center space-x-2">
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="New">New</SelectItem>
                      <SelectItem value="Contacted">Contacted</SelectItem>
                      <SelectItem value="Converted">Converted</SelectItem>
                      <SelectItem value="Lost">Lost</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleUpdateStatus}>Update</Button>
                </div>
              </div>
              <Button variant="destructive" onClick={handleDelete} className="w-full">
                Delete Lead
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default LeadDetail;
