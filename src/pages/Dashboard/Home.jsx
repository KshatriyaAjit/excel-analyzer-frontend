import React from "react";
import { FaFileUpload, FaChartBar, FaHistory } from "react-icons/fa";

export default function Home() {
  const cards = [
    {
      icon: (
        <FaFileUpload className="text-indigo-500 dark:text-indigo-400 text-3xl" />
      ),
      title: "Upload Excel",
      description: "Upload a .xlsx file to begin analysis.",
    },
    {
      icon: (
        <FaChartBar className="text-indigo-500 dark:text-indigo-400 text-3xl" />
      ),
      title: "View Charts",
      description: "Choose chart type, X/Y axis, and download graphs.",
    },
    {
      icon: (
        <FaHistory className="text-indigo-500 dark:text-indigo-400 text-3xl" />
      ),
      title: "History",
      description: "Access your past uploads and analysis records.",
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-indigo-700 dark:text-indigo-400 mb-4">
        Welcome to Excel Analytics Platform
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Analyze Excel files, visualize data with 2D/3D charts, and gain
        insights.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300 ease-in-out"
          >
            <div className="mb-3">{card.icon}</div>
            <h2 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">
              {card.title}
            </h2>
            <p className="text-gray-500 dark:text-gray-300 text-sm mt-2">
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
