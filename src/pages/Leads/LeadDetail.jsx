import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const lead = {
  id: 1,
  title: "Initial Inquiry",
  customer: "John Doe",
  description: "Customer is interested in our services.",
  status: "New",
  value: 5000,
  createdAt: "2023-10-27T10:00:00Z",
};

const LeadDetail = () => {
  const { id } = useParams();

  return (
    <main className="p-8 bg-gray-50">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{lead.title}</h1>
        <p className="text-lg text-gray-600">{lead.customer}</p>
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
          <Select defaultValue={lead.status}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="New">New</SelectItem>
              <SelectItem value="Contacted">Contacted</SelectItem>
              <SelectItem value="Converted">Converted</SelectItem>
              <SelectItem value="Lost">Lost</SelectItem>
            </SelectContent>
          </Select>
          <Button>Update</Button>
        </CardContent>
      </Card>
    </main>
  );
};

export default LeadDetail;
