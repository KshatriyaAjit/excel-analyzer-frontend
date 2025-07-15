import { useState } from "react";
import axiosPrivate from "../../api/axiosPrivate";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await axiosPrivate.post("/auth/register", formData);
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 px-4">
      <div className="bg-white dark:bg-gray-900 border dark:border-gray-700 shadow-xl rounded-xl p-6 sm:p-8 w-full max-w-md transition-all duration-300">
        <h2 className="text-xl sm:text-3xl font-semibold text-center mb-6 text-indigo-700 dark:text-indigo-400">
          Create an Account
        </h2>

        {error && (
          <p className="text-red-500 text-sm font-medium mb-4 text-center">{error}</p>
        )}
        {success && (
          <p className="text-green-600 text-sm font-medium mb-4 text-center">{success}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            required
          />

          {/* Password Field with toggle */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a9.978 9.978 0 011.356-5M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.746 4.254a10.012 10.012 0 012.254 5.746c0 5.523-4.477 10-10 10a9.972 9.972 0 01-5.746-2.254M3 3l18 18" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>

          {/* Confirm Password Field with toggle */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              title={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a9.978 9.978 0 011.356-5M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.746 4.254a10.012 10.012 0 012.254 5.746c0 5.523-4.477 10-10 10a9.972 9.972 0 01-5.746-2.254M3 3l18 18" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 active:scale-95 text-white py-2.5 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            ✅ Register
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
          >
            Log In
          </span>
        </p>
      </div>
    </div>
  );
}
