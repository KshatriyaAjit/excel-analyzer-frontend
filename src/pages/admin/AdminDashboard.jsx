import { Link } from "react-router-dom";
import AdminHeader from "../../components/AdminHeader";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-indigo-700 dark:text-indigo-400 mb-6">
          Admin Panel
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/admin/users"
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md hover:shadow-xl transition p-6 text-indigo-600 dark:text-indigo-300 font-semibold text-center"
          >
            Manage Users
          </Link>

          <Link
            to="/admin/files"
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md hover:shadow-xl transition p-6 text-indigo-600 dark:text-indigo-300 font-semibold text-center"
          >
            Manage Files
          </Link>
        </div>
      </div>
    </div>
  );
}
