import { Routes, Route } from "react-router-dom";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import DashboardLayout from "./pages/Dashboard/DashboardLayout";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute"; // ✅ New

import Profile from "./pages/Profile";
import LandingPage from "./pages/LandingPage";
import Home from "./pages/Dashboard/Home";
import Upload from "./pages/Dashboard/Upload";
import Charts from "./pages/Dashboard/Charts";
import History from "./pages/Dashboard/History";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import FileManagement from "./pages/admin/FileManagement";
import UserManagement from "./pages/admin/UserManagement";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

      {/* 🔐 Protected User Dashboard Routes */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="upload" element={<Upload />} />
        <Route path="charts" element={<Charts />} />
        <Route path="history" element={<History />} />
      </Route>

      {/* 🔐 Protected Admin Panel Routes */}
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          </PrivateRoute>
        }
      >
      <Route index element={<AdminDashboard />} />
      <Route path="users" element={<UserManagement />} />
      <Route path="files" element={<FileManagement />} />
      </Route>
    </Routes>
  );
}

export default App;
