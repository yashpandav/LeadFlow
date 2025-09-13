import { useAuth } from "../context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between p-4 bg-white dark:bg-neutral-800 shadow-md">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>
      <div className="flex items-center space-x-4">
        <span>{user.email}</span>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <button onClick={logout} className="px-4 py-2 text-white bg-red-500 rounded-md">Logout</button>
      </div>
    </header>
  );
};

export default Navbar;