import React, { useState, useCallback, useEffect, useRef } from "react";
import gsap from "gsap";
import { toast } from "react-toastify";
import axios from "axios";
import { HashLoader } from "react-spinners";
import Swal from "sweetalert2";
import {
  FiEdit3,
  FiTrash2,
  FiUser,
  FiMail,
  FiKey,
  FiBriefcase,
  FiInfo,
} from "react-icons/fi";
import { FaUserTie } from "react-icons/fa";
import Pagination from "../../pages/admin/pagination/Pagination";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Users = () => {
  const [userList, setUserList] = useState([]);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [isChangePassword, setIsChangePassword] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Form states
  const [userId, setUserId] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("User");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Active");

  // For change password
  const [newPassword, setNewPassword] = useState("");

  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const sliderRef = useRef(null);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  // Dummy data for demonstration
  const dummyUsers = [
    {
      _id: "1",
      userId: "USR001",
      companyId: "COMP001",
      employeeId: "EMP001",
      userName: "john_doe",
      employeeName: "John Doe",
      email: "john.doe@company.com",
      password: "password123",
      role: "Admin",
      description: "System Administrator with full access",
      status: "Active",
    },
    {
      _id: "2",
      userId: "USR002",
      companyId: "COMP001",
      employeeId: "EMP002",
      userName: "jane_smith",
      employeeName: "Jane Smith",
      email: "jane.smith@company.com",
      password: "password123",
      role: "Manager",
      description: "Department Manager",
      status: "Active",
    },
    {
      _id: "3",
      userId: "USR003",
      companyId: "COMP001",
      employeeId: "EMP003",
      userName: "mike_wilson",
      employeeName: "Mike Wilson",
      email: "mike.wilson@company.com",
      password: "password123",
      role: "User",
      description: "Regular user with limited access",
      status: "Inactive",
    },
    {
      _id: "4",
      userId: "USR004",
      companyId: "COMP002",
      employeeId: "EMP004",
      userName: "sara_jones",
      employeeName: "Sara Jones",
      email: "sara.jones@company.com",
      password: "password123",
      role: "Admin",
      description: "Finance Department Admin",
      status: "Active",
    },
    {
      _id: "5",
      userId: "USR005",
      companyId: "COMP002",
      employeeId: "EMP005",
      userName: "alex_chen",
      employeeName: "Alex Chen",
      email: "alex.chen@company.com",
      password: "password123",
      role: "Manager",
      description: "Sales Team Manager",
      status: "Active",
    },
    {
      _id: "6",
      userId: "USR006",
      companyId: "COMP001",
      employeeId: "EMP006",
      userName: "lisa_wong",
      employeeName: "Lisa Wong",
      email: "lisa.wong@company.com",
      password: "password123",
      role: "User",
      description: "Marketing Team Member",
      status: "Pending",
    },
    {
      _id: "7",
      userId: "USR007",
      companyId: "COMP003",
      employeeId: "EMP007",
      userName: "david_kim",
      employeeName: "David Kim",
      email: "david.kim@company.com",
      password: "password123",
      role: "Admin",
      description: "IT Department Head",
      status: "Active",
    },
    {
      _id: "8",
      userId: "USR008",
      companyId: "COMP003",
      employeeId: "EMP008",
      userName: "emma_taylor",
      employeeName: "Emma Taylor",
      email: "emma.taylor@company.com",
      password: "password123",
      role: "User",
      description: "Customer Support",
      status: "Suspended",
    },
  ];

  // Slider animation
  useEffect(() => {
    if (isSliderOpen && sliderRef.current) {
      gsap.fromTo(
        sliderRef.current,
        { scale: 0.7, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: "power2.out" }
      );
    }
  }, [isSliderOpen]);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      // Try to fetch from API first
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users`);
      if (res.data && res.data.length > 0) {
        setUserList(res.data);
      } else {
        // If no data from API, use dummy data
        setUserList(dummyUsers);
        console.log("Using dummy users data");
      }
    } catch (error) {
      // If API fails, use dummy data for demonstration
      console.log("API failed, using dummy data");
      setUserList(dummyUsers);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const totalItems = userList.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = userList.slice(startIndex, startIndex + itemsPerPage);

  // Handlers
  const handleAddUser = () => {
    setIsSliderOpen(true);
    setIsEdit(false);
    setIsChangePassword(false);
    setEditId(null);
    setUserId("");
    setCompanyId("");
    setEmployeeId("");
    setUserName("");
    setEmail("");
    setPassword("");
    setRole("User");
    setDescription("");
    setStatus("Active");
  };

  // Save or Update User
  const handleSave = async () => {
    if (!userName || !email || !password) {
      toast.error("User Name, Email and Password are required");
      return;
    }

    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("companyId", companyId);
    formData.append("employeeId", employeeId);
    formData.append("userName", userName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("role", role);
    formData.append("description", description);
    formData.append("status", status);

    console.log("Form Data", [...formData.entries()]);

    try {
      const headers = {
        Authorization: `Bearer ${userInfo?.token || "dummy-token"}`,
        "Content-Type": "multipart/form-data",
      };

      if (isEdit && editId) {
        // For dummy data, update locally
        const updatedUser = {
          _id: editId,
          userId,
          companyId,
          employeeId,
          userName,
          employeeName: userName, // Assuming employee name is same as username for demo
          email,
          password,
          role,
          description,
          status,
        };

        setUserList(
          userList.map((user) => (user._id === editId ? updatedUser : user))
        );
        toast.success("User updated successfully");
      } else {
        // For dummy data, add new user locally
        const newUser = {
          _id: `user-${Date.now()}`,
          userId: userId || `USR${Date.now().toString().slice(-6)}`,
          companyId,
          employeeId,
          userName,
          employeeName: userName,
          email,
          password,
          role,
          description,
          status,
        };

        setUserList([newUser, ...userList]);
        toast.success("User added successfully");
      }

      reState();
    } catch (error) {
      console.error(error);
      toast.error(`❌ ${isEdit ? "Update" : "Add"} User failed`);
    }
  };

  // Change Password
  const handleChangePassword = async () => {
    if (!newPassword) {
      toast.error("Please enter new password");
      return;
    }

    try {
      // For dummy data, update locally
      setUserList(
        userList.map((user) =>
          user._id === editId ? { ...user, password: newPassword } : user
        )
      );

      toast.success("✅ Password changed successfully");
      setIsChangePassword(false);
      reState();
    } catch (error) {
      console.error(error);
      toast.error("❌ Password change failed");
    }
  };

  // Edit User
  const handleEdit = (user) => {
    setIsEdit(true);
    setIsChangePassword(false);
    setEditId(user._id);
    setUserId(user.userId || "");
    setCompanyId(user.companyId || "");
    setEmployeeId(user.employeeId || "");
    setUserName(user.userName || "");
    setEmail(user.email || "");
    setPassword(user.password || "");
    setRole(user.role || "User");
    setDescription(user.description || "");
    setStatus(user.status || "Active");
    setIsSliderOpen(true);
  };

  // Open Change Password Form
  const handleOpenChangePassword = (user) => {
    setIsChangePassword(true);
    setIsEdit(false);
    setEditId(user._id);
    setUserName(user.userName || "");
    setNewPassword("");
    setIsSliderOpen(true);
  };

  // Delete User
  const handleDelete = async (id) => {
    const swalWithTailwindButtons = Swal.mixin({
      customClass: {
        actions: "space-x-2",
        confirmButton:
          "bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300",
        cancelButton:
          "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300",
      },
      buttonsStyling: false,
    });

    swalWithTailwindButtons
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            // For dummy data, delete locally
            setUserList(userList.filter((user) => user._id !== id));
            swalWithTailwindButtons.fire(
              "Deleted!",
              "User deleted successfully.",
              "success"
            );
          } catch (error) {
            console.error("Delete error:", error);
            swalWithTailwindButtons.fire(
              "Error!",
              "Failed to delete user.",
              "error"
            );
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithTailwindButtons.fire("Cancelled", "User is safe 🙂", "error");
        }
      });
  };

  // Reset state
  const reState = () => {
    setIsSliderOpen(false);
    setIsEdit(false);
    setIsChangePassword(false);
    setEditId(null);
    setUserId("");
    setCompanyId("");
    setEmployeeId("");
    setUserName("");
    setEmail("");
    setPassword("");
    setRole("User");
    setDescription("");
    setStatus("Active");
    setNewPassword("");
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get role badge class
  const getRoleBadgeClass = (role) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "bg-purple-100 text-purple-800";
      case "manager":
        return "bg-blue-100 text-blue-800";
      case "user":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Show loading spinner
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <div className="text-center flex flex-col items-center justify-center">
          <HashLoader height="150" width="150" radius={1} color="#84CF16" />
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <FaUserTie className="text-newPrimary w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold text-newPrimary">Users</h1>
            <p className="text-gray-500 text-sm">
              Manage system users and their permissions
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-newPrimary/80 transition-colors flex items-center gap-2"
            onClick={handleAddUser}
          >
            + Add User
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-xl shadow-lg p-6 border border-gray-200 w-full overflow-hidden bg-white">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="min-w-[1200px]">
            {/* Table Headers */}
            <div className="grid grid-cols-[0.5fr_1fr_1fr_1fr_1fr_1fr_0.8fr] gap-4 bg-gradient-to-r from-gray-50 to-gray-100 py-4 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200 rounded-t-lg">
              <div>Sr#</div>
              <div>User Name</div>
              <div>Employee Name</div>
              <div>Email</div>
              <div>Role</div>
              <div>Status</div>
              <div className="text-center">Actions</div>
            </div>

            {/* Users List */}
            <div className="flex flex-col">
              {currentItems.map((user, index) => (
                <div
                  key={user._id}
                  className={`grid grid-cols-[0.5fr_1fr_1fr_1fr_1fr_1fr_0.8fr] items-center gap-4 px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-all duration-200 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                  }`}
                >
                  {/* Serial Number */}
                  <div className="text-sm font-medium text-gray-900">
                    {startIndex + index + 1}
                  </div>

                  {/* User Name */}
                  <div>
                    <div className="text-sm font-semibold text-gray-900 truncate">
                      {user.userName}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      ID: {user.userId || user._id}
                    </div>
                  </div>

                  {/* Employee Name */}
                  <div className="text-sm text-gray-600">
                    {user.employeeName || user.userName}
                  </div>

                  {/* Email */}
                  <div
                    className="text-sm text-gray-600 truncate"
                    title={user.email}
                  >
                    {user.email}
                  </div>

                  {/* Role */}
                  <div className="text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeClass(
                        user.role
                      )}`}
                    >
                      {user.role}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(
                        user.status
                      )}`}
                    >
                      {user.status}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 justify-center">
                    {/* EDIT ICON */}
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-blue-600 hover:bg-blue-100 bg-blue-50 p-2 rounded-md transition"
                      title="Edit User"
                    >
                      <FiEdit3 className="w-4 h-4" />
                    </button>

                    {/* CHANGE PASSWORD ICON */}
                    <button
                      onClick={() => handleOpenChangePassword(user)}
                      className="text-yellow-600 hover:bg-yellow-100 bg-yellow-50 p-2 rounded-md transition"
                      title="Change Password"
                    >
                      <FiKey className="w-4 h-4" />
                    </button>

                    {/* DELETE ICON */}
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="text-red-600 hover:bg-red-100 bg-red-50 p-2 rounded-md transition"
                      title="Delete User"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          compact={true}
        />
      </div>

      {/* Slider/Modal */}
      <div
        className={`fixed inset-0 flex items-center justify-center z-50 transition-all duration-300 ${
          isSliderOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-gray-600/70 backdrop-blur-0 transition-opacity duration-300 ${
            isSliderOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={reState}
        />

        {/* Slider Content */}
        <div
          ref={sliderRef}
          className={`relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl transform transition-all duration-500 ease-out ${
            isSliderOpen ? "translate-y-0 scale-100" : "translate-y-8 scale-95"
          }`}
        >
          {/* Header with gradient */}
          <div className="sticky top-0 z-10 bg-gray-200 px-8 py-4 rounded-t-3xl">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                    <FiUser className="w-6 h-6 text-newPrimary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-newPrimary">
                      {isChangePassword
                        ? "Change Password"
                        : isEdit
                        ? "Update User"
                        : "Add New User"}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {isChangePassword
                        ? "Set a new password for the user"
                        : isEdit
                        ? "Update user details"
                        : "Fill in the user information below"}
                    </p>
                  </div>
                </div>
              </div>
              <button
                className="p-1 hover:bg-white/20 bg-white/10 rounded-xl transition-all duration-300 group backdrop-blur-sm hover:scale-105"
                onClick={reState}
              >
                <svg
                  className="w-6 h-6 text-white bg-newPrimary rounded-lg group-hover:rotate-90 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="px-8 py-6 overflow-y-auto max-h-[75vh] scrollbar-thin scrollbar-hide scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <div className="space-y-8 pb-2">
              {isChangePassword ? (
                /* Change Password Form */
                <div className="space-y-6 p-6 border border-gray-300/60 rounded-2xl bg-gray-100/40 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-center gap-3 mb-2 border-b border-gray-300 pb-2">
                    <div className="w-1.5 h-6 bg-yellow-500 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Change Password
                    </h3>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      User Name
                    </label>
                    <input
                      type="text"
                      value={userName}
                      disabled
                      className="w-full px-4 py-3.5 border border-gray-300 rounded-xl bg-gray-100 transition-all duration-200 cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      New Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FiKey className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary bg-white transition-all duration-200 hover:border-gray-400"
                        placeholder="Enter new password"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                /* User Information Form */
                <>
                  {/* Section 1: Basic Information */}
                  <div className="space-y-6 p-6 border border-gray-300/60 rounded-2xl bg-gray-100/40 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center gap-3 mb-2 border-b border-gray-300 pb-2">
                      <div className="w-1.5 h-6 bg-newPrimary rounded-full"></div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Basic Information
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      {/* User ID */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          User ID
                        </label>
                        <input
                          type="text"
                          value={userId}
                          onChange={(e) => setUserId(e.target.value)}
                          className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary bg-white transition-all duration-200 hover:border-gray-400 placeholder:text-gray-400"
                          placeholder="USR001"
                        />
                      </div>

                      {/* User Name */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          User Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            required
                            className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary bg-white transition-all duration-200 hover:border-gray-400"
                            placeholder="john_doe"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      {/* Company ID */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Company ID
                        </label>
                        <input
                          type="text"
                          value={companyId}
                          onChange={(e) => setCompanyId(e.target.value)}
                          className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary bg-white transition-all duration-200 hover:border-gray-400 placeholder:text-gray-400"
                          placeholder="COMP001"
                        />
                      </div>

                      {/* Employee ID */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Employee ID
                        </label>
                        <input
                          type="text"
                          value={employeeId}
                          onChange={(e) => setEmployeeId(e.target.value)}
                          className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary bg-white transition-all duration-200 hover:border-gray-400 placeholder:text-gray-400"
                          placeholder="EMP001"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Account Information */}
                  <div className="space-y-6 p-6 border border-gray-300/60 rounded-2xl bg-gray-100/40 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center gap-3 mb-2 border-b border-gray-300 pb-2">
                      <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Account Information
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      {/* Email */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary bg-white transition-all duration-200 hover:border-gray-400"
                            placeholder="user@example.com"
                          />
                        </div>
                      </div>

                      {/* Password */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <FiKey className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required={!isEdit}
                            className="w-full pl-12 pr-12 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary bg-white transition-all duration-200 hover:border-gray-400"
                            placeholder={
                              isEdit
                                ? "Enter to change password"
                                : "Enter password"
                            }
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                          >
                            {showPassword ? (
                              <AiOutlineEyeInvisible className="w-5 h-5" />
                            ) : (
                              <AiOutlineEye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Role & Status */}
                  <div className="space-y-6 p-6 border border-gray-300/60 rounded-2xl bg-gray-100/40 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center gap-3 mb-2 border-b border-gray-300 pb-2">
                      <div className="w-1.5 h-6 bg-purple-500 rounded-full"></div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Role & Status
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      {/* Role */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Role
                        </label>
                        <select
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary bg-white transition-all duration-200 hover:border-gray-400 appearance-none"
                        >
                          <option value="Admin">Admin</option>
                          <option value="Manager">Manager</option>
                          <option value="User">User</option>
                        </select>
                      </div>

                      {/* Status */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Status
                        </label>
                        <select
                          value={status}
                          onChange={(e) => setStatus(e.target.value)}
                          className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary bg-white transition-all duration-200 hover:border-gray-400 appearance-none"
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                          <option value="Pending">Pending</option>
                          <option value="Suspended">Suspended</option>
                        </select>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <div className="relative">
                        <FiInfo className="absolute left-4 top-4 text-gray-400" />
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary bg-white transition-all duration-200 hover:border-gray-400 resize-none min-h-[100px]"
                          placeholder="Enter user description..."
                          rows="3"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Save Button */}
              <div className="flex gap-4">
                <button
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-newPrimary to-newPrimary/90 text-white font-semibold rounded-xl hover:from-newPrimary/90 hover:to-newPrimary transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                  onClick={isChangePassword ? handleChangePassword : handleSave}
                >
                  <div className="flex items-center justify-center gap-3">
                    {isChangePassword ? (
                      <>
                        <FiKey className="w-5 h-5" />
                        Change Password
                      </>
                    ) : isEdit ? (
                      <>
                        <FiEdit3 className="w-5 h-5" />
                        Update User
                      </>
                    ) : (
                      <>
                        <FiUser className="w-5 h-5" />
                        Save User
                      </>
                    )}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
