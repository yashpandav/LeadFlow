import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CustomerForm = () => {
  return (
    <form className="space-y-4">
      <div>
        <label htmlFor="name">Name</label>
        <Input id="name" />
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <Input id="email" type="email" />
      </div>
      <div>
        <label htmlFor="phone">Phone</label>
        <Input id="phone" />
      </div>
      <div>
        <label htmlFor="company">Company</label>
        <Input id="company" />
      </div>
      <Button type="submit">Save</Button>
    </form>
  );
};

export default CustomerForm;
