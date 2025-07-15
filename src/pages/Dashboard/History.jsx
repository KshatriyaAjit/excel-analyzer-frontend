import { useEffect, useRef, useState } from "react";
import axiosPrivate from "../../api/axiosPrivate";

export default function History() {
  const [history, setHistory] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axiosPrivate.get("/upload/history");
        setHistory(res.data.history);
      } catch (err) {
        console.error("Error fetching upload history:", err);
      }
    };
    fetchHistory();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setShowModal(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setShowModal(false);
      }
    };
    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal]);

  const handleView = async (id) => {
    try {
      const res = await axiosPrivate.get(`/upload/view/${id}`);
      setSelectedData(res.data.data);
      setShowModal(true);
    } catch (err) {
      console.error("Error viewing file:", err);
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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;
    try {
      await axiosPrivate.delete(`/upload/delete/${id}`);
      setHistory((prev) => prev.filter((file) => file._id !== id));
    } catch (err) {
      console.error("Error deleting file:", err);
    }
  };

  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentData = history.slice(startIdx, startIdx + itemsPerPage);
  const totalPages = Math.ceil(history.length / itemsPerPage);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-indigo-700">
        Upload History
      </h2>
      <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
        <table className="min-w-full border text-sm bg-white dark:bg-gray-800">
          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100">
            <tr>
              <th className="border px-4 py-2">#</th>
              <th className="border px-4 py-2">Filename</th>
              <th className="border px-4 py-2">Uploaded At</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((file, idx) => (
              <tr
                key={file._id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="border px-4 py-2 text-gray-800 dark:text-gray-100">
                  {startIdx + idx + 1}
                </td>
                <td className="border px-4 py-2 text-gray-800 dark:text-gray-100">
                  {file.originalName}
                </td>
                <td className="border px-4 py-2 text-gray-800 dark:text-gray-100">
                  {new Date(file.uploadedAt).toLocaleString()}
                </td>
                <td className="border px-4 py-2 ">
                <div className="flex flex-wrap sm:flex-nowrap gap-2">

               
                  <button
                    onClick={() => handleView(file._id)}
                    className="group relative px-5 py-2 bg-blue-600 text-white rounded-lg overflow-hidden transition-all duration-300 hover:bg-blue-700 cursor-pointer"
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
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7s-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      View
                    </span>
                  </button>

                  <button
                    onClick={() => handleDownload(file._id, file.originalName)}
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
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="mt-4 flex justify-center items-center gap-6">
          <button
            className="group flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-600 text-white transition-all duration-300 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1}
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
            className="group flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-600 text-white transition-all duration-300 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === totalPages}
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
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div
            ref={modalRef}
            className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded shadow max-w-[95vw] sm:max-w-4xl w-full max-h-[90vh] overflow-auto relative dark:text-gray-100"
          >
            <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-100">
              File Data
            </h3>
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-4 text-gray-500 hover:text-red-600 text-lg cursor-pointer"
            >
              ✖
            </button>
            <table className="min-w-full text-sm border border-gray-300 dark:border-gray-700">
              <thead>
                <tr>
                  {selectedData?.[0] &&
                    Object.keys(selectedData[0]).map((key) => (
                      <th
                        key={key}
                        className="border px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                      >
                        {key}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {selectedData?.map((row, i) => (
                  <tr key={i}>
                    {Object.values(row).map((cell, j) => (
                      <td
                        key={j}
                        className="border px-2 py-1 text-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-700"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
