import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addLead, updateLead } from '../../store/features/leads/leadSlice';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const LeadForm = ({ lead, customerId, onSave }) => {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('New');
  const [value, setValue] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    if (lead) {
      setTitle(lead.title);
      setStatus(lead.status);
      setValue(lead.value);
    }
  }, [lead]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const leadData = { title, status, value: Number(value) };
    if (lead) {
      dispatch(updateLead({ id: lead._id, lead: leadData }));
    } else {
      dispatch(addLead({ customerId, lead: leadData }));
    }
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
        <Select onValueChange={setStatus} defaultValue={status}>
          <SelectTrigger>
            <SelectValue />
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
      </div>
      <div>
        <label htmlFor="value" className="block text-sm font-medium text-gray-700">Value</label>
        <Input id="value" type="number" value={value} onChange={(e) => setValue(e.target.value)} />
      </div>
      <Button type="submit">Save</Button>
    </form>
  );
};

export default LeadForm;
