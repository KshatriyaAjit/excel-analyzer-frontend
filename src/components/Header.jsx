import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosPrivate from "../api/axiosPrivate";

export default function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosPrivate.get("/auth/profile");
        setUser(res.data.user);
      } catch (err) {
        console.error("Failed to load user profile", err);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const prefersDark =
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDarkMode(prefersDark);
    document.documentElement.classList.toggle("dark", prefersDark);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const goToProfile = () => {
    navigate("/profile");
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);

    if (newMode) {
      localStorage.theme = "dark";
      document.documentElement.classList.add("dark");
    } else {
      localStorage.theme = "light";
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <header className="bg-white dark:bg-gray-900 transition-colors duration-300 shadow-md w-full px-6 py-4 flex flex-wrap justify-between items-center gap-4">
      <h1 className="text-xl sm:text-2xl font-bold text-indigo-700 dark:text-indigo-400 tracking-wide">
        Excel Analytics Platform
      </h1>

      <div className="flex items-center justify-between  gap-4">
        {/* 🌙 Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="relative flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition cursor-pointer"
        >
          {darkMode ? "☀ Light" : "🌙 Dark"}
        </button>

        {/* Avatar or Initial */}
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt="User Avatar"
            className="w-10 h-10 rounded-full object-cover cursor-pointer border-2 border-indigo-500 hover:scale-105 transition duration-200"
            onClick={goToProfile}
            title="View Profile"
          />
        ) : (
          <div
            className="w-10 h-10 bg-indigo-200 dark:bg-indigo-700 text-indigo-800 dark:text-white rounded-full flex items-center justify-center font-bold cursor-pointer hover:scale-105 transition duration-200"
            onClick={goToProfile}
            title="View Profile"
          >
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
        )}

        {/* Name */}
        <span
          onClick={goToProfile}
          className="text-sm font-medium text-gray-700 dark:text-gray-200 cursor-pointer hover:underline"
        >
          {user?.name || "User"}
        </span>

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
