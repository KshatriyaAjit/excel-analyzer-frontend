import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosPrivate from "../api/axiosPrivate";

export default function AdminRoute({ children }) {
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    const checkRole = async () => {
      try {
        const res = await axiosPrivate.get("/auth/profile");
        setIsAdmin(res.data.user.role === "admin");
      } catch {
        setIsAdmin(false);
      }
    };
    checkRole();
  }, []);

  if (isAdmin === null)
    return <p className="text-center p-6">Checking access...</p>;
  if (!isAdmin) return <Navigate to="/dashboard" />;
  return children;
}
