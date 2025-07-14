import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosPrivate from "../api/axiosPrivate";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { FaExchangeAlt } from "react-icons/fa";

export default function AdminHeader() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosPrivate.get("/auth/profile");
        setProfile(res.data.user);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      {/* Title at the top */}
      <Link
        to="/admin"
        className="text-xl font-bold text-indigo-700 dark:text-indigo-400"
      >
        Excel Analyzer (Admin)
      </Link>

      {/* Controls section */}
      <div className="flex flex-wrap sm:flex-nowrap justify-between items-center gap-4">
        {/* Theme Toggle */}
        <button
          onClick={() => setDarkMode((prev) => !prev)}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition cursor-pointer"
        >
          {darkMode ? (
            <SunIcon className="h-5 w-5 text-yellow-400" />
          ) : (
            <MoonIcon className="h-5 w-5 text-gray-600" />
          )}
        </button>

        {/* Profile */}
        {profile && (
          <Link
            to="/profile"
            className="flex items-center gap-2 text-sm text-gray-800 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-300 transition"
          >
            <span className="sm:inline">{profile.name}</span>
            <img
              src={profile.avatar}
              alt="Avatar"
              className="w-9 h-9 rounded-full object-cover border border-indigo-500"
            />
          </Link>
        )}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="relative inline-flex items-center justify-center px-6 py-2 font-semibold text-red-600 border border-red-600 rounded-md overflow-hidden transition-all duration-300 group hover:bg-red-600 hover:text-white shadow-sm cursor-pointer"
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
    </header>
  );
}
