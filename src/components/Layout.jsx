import { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar";
import { IconHome, IconUsers, IconFileText, IconTargetArrow, IconUser } from "@tabler/icons-react";

const Layout = ({ children }) => {
  const [open, setOpen] = useState(false);
  const links = [
    { href: "/", label: "Dashboard", icon: <IconHome className="h-5 w-5 shrink-0" /> },
    { href: "/customers", label: "Customers", icon: <IconUsers className="h-5 w-5 shrink-0" /> },
    { href: "/leads", label: "Leads", icon: <IconTargetArrow className="h-5 w-5 shrink-0" /> },
    { href: "/reports", label: "Reports", icon: <IconFileText className="h-5 w-5 shrink-0" /> },
  ];

  return (
    <div className="flex h-screen bg-background">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {links.map((link, index) => (
              <SidebarLink key={index} link={link} />
            ))}
          </div>
          <SidebarLink link={{ href: "/profile", label: "User", icon: <IconUser className="h-5 w-5 shrink-0" /> }} />
        </SidebarBody>
      </Sidebar>
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;
