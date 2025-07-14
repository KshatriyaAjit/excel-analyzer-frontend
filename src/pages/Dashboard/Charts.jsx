import React, { useEffect, useState } from "react";
import axiosPrivate from "../../api/axiosPrivate";
import ThreeDChart from "../../components/ThreeDChart";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function Charts() {
  const [files, setFiles] = useState([]);
  const [selectedFileId, setSelectedFileId] = useState("");
  const [data, setData] = useState([]);
  const [xField, setXField] = useState("");
  const [yField, setYField] = useState("");
  const [chartType, setChartType] = useState("bar");
  const [fields, setFields] = useState([]);
  const [aiSummary, setAiSummary] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    axiosPrivate.get("/upload/files").then((res) => {
      setFiles(res.data.files || []);
      if (res.data.files.length > 0) {
        setSelectedFileId(res.data.files[0]._id);
      }
    });
  }, []);

  useEffect(() => {
    if (!selectedFileId) return;
    axiosPrivate.get(`/upload/view/${selectedFileId}`).then((res) => {
      const result = res.data.data || [];
      setData(result);

      if (result.length > 0) {
        const keys = Object.keys(result[0]);
        setFields(keys);
        setXField(keys[0]);

        const numericField = keys.find(
          (key) => typeof result[0][key] === "number"
        );
        setYField(numericField || "");
      }
    });
  }, [selectedFileId]);

  const forceReplaceOKLCH = (element) => {
    const allElements = element.querySelectorAll("*");

    allElements.forEach((el) => {
      const computed = window.getComputedStyle(el);

      // Force replace text color
      if (computed.color.includes("oklch")) {
        el.style.setProperty("color", "#000", "important");
      }

      // Force replace background color
      if (computed.backgroundColor.includes("oklch")) {
        el.style.setProperty("background-color", "#fff", "important");
      }

      // Fix stroke and fill (important for charts)
      if (computed.fill && computed.fill.includes("oklch")) {
        el.style.setProperty("fill", "#000", "important");
      }

      if (computed.stroke && computed.stroke.includes("oklch")) {
        el.style.setProperty("stroke", "#000", "important");
      }
    });

    // Apply to root as well
    element.style.setProperty("color", "#000", "important");
    element.style.setProperty("background-color", "#fff", "important");
  };

  const temporarilySwitchToLightMode = async (callback) => {
    const root = document.documentElement;
    const originalTheme = root.classList.contains("dark") ? "dark" : "light";

    // Force light mode
    root.classList.remove("dark");

    // Wait for DOM repaint
    await new Promise((resolve) => setTimeout(resolve, 300));

    try {
      await callback(); // Run export
    } finally {
      // Restore original theme
      if (originalTheme === "dark") {
        root.classList.add("dark");
      }
    }
  };

  const downloadChartAsImage = () => {
    temporarilySwitchToLightMode(async () => {
      const chartEl = document.getElementById("chart-container");

      forceReplaceOKLCH(chartEl); // 🧼 patch remaining oklch

      const canvas = await html2canvas(chartEl);
      const link = document.createElement("a");
      link.download = "chart.png";
      link.href = canvas.toDataURL();
      link.click();
    }).catch((err) => {
      console.error("PNG Export Error:", err);
      alert("❌ Failed to export chart as PNG. Try switching to light mode.");
    });
  };

  const downloadChartAsPDF = () => {
    temporarilySwitchToLightMode(async () => {
      const chartEl = document.getElementById("chart-container");

      forceReplaceOKLCH(chartEl); // 🧼 patch remaining oklch

      const canvas = await html2canvas(chartEl);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 10, 10, 190, 100);
      pdf.save("chart.pdf");
    }).catch((err) => {
      console.error("PDF Export Error:", err);
      alert("❌ Failed to export chart as PDF. Try switching to light mode.");
    });
  };

  const fetchAISummary = async () => {
    setLoadingAI(true);
    try {
      const res = await axiosPrivate.post("/ai/generate-summary", {
        parsedData: data,
      });
      setAiSummary(res.data.summary);
    } catch {
      setAiSummary("You've hit the Gemini API quota limit. Please wait or upgrade your plan.");
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="p-6 text-gray-800 dark:text-white">
      <h1 className="text-2xl font-bold text-indigo-700 dark:text-indigo-500 mb-6">
        Data Visualization
      </h1>

      {/* File Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Select File</label>
        <select
          value={selectedFileId}
          onChange={(e) => setSelectedFileId(e.target.value)}
          className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 text-black dark:text-white"
        >
          {files.map((file) => (
            <option key={file._id} value={file._id}>
              {file.originalName}
            </option>
          ))}
        </select>
      </div>

      {/* Controls */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium mb-1">Chart Type</label>
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 text-black dark:text-white"
          >
            <option value="bar">Bar</option>
            <option value="line">Line</option>
            <option value="pie">Pie</option>
            <option value="3d">3D Bar</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">X-Axis</label>
          <select
            value={xField}
            onChange={(e) => setXField(e.target.value)}
            className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 text-black dark:text-white"
          >
            {fields.map((field) => (
              <option key={field} value={field}>
                {field}
              </option>
            ))}
          </select>
        </div>

        {chartType !== "pie" && (
          <div>
            <label className="block text-sm font-medium mb-1">Y-Axis</label>
            <select
              value={yField}
              onChange={(e) => setYField(e.target.value)}
              className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 text-black dark:text-white"
            >
              {fields
                .filter((field) => typeof data[0]?.[field] === "number")
                .map((field) => (
                  <option key={field} value={field}>
                    {field}
                  </option>
                ))}
            </select>
          </div>
        )}
      </div>

      {/* Chart */}
      <div
        id="chart-container"
        className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-lg"
      >
        {chartType === "3d" ? (
          <ThreeDChart
            data={data.map((row, index) => ({
              index,
              x: row[xField],
              y: typeof row[yField] === "number" ? row[yField] : 0,
            }))}
          />
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            {chartType === "bar" && (
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={xField} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey={yField} fill="#10b981" />
              </BarChart>
            )}
            {chartType === "line" && (
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={xField} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey={yField} stroke="#10b981" />
              </LineChart>
            )}
            {chartType === "pie" && (
              <PieChart>
                <Tooltip />
                <Legend />
                <Pie
                  data={[...data].slice(0, 10)}
                  dataKey={yField}
                  nameKey={xField}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  fill="#6366f1"
                  label
                >
                  {[...data].slice(0, 10).map((_, i) => (
                    <Cell
                      key={i}
                      fill={["#6366f1", "#10b981", "#f59e0b", "#ef4444"][i % 4]}
                    />
                  ))}
                </Pie>
              </PieChart>
            )}
          </ResponsiveContainer>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mt-6">
        {/* PNG Button */}
        <button
          onClick={downloadChartAsImage}
          className="relative group px-6 py-2 bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-medium rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 cursor-pointer"
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
                d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3"
              />
            </svg>
            Download PNG
          </span>
        </button>

        {/* PDF Button */}
        <button
          onClick={downloadChartAsPDF}
          className="relative group px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-medium rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 cursor-pointer"
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
                d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3"
              />
            </svg>
            Download PDF
          </span>
        </button>

        {/* AI Insights Button */}
        <button
          onClick={fetchAISummary}
          disabled={loadingAI}
          className={`relative group px-6 py-2 rounded-lg shadow-lg font-medium transition-transform transform hover:scale-105 cursor-pointer ${
            loadingAI
              ? "bg-pink-400 text-white cursor-not-allowed"
              : "bg-gradient-to-r from-pink-500 to-rose-600 text-white hover:from-pink-600 hover:to-rose-700"
          }`}
        >
          <span className="absolute left-0 top-0 h-full w-0 bg-white/10 group-hover:w-full transition-all duration-300 ease-in-out"></span>
          <span className="relative z-10 flex items-center gap-2">
            {loadingAI ? (
              <>
                <svg
                  className="w-5 h-5 animate-spin"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Analyzing...
              </>
            ) : (
              <>
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
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                Get AI Insights
              </>
            )}
          </span>
        </button>
      </div>

      {/* AI Summary */}
      {aiSummary && (
        <div className="mt-6 bg-gray-100 dark:bg-gray-900 p-4 rounded shadow">
          <h3 className="font-semibold text-indigo-700 dark:text-indigo-400 mb-2">
            AI Summary:
          </h3>
          <p>{aiSummary}</p>
        </div>
      )}
    </div>
  );
}
