import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaChartBar,
  FaFileUpload,
  FaSignOutAlt,
  FaHistory,
  FaUserShield,
  FaDatabase,
} from "react-icons/fa";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const [user, setUser] = useState(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
  }, []);

  const navItems = [
    { path: "/dashboard", name: "Home", icon: <FaHome /> },
    { path: "/dashboard/upload", name: "Upload", icon: <FaFileUpload /> },
    { path: "/dashboard/charts", name: "Charts", icon: <FaChartBar /> },
    { path: "/dashboard/history", name: "History", icon: <FaHistory /> },
  ];

  const adminItems = [
    { path: "/admin", name: "Admin Home", icon: <FaUserShield /> },
    { path: "/admin/users", name: "User Management", icon: <FaUserShield /> },
    { path: "/admin/files", name: "File Management", icon: <FaDatabase /> },
  ];



  return (
    <>
      {/* Mobile Topbar */}
      <div className="md:hidden p-4 bg-indigo-700 text-white flex justify-between items-center">
        <h2 className="text-lg font-bold">Excel Analyzer</h2>
        {!isMobileOpen && (
          <button
            onClick={() => setIsMobileOpen(true)}
            className="bg-indigo-600 px-3 py-1 rounded-md text-sm font-medium hover:bg-indigo-500 transition cursor-pointer"
          >
            Menu
          </button>
        )}
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
          <h2 className="text-2xl font-bold mb-8 text-center">
            Excel Analyzer
          </h2>

          <nav className="flex-1">
            <ul className="space-y-3">
              {navItems.map(({ path, name, icon }) => (
                <li key={path}>
                  <NavLink
                    to={path}
                    end={path === "/dashboard"}
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

              {user?.role === "admin" && (
                <>
                  <hr className="my-4 border-white/30 dark:border-gray-700" />
                  {adminItems.map(({ path, name, icon }) => (
                    <li key={path}>
                      <NavLink
                        to={path}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-4 py-2 rounded-md transition-all ${
                            isActive
                              ? "bg-white text-indigo-700 font-semibold"
                              : "hover:bg-indigo-600 dark:hover:bg-gray-800"
                          }`
                        }
                        onClick={() => setIsMobileOpen(false)}
                      >
                        {icon}
                        <span>{name}</span>
                      </NavLink>
                    </li>
                  ))}
                </>
              )}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}
