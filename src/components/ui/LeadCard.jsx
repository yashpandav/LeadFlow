import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";

const statusColors = {
  New: "bg-blue-500",
  Contacted: "bg-yellow-500",
  Qualified: "bg-green-500",
  Proposal: "bg-purple-500",
  Converted: "bg-teal-500",
  Lost: "bg-red-500",
};

const LeadCard = ({ lead, onEdit, onDelete }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{lead.title}</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Link to={`/leads/${lead._id}`}>
              <DropdownMenuItem>View</DropdownMenuItem>
            </Link>
            <DropdownMenuItem onClick={() => onEdit(lead)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(lead._id)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">${lead.value}</div>
        <p className="text-xs text-muted-foreground">
          {lead.customerId ? lead.customerId.name : "N/A"}
        </p>
        <div className="flex items-center pt-4">
          <div
            className={`h-2 w-2 rounded-full ${
              statusColors[lead.status] || "bg-gray-400"
            }`}
          />
          <span className="ml-2 text-sm text-muted-foreground">
            {lead.status}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeadCard;
