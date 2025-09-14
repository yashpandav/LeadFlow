import { useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import LeadForm from "../Leads/LeadForm";

const customer = {
  id: 1,
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "123-456-7890",
};

const leads = [
  {
    id: 1,
    title: "Initial Inquiry",
    status: "New",
    value: 5000,
    createdAt: "2023-10-27T10:00:00Z",
  },
  {
    id: 2,
    title: "Follow-up Call",
    status: "Contacted",
    value: 5000,
    createdAt: "2023-10-28T11:00:00Z",
  },
];

const CustomerDetail = () => {
  const { id } = useParams();
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredLeads = leads.filter(
    (lead) => statusFilter === "all" || lead.status === statusFilter
  );

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
          <Dialog>
            <DialogTrigger asChild>
              <Button>Add Lead</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Lead</DialogTitle>
              </DialogHeader>
              <LeadForm />
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
                <SelectItem value="Converted">Converted</SelectItem>
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>{lead.title}</TableCell>
                  <TableCell>{lead.status}</TableCell>
                  <TableCell>${lead.value}</TableCell>
                  <TableCell>{new Date(lead.createdAt).toLocaleDateString()}</TableCell>
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
