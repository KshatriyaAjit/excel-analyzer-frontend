import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";
import Home from "./Home";
import Upload from "./Upload";

export default function Dashboard() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        {/* Default dashboard route (dashboard home) */}
        <Route index element={<Home />} />
        <Route path="upload" element={<Upload />} />
      </Route>
    </Routes>
  );
}
