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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

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
        } md:relative z-50
  shadow-md dark:shadow-[4px_0_10px_rgba(0,0,0,0.3)]
  bg-gradient-to-b from-indigo-200 via-indigo-300 to-indigo-100 text-indigo-900
  dark:bg-gray-900 dark:!bg-none dark:text-white
  w-full md:w-72 md:h-screen md:fixed transition-all`}
      >
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
            </ul>
          </nav>

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

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="mt-4 relative inline-flex items-center justify-center px-6 py-2 font-semibold text-red-600 border border-red-600 rounded-md overflow-hidden transition-all duration-300 group hover:bg-red-600 hover:text-white shadow-sm cursor-pointer"
          >
            <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-red-100 group-hover:w-full group-hover:h-full group-hover:rounded-md group-hover:scale-110 opacity-20"></span>
            <span className="relative z-10 flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 11-4 0v-1m0-8V7a2 2 0 114 0v1"
                />
              </svg>
              Logout
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
