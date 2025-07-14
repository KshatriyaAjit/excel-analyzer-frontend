import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosPrivate from "../api/axiosPrivate";
import { FaSignOutAlt} from "react-icons/fa"

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({ name: "", email: "" });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosPrivate.get("/auth/profile");
        setProfile(res.data.user);
        setUpdatedProfile({
          name: res.data.user.name,
          email: res.data.user.email,
        });
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setUpdatedProfile({ ...updatedProfile, [e.target.name]: e.target.value });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosPrivate.put("/auth/profile", updatedProfile);
      setProfile(res.data.user);
      setShowEditForm(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Profile update failed", err);
      alert("Failed to update profile");
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await axiosPrivate.post("/auth/upload-avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Avatar uploaded successfully!");
      setProfile((prev) => ({ ...prev, avatar: res.data.avatar }));
      e.target.value = null;
    } catch (err) {
      console.error("Avatar upload failed", err);
      alert("Failed to upload avatar");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      await axiosPrivate.put("/auth/change-password", passwordData);
      alert("Password updated successfully!");
      setPasswordData({ currentPassword: "", newPassword: "" });
      setShowPasswordForm(false);
    } catch (err) {
      console.error("Password update failed", err);
      alert(err?.response?.data?.message || "Failed to update password");
    }
  };

  if (!profile) {
    return (
      <p className="text-center p-6 dark:text-gray-300">Loading profile...</p>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 min-h-screen rounded-md">
      <h1 className="text-3xl font-bold text-indigo-700 dark:text-indigo-400 mb-6 text-center">
        User Profile
      </h1>

      {/* Avatar Section */}
      <div className="flex flex-col items-center mb-6">
        {profile.avatar ? (
          <img
            src= {profile.avatar} 
            alt="User Avatar"
            className="w-24 h-24 rounded-full object-cover border-2 border-indigo-500 mb-2"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-2 text-sm text-gray-800 dark:text-gray-100 border-2 border-indigo-500">
            User Avatar
          </div>
        )}

        {showEditForm && (
          <div className="w-full text-center mt-2">
            <label className="text-sm font-medium block mb-1 text-gray-700 dark:text-gray-200">
              Upload Avatar
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="block w-full text-sm file:text-sm file:font-medium file:rounded file:border-0 file:px-3 file:py-1 file:bg-indigo-100 dark:file:bg-gray-700 file:text-indigo-700 dark:file:text-white text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
            />
          </div>
        )}
      </div>

      {/* Profile Info Box */}
      <div className="bg-white dark:bg-gray-800 shadow rounded p-6 mb-6">
        <p className="mb-2">
          <strong>Email:</strong> {profile.email}
        </p>
        <p className="mb-2">
          <strong>Name:</strong> {profile.name}
        </p>
        <p className="mb-4">
          <strong>Role:</strong> {profile.role}
        </p>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
          className="relative inline-flex items-center justify-center px-6 py-2 mt-4 font-semibold text-red-600 border border-red-600 rounded-md overflow-hidden transition-all duration-300 group hover:bg-red-600 hover:text-white shadow-sm cursor-pointer"
        >
          <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-red-100 group-hover:w-full group-hover:h-full group-hover:rounded-md group-hover:scale-110 opacity-20"></span>
            <span className="relative z-10 flex items-center gap-2">
              <FaSignOutAlt className="w-5 h-5" />
              Logout
            </span>
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:space-x-4 gap-4 mb-4">
<button
  onClick={() => setShowEditForm((prev) => !prev)}
  className={`relative group w-full sm:w-auto inline-flex items-center justify-center px-6 py-2 rounded-lg font-semibold shadow-md transition-all duration-300 ease-in-out cursor-pointer
    ${showEditForm
      ? "bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700"
      : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"} 
    text-white overflow-hidden`}
>
  {/* Glow effect */}
  <span className="absolute inset-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition duration-300 blur-sm"></span>

  {/* Button text */}
  <span className="relative z-10">
    {showEditForm ? "❌ Cancel Edit" : "✏️ Edit Profile"}
  </span>
</button>

<button
  onClick={() => setShowPasswordForm((prev) => !prev)}
  className={`relative group w-full sm:w-auto inline-flex items-center justify-center px-6 py-2 rounded-lg font-semibold shadow-md transition-all duration-300 ease-in-out cursor-pointer
    ${showPasswordForm
      ? "bg-gradient-to-r from-rose-400 to-red-500 hover:from-rose-500 hover:to-red-600"
      : "bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600"}
    text-white overflow-hidden`}
>
  {/* Glow hover effect */}
  <span className="absolute inset-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition duration-300 blur-sm"></span>

  {/* Button Text */}
  <span className="relative z-10">
    {showPasswordForm ? "❌ Cancel Change" : "🔐 Change Password"}
  </span>
</button>

      </div>

      {/* Edit Profile Form */}
      {showEditForm && (
        <form onSubmit={handleProfileUpdate} className="space-y-4 mb-6">
          <input
            type="text"
            name="name"
            value={updatedProfile.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full border px-4 py-2 rounded bg-white dark:bg-gray-900 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />
          <input
            type="email"
            name="email"
            value={updatedProfile.email}
            onChange={handleChange}
            placeholder="Email Address"
            className="w-full border px-4 py-2 rounded bg-white dark:bg-gray-900 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />
       <button
  type="submit"
  className="relative group w-full sm:w-auto inline-flex items-center justify-center px-6 py-2 rounded-lg font-semibold shadow-md transition-all duration-300 ease-in-out cursor-pointer
    bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700
    text-white overflow-hidden"
>
  {/* Hover glow effect */}
  <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition duration-300 blur-sm"></span>

  {/* Button label */}
  <span className="relative z-10 flex items-center gap-2">
    💾 Save Changes
  </span>
</button>

        </form>
      )}

      {/* Change Password Form */}
      {showPasswordForm && (
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <input
            type="password"
            name="currentPassword"
            value={passwordData.currentPassword}
            onChange={(e) =>
              setPasswordData({
                ...passwordData,
                currentPassword: e.target.value,
              })
            }
            placeholder="Current Password"
            className="w-full border px-4 py-2 rounded bg-white dark:bg-gray-900 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            required
          />
          <input
            type="password"
            name="newPassword"
            value={passwordData.newPassword}
            onChange={(e) =>
              setPasswordData({ ...passwordData, newPassword: e.target.value })
            }
            placeholder="New Password"
            className="w-full border px-4 py-2 rounded bg-white dark:bg-gray-900 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition w-full sm:w-auto"
          >
            Change Password
          </button>
        </form>
      )}
    </div>
  );
}
