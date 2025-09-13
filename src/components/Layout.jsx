import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar";
import {
  IconHome,
  IconUsers,
  IconFileText,
} from "@tabler/icons-react";

const Layout = ({ children }) => {
  const links = [
    { href: "/", label: "Dashboard", icon: <IconHome /> },
    { href: "/customers", label: "Customers", icon: <IconUsers /> },
    { href: "/reports", label: "Reports", icon: <IconFileText /> },
  ];

  return (
    <div className="flex h-screen">
      <Sidebar>
        <SidebarBody>
          {
            links.map((link, index) => (
              <SidebarLink key={index} link={link} />
            ))
          }
        </SidebarBody>
      </Sidebar>
      <main className="flex-1 p-4 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;
