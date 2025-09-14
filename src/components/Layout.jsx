import { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar";
import { IconHome, IconUsers, IconFileText, IconTargetArrow, IconLogout } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";


const Layout = ({ children }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const links = [
    { href: "/", label: "Dashboard", icon: <IconHome className="h-5 w-5 shrink-0" /> },
    { href: "/customers", label: "Customers", icon: <IconUsers className="h-5 w-5 shrink-0" /> },
    { href: "/leads", label: "Leads", icon: <IconTargetArrow className="h-5 w-5 shrink-0" /> },
    { href: "/reports", label: "Reports", icon: <IconFileText className="h-5 w-5 shrink-0" /> },
  ];

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('token');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {links.map((link, index) => (
              <SidebarLink key={index} link={link} />
            ))}
          </div>
          <div
            onClick={handleLogout}
            className={cn(
                "flex items-center group/sidebar py-2 px-4 rounded-md gap-2 cursor-pointer",
                "text-white hover:bg-slate-700",
                open ? "justify-start" : "justify-center"
            )}
            >
            <IconLogout className="h-5 w-5 shrink-0" />
            <motion.span
                animate={{
                display: open ? "inline-block" : "none",
                opacity: open ? 1 : 0,
                }}
                className="text-white text-base group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre"
            >
                Logout
            </motion.span>
            </div>
        </SidebarBody>
      </Sidebar>
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;