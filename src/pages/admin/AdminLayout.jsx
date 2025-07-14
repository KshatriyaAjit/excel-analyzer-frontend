import AdminSidebar from "../../components/AdminSidebar";
import { Outlet } from "react-router-dom";
import AdminHeader from "../../components/AdminHeader";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      {/* Header (on top for all views) */}
      <AdminSidebar />

      {/* Sidebar and content container */}
      <div className="flex flex-1 flex-col ">
        <AdminHeader />
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
