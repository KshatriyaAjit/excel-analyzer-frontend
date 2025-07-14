import { useEffect, useState } from "react";
import axiosPrivate from "../../api/axiosPrivate";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchUsers = async () => {
    try {
      const res = await axiosPrivate.get("/admin/users");
      setUsers(res.data.users);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axiosPrivate.delete(`/admin/delete-user/${id}`);
      setUsers((prev) => prev.filter((user) => user._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const toggleRole = async (id) => {
    try {
      await axiosPrivate.put(`/admin/toggle-role/${id}`);
      fetchUsers();
    } catch (err) {
      console.error("Toggle role failed", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentData = users.slice(startIdx, startIdx + itemsPerPage);
  const totalPages = Math.ceil(users.length / itemsPerPage);

  return (
    <div className="p-6 text-gray-800 dark:text-gray-100">
      <h1 className="text-2xl font-bold mb-4 text-indigo-700 dark:text-indigo-400">
        User Management
      </h1>

      <div className="overflow-x-auto rounded shadow">
        <table className="w-full text-sm border border-gray-300 dark:border-gray-600">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
              <th className="border px-3 py-2">Name</th>
              <th className="border px-3 py-2">Email</th>
              <th className="border px-3 py-2">Role</th>
              <th className="border px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((user) => (
              <tr
                key={user._id}
                className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <td className="border px-3 py-2">{user.name}</td>
                <td className="border px-3 py-2">{user.email}</td>
                <td className="border px-3 py-2 capitalize">{user.role}</td>
                <td className="border px-3 py-2 space-x-2">
<button
  onClick={() => toggleRole(user._id)}
  className="relative group px-4 py-1.5 rounded-md font-medium text-white
             bg-gradient-to-r from-yellow-400 to-amber-500 
             hover:from-yellow-500 hover:to-amber-600 transition-all duration-300
             shadow-md overflow-hidden cursor-pointer"
>
  {/* Subtle glow on hover */}
  <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition duration-300 blur-sm"></span>

  {/* Button content */}
  <span className="relative z-10 flex items-center gap-1">
    🔁 Toggle Role
  </span>
</button>

<button
  onClick={() => deleteUser(user._id)}
  className="relative group px-4 py-1.5 rounded-md font-medium text-white 
             bg-gradient-to-r from-red-500 to-rose-600 
             hover:from-red-600 hover:to-rose-700 transition-all duration-300
             shadow-md overflow-hidden cursor-pointer"
>
  {/* Optional glow on hover */}
  <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition duration-300 blur-sm"></span>

  {/* Button text */}
  <span className="relative z-10 flex items-center gap-1">
    🗑️ Delete
  </span>
</button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center items-center gap-4 text-sm">
        <button
          onClick={() => setCurrentPage((p) => p - 1)}
          disabled={currentPage === 1}
          className="group flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-600 text-white transition-all duration-300 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >

                      <svg
              className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          
          Prev
        </button>
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => p + 1)}
          disabled={currentPage === totalPages}
          className="group flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-600 text-white transition-all duration-300 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next

          <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>


        </button>
      </div>
    </div>
  );
}
