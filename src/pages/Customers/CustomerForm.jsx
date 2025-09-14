import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addCustomer, updateCustomer, fetchCustomers } from '../../store/features/customer/customerSlice';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSelector } from 'react-redux';

const CustomerForm = ({ customer, onSave }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const dispatch = useDispatch();
  const { pagination } = useSelector((state) => state.customers);


  useEffect(() => {
    if (customer) {
      setName(customer.name);
      setEmail(customer.email);
      setPhone(customer.phone);
      setCompany(customer.company);
    }
  }, [customer]);

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const customerData = { name, email, phone, company };
    
    if (customer) {
      await dispatch(updateCustomer({ id: customer._id, customer: customerData }));
      dispatch(fetchCustomers({ page: pagination.page, limit: 10 }));
    } else {
      await dispatch(addCustomer(customerData));
      dispatch(fetchCustomers({ page: pagination.page, limit: 10 }));
    }

    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
        <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>
      <div>
        <label htmlFor="company" className="block text-sm font-medium text-gray-700">Company</label>
        <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} />
      </div>
      <Button type="submit">Save</Button>
    </form>
  );
};

export default CustomerForm;
