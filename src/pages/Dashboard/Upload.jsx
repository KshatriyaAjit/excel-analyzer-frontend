import React, { useState } from "react";
import * as XLSX from "xlsx";
import axiosPrivate from "../../api/axiosPrivate";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setMessage("");

    // Optional: Preview first 5 rows
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      setPreview(jsonData.slice(0, 5)); // show first 5 rows
    };
    reader.readAsArrayBuffer(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file first.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axiosPrivate.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      setMessage(res.data.message || "File uploaded successfully!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-indigo-700 dark:text-white mb-4">
        Upload Excel File
      </h1>

      {/* File Input */}
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Choose Excel File
        </label>

        <div className="flex items-center space-x-4">
          <label
            htmlFor="file-upload"
            className="cursor-pointer relative px-5 py-2 rounded-lg bg-indigo-600 text-white overflow-hidden shadow-md group transition-all duration-300 hover:bg-indigo-700"
          >
            <span className="absolute left-0 top-0 h-full w-0 bg-white/10 group-hover:w-full transition-all duration-300 ease-in-out"></span>
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
                  d="M4 16l4-4-4-4m12 8l-4-4 4-4"
                />
              </svg>
              Browse File
            </span>
          </label>

          <input
            id="file-upload"
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileChange}
            className="hidden"
          />

          <span className="text-sm text-gray-600 dark:text-gray-400">
            {file ? file.name : "No file chosen"}
          </span>
        </div>
      </div>

      {/* Upload Button */}
      {file && (
        <button
          onClick={handleUpload}
          disabled={loading}
          className={`relative group inline-flex items-center justify-center px-6 py-2 rounded-lg font-semibold shadow-md transition-all duration-300 ease-in-out cursor-pointer 
    ${
      loading
        ? "bg-gradient-to-r from-green-400 to-green-600 cursor-not-allowed opacity-70"
        : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
    } 
    text-white overflow-hidden`}
        >
          {/* Glow Effect */}
          <span className="absolute inset-0 w-full h-full bg-green-400 opacity-0 group-hover:opacity-10 transition duration-300 blur-lg"></span>

          {/* Spinner or Text */}
          {loading ? (
            <span className="flex items-center gap-2 z-10">
              <svg
                className="animate-spin h-5 w-5 text-white"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
              <span>Uploading...</span>
            </span>
          ) : (
            <span className="z-10">🚀 Upload File</span>
          )}
        </button>
      )}

      {/* Status Message */}
      {message && (
        <p
          className={`mt-2 text-sm ${
            message.includes("successfully")
              ? "text-green-600"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {message}
        </p>
      )}

      {/* Preview Table */}
      {preview.length > 0 && (
        <div className="mt-6">
          <h2 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">
            File Preview
          </h2>
          <div className="overflow-x-auto max-h-[400px] overflow-y-scroll border rounded dark:border-gray-700">
            <table className="table-auto w-full text-sm text-left text-gray-800 dark:text-gray-100">
              <tbody>
                {preview.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className="even:bg-gray-50 dark:even:bg-gray-800"
                  >
                    {row.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        className="border px-2 py-1 dark:border-gray-700"
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
