import { useEffect, useState } from "react";
import axiosPrivate from "../../api/axiosPrivate";

export default function FileManagement() {
  const [files, setFiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchFiles = async () => {
    try {
      const res = await axiosPrivate.get("/upload/history");
      setFiles(res.data.history);
    } catch (err) {
      console.error("Failed to fetch files", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;
    try {
      await axiosPrivate.delete(`/upload/delete/${id}`);
      setFiles((prev) => prev.filter((file) => file._id !== id));
    } catch (err) {
      console.error("Error deleting file:", err);
    }
  };

  const handleDownload = async (id, originalName = "download.xlsx") => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/upload/download/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to download file");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = originalName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed", error);
      alert("Download failed. Please try again.");
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentData = files.slice(startIdx, startIdx + itemsPerPage);
  const totalPages = Math.ceil(files.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-6 text-gray-800 dark:text-gray-100">
      <h1 className="text-2xl font-bold mb-4 text-indigo-700 dark:text-indigo-400">
        File Management
      </h1>
      <div className="overflow-x-auto rounded shadow">
        <table className="w-full text-sm border border-gray-300 dark:border-gray-600">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
              <th className="border px-3 py-2">Original Name</th>
              <th className="border px-3 py-2">Uploaded At</th>
              <th className="border px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((file) => (
                <tr
                  key={file._id}
                  className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <td className="border px-3 py-2">{file.originalName}</td>
                  <td className="border px-3 py-2">
                    {new Date(file.uploadedAt).toLocaleString()}
                  </td>
                  <td className="border px-3 py-2 ">
                     <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <button
                      onClick={() =>
                        handleDownload(file._id, file.originalName)
                      }
                      className="group relative px-5 py-2 bg-green-600 text-white rounded-lg overflow-hidden transition-all duration-300 hover:bg-green-700 cursor-pointer"
                    >
                      <span className="absolute left-0 top-0 h-full w-0 bg-white/10 group-hover:w-full transition-all duration-300 ease-in-out"></span>
                      <span className="relative z-10 flex items-center gap-2">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3"
                          />
                        </svg>
                        Download
                      </span>
                    </button>
                    <button
                      onClick={() => handleDelete(file._id)}
                      className="group relative px-5 py-2 bg-red-600 text-white rounded-lg overflow-hidden transition-all duration-300 hover:bg-red-700 cursor-pointer"
                    >
                      <span className="absolute left-0 top-0 h-full w-0 bg-white/10 group-hover:w-full transition-all duration-300 ease-in-out"></span>
                      <span className="relative z-10 flex items-center gap-2">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4 4v16h16V4H4zm4 4h8m-4 4v4"
                          />
                        </svg>
                        Delete
                      </span>
                    </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="3"
                  className="text-center py-4 text-gray-500 dark:text-gray-400"
                >
                  No files found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded bg-white dark:bg-gray-800 dark:text-gray-200 disabled:opacity-50"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, idx) => {
            const page = idx + 1;
            return (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 border rounded transition ${
                  page === currentPage
                    ? "bg-indigo-500 text-white"
                    : "bg-white dark:bg-gray-800 dark:text-gray-200"
                }`}
              >
                {page}
              </button>
            );
          })}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded bg-white dark:bg-gray-800 dark:text-gray-200 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
