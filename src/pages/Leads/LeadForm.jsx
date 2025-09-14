import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const LeadForm = () => {
  return (
    <form className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" />
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <Select>
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
      </div>
      <div>
        <Label htmlFor="value">Value</Label>
        <Input id="value" type="number" />
      </div>
      <Button type="submit">Save</Button>
    </form>
  );
};

export default LeadForm;
