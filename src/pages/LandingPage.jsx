import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex flex-col justify-center items-center px-6">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-700 dark:text-indigo-400 mb-6">
          Welcome to Excel Analytics Platform
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Upload Excel/CSV files, visualize data with charts, manage history,
          and analyze your spreadsheets with ease.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/login"
            className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition text-lg shadow-md"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-6 py-3 bg-white dark:bg-gray-900 border border-indigo-600 text-indigo-600 dark:text-indigo-300 rounded-md hover:bg-indigo-50 dark:hover:bg-gray-800 transition text-lg shadow-md"
          >
            Register
          </Link>
        </div>
      </div>

      {/* Optional Illustration */}
      <div className="mt-12 hidden md:block">
        <img
          src="/illustration-dashboard.svg"
          alt="Dashboard Illustration"
          className="w-[500px] dark:brightness-90"
        />
      </div>
    </div>
  );
}
