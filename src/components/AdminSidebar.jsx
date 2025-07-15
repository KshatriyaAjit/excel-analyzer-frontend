import { NavLink, useNavigate } from "react-router-dom";
import { FaUsers, FaFileAlt, FaHome, FaExchangeAlt } from "react-icons/fa";
import { useEffect, useState } from "react";

export default function AdminSidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
  }, []);

  const navItems = [
    { path: "/admin", name: "Home", icon: <FaHome /> },
    { path: "/admin/users", name: "Manage Users", icon: <FaUsers /> },
    { path: "/admin/files", name: "Manage Files", icon: <FaFileAlt /> },
  ];


  const switchToUserPanel = () => {
    navigate("/dashboard");
  };

  return (
    <>
      {/* Mobile Top Header */}
      <div className="md:hidden p-4 bg-indigo-700 text-white flex justify-between items-center">
        <h2 className="text-lg font-bold">Admin Panel</h2>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="text-white bg-indigo-600 px-2 py-1 rounded hover:bg-indigo-500 transition cursor-pointer"
        >
          {isMobileOpen ? "Close" : "Menu"}
        </button>
      </div>

      {/* Sidebar */}
 <aside
  className={`${
    isMobileOpen ? "block" : "hidden md:block"
  } shadow-md dark:shadow-[4px_0_10px_rgba(0,0,0,0.3)]
  bg-gradient-to-b from-indigo-200 via-indigo-300 to-indigo-100 text-indigo-900 
  dark:bg-gray-900 dark:!bg-none dark:text-white
  w-full md:w-72 h-screen fixed md:relative z-50 transition-all`}
>

  {/* Close button for mobile */}
  <div className="flex justify-end md:hidden px-4 pt-4">
    <button
      onClick={() => setIsMobileOpen(false)}
      className="text-white text-3xl font-bold cursor-pointer"
    >
      &times;
    </button>
  </div>

        <div className="flex flex-col h-full py-6 px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">Admin Panel</h2>

          {/* Nav Items */}
          <nav className="flex-1">
            <ul className="space-y-3">
              {navItems.map(({ path, name, icon }) => (
                <li key={path}>
                  <NavLink
                    to={path}
                    end
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2 rounded-md transition-all ${
                        isActive
                          ? "bg-white text-indigo-700 font-semibold"
                          : "hover:bg-black/10 dark:hover:bg-gray-800"
                      }`
                    }
                    onClick={() => setIsMobileOpen(false)}
                  >
                    {icon}
                    <span>{name}</span>
                  </NavLink>
                </li>
              ))}

                  {/* Toggle to Dashboard Button */}
          {user?.role === "admin" && (
            <button
              onClick={switchToUserPanel}
              className="mt-6 mx-auto flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition cursor-pointer"
            >
              <FaExchangeAlt />
              User Panel
            </button>
          )}




            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}
