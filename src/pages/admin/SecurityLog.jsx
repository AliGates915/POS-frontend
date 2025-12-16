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
  FiClock,
  FiActivity,
  FiCalendar,
  FiEye,
  FiSearch,
  FiFilter,
  FiDownload,
  FiRefreshCw
} from "react-icons/fi";
import { FaShieldAlt, FaHistory } from "react-icons/fa";
import Pagination from "../../pages/admin/pagination/Pagination";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const SecurityLog = () => {
  const [securityLogList, setSecurityLogList] = useState([]);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Form states
  const [id, setId] = useState("");
  const [userId, setUserId] = useState("");
  const [activityTime, setActivityTime] = useState("");
  const [activity, setActivity] = useState("");
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState(null);
  const [activityFilter, setActivityFilter] = useState("");
  
  // Dropdown data
  const [users, setUsers] = useState([]);
  
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const sliderRef = useRef(null);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  // Dummy data for demonstration
  const dummySecurityLogs = [
    {
      _id: "1",
      id: "LOG001",
      userId: "USR001",
      user: "John Doe (Admin)",
      activityTime: "14:30:25",
      date: "2024-01-15",
      activity: "User login successful",
      severity: "low"
    },
    {
      _id: "2",
      id: "LOG002",
      userId: "USR001",
      user: "John Doe (Admin)",
      activityTime: "14:35:42",
      date: "2024-01-15",
      activity: "Accessed user management module",
      severity: "low"
    },
    {
      _id: "3",
      id: "LOG003",
      userId: "USR002",
      user: "Jane Smith (Manager)",
      activityTime: "09:15:10",
      date: "2024-01-16",
      activity: "Failed login attempt - wrong password",
      severity: "medium"
    },
    {
      _id: "4",
      id: "LOG004",
      userId: "USR001",
      user: "John Doe (Admin)",
      activityTime: "11:22:33",
      date: "2024-01-16",
      activity: "Created new user account",
      severity: "medium"
    },
    {
      _id: "5",
      id: "LOG005",
      userId: "USR003",
      user: "Mike Wilson (User)",
      activityTime: "15:45:20",
      date: "2024-01-16",
      activity: "User logout",
      severity: "low"
    },
    {
      _id: "6",
      id: "LOG006",
      userId: "USR004",
      user: "Sara Jones (Admin)",
      activityTime: "08:30:15",
      date: "2024-01-17",
      activity: "Password changed successfully",
      severity: "medium"
    },
    {
      _id: "7",
      id: "LOG007",
      userId: "USR002",
      user: "Jane Smith (Manager)",
      activityTime: "13:20:45",
      date: "2024-01-17",
      activity: "Unauthorized access attempt to admin settings",
      severity: "high"
    },
    {
      _id: "8",
      id: "LOG008",
      userId: "USR001",
      user: "John Doe (Admin)",
      activityTime: "16:10:30",
      date: "2024-01-17",
      activity: "System configuration updated",
      severity: "high"
    },
    {
      _id: "9",
      id: "LOG009",
      userId: "USR005",
      user: "Alex Chen (Manager)",
      activityTime: "10:05:55",
      date: "2024-01-18",
      activity: "Multiple failed login attempts - account locked",
      severity: "high"
    },
    {
      _id: "10",
      id: "LOG010",
      userId: "USR004",
      user: "Sara Jones (Admin)",
      activityTime: "14:55:40",
      date: "2024-01-18",
      activity: "Security audit completed",
      severity: "low"
    },
    {
      _id: "11",
      id: "LOG011",
      userId: "USR006",
      user: "Lisa Wong (User)",
      activityTime: "09:40:25",
      date: "2024-01-19",
      activity: "Downloaded report",
      severity: "low"
    },
    {
      _id: "12",
      id: "LOG012",
      userId: "USR001",
      user: "John Doe (Admin)",
      activityTime: "17:30:15",
      date: "2024-01-19",
      activity: "Database backup initiated",
      severity: "medium"
    }
  ];

  // Dummy users
  const dummyUsers = [
    { id: "USR001", name: "John Doe", role: "Admin", fullName: "John Doe (Admin)" },
    { id: "USR002", name: "Jane Smith", role: "Manager", fullName: "Jane Smith (Manager)" },
    { id: "USR003", name: "Mike Wilson", role: "User", fullName: "Mike Wilson (User)" },
    { id: "USR004", name: "Sara Jones", role: "Admin", fullName: "Sara Jones (Admin)" },
    { id: "USR005", name: "Alex Chen", role: "Manager", fullName: "Alex Chen (Manager)" },
    { id: "USR006", name: "Lisa Wong", role: "User", fullName: "Lisa Wong (User)" }
  ];

  // Activity types for filter
  const activityTypes = [
    "All Activities",
    "Login",
    "Logout",
    "User Management",
    "Security Events",
    "System Changes",
    "Data Access",
    "Password Changes"
  ];

  // Function to generate the next log ID
  const generateNextLogId = () => {
    if (securityLogList.length === 0) {
      return "LOG001";
    }

    // Extract all numeric parts from existing IDs
    const existingIds = securityLogList
      .map((item) => item.id)
      .filter((id) => id && id.startsWith("LOG"))
      .map((id) => {
        const match = id.match(/LOG(\d+)/);
        return match ? parseInt(match[1]) : 0;
      })
      .filter((num) => !isNaN(num));

    if (existingIds.length === 0) {
      return "LOG001";
    }

    // Find the highest number
    const maxId = Math.max(...existingIds);

    // Generate next ID with leading zeros
    const nextIdNum = maxId + 1;
    const nextId = `LOG${nextIdNum.toString().padStart(3, "0")}`;

    return nextId;
  };

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

  // Fetch security logs
  const fetchSecurityLogs = useCallback(async () => {
    try {
      setLoading(true);
      // Try to fetch from API first
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/security-logs`
      );
      if (res.data && res.data.length > 0) {
        setSecurityLogList(res.data);
      } else {
        // If no data from API, use dummy data
        setSecurityLogList(dummySecurityLogs);
        setUsers(dummyUsers);
        console.log("Using dummy security logs data");
      }
    } catch (error) {
      // If API fails, use dummy data for demonstration
      console.log("API failed, using dummy data");
      setSecurityLogList(dummySecurityLogs);
      setUsers(dummyUsers);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  }, []);

  useEffect(() => {
    fetchSecurityLogs();
  }, [fetchSecurityLogs]);

  // Filter security logs
  const filteredLogs = securityLogList.filter(log => {
    const matchesSearch = !searchTerm || 
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.activity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = !dateFilter || 
      log.date === dateFilter.toISOString().split('T')[0];
    
    const matchesActivity = !activityFilter || 
      activityFilter === "All Activities" ||
      log.activity.toLowerCase().includes(activityFilter.toLowerCase());

    return matchesSearch && matchesDate && matchesActivity;
  });

  const totalItems = filteredLogs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredLogs.slice(startIndex, startIndex + itemsPerPage);

  // Handlers
  const handleAddSecurityLog = () => {
    setIsSliderOpen(true);
    setIsEdit(false);
    setEditId(null);

    // Auto-generate the next ID
    const nextId = generateNextLogId();
    setId(nextId);

    // Set current time
    const now = new Date();
    const timeString = now.toTimeString().split(' ')[0];
    const dateString = now.toISOString().split('T')[0];
    
    setActivityTime(timeString);
    setActivity("");
    setUserId("");
  };

  // Get user name by ID
  const getUserName = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.fullName : "Unknown User";
  };

  // Get severity badge class
  const getSeverityBadgeClass = (severity) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Get activity icon
  const getActivityIcon = (activity) => {
    if (activity.toLowerCase().includes("login")) return "🔐";
    if (activity.toLowerCase().includes("logout")) return "🚪";
    if (activity.toLowerCase().includes("failed")) return "⚠️";
    if (activity.toLowerCase().includes("password")) return "🔑";
    if (activity.toLowerCase().includes("access")) return "👁️";
    if (activity.toLowerCase().includes("created") || activity.toLowerCase().includes("updated")) return "✏️";
    if (activity.toLowerCase().includes("audit") || activity.toLowerCase().includes("backup")) return "📊";
    return "📝";
  };

  // Save or Update Security Log
  const handleSave = async () => {
    if (!userId || !activityTime || !activity) {
      toast.error("User, Activity Time, and Activity are required");
      return;
    }

    const formData = new FormData();
    formData.append("id", id);
    formData.append("userId", userId);
    formData.append("activityTime", activityTime);
    formData.append("activity", activity);

    console.log("Form Data", [...formData.entries()]);

    try {
      const headers = {
        Authorization: `Bearer ${userInfo?.token || "dummy-token"}`,
        "Content-Type": "multipart/form-data",
      };

      const userName = getUserName(userId);
      const today = new Date().toISOString().split('T')[0];
      const severity = activity.toLowerCase().includes("failed") || 
                      activity.toLowerCase().includes("unauthorized") ? "high" : 
                      activity.toLowerCase().includes("changed") ||
                      activity.toLowerCase().includes("updated") ? "medium" : "low";

      if (isEdit && editId) {
        // For dummy data, update locally
        const updatedLog = {
          _id: editId,
          id,
          userId,
          user: userName,
          activityTime,
          date: today,
          activity,
          severity
        };

        setSecurityLogList(
          securityLogList.map((item) =>
            item._id === editId ? updatedLog : item
          )
        );
        toast.success("Security log updated successfully");
      } else {
        // For dummy data, add new log locally
        const newLog = {
          _id: `security-log-${Date.now()}`,
          id,
          userId,
          user: userName,
          activityTime,
          date: today,
          activity,
          severity
        };

        setSecurityLogList([newLog, ...securityLogList]);
        toast.success("Security log added successfully");
      }

      reState();
    } catch (error) {
      console.error(error);
      toast.error(`❌ ${isEdit ? "Update" : "Add"} Security Log failed`);
    }
  };

  // Edit Security Log
  const handleEdit = (log) => {
    setIsEdit(true);
    setEditId(log._id);
    setId(log.id || "");
    setUserId(log.userId || "");
    setActivityTime(log.activityTime || "");
    setActivity(log.activity || "");
    setIsSliderOpen(true);
  };

  // Delete Security Log
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
        title: "Delete Security Log?",
        text: "This action cannot be undone. Security logs are important for audit trails.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, keep log",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            // For dummy data, delete locally
            setSecurityLogList(securityLogList.filter((item) => item._id !== id));
            swalWithTailwindButtons.fire(
              "Deleted!",
              "Security log deleted successfully.",
              "success"
            );
          } catch (error) {
            console.error("Delete error:", error);
            swalWithTailwindButtons.fire(
              "Error!",
              "Failed to delete security log.",
              "error"
            );
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithTailwindButtons.fire(
            "Cancelled",
            "Security log is preserved.",
            "info"
          );
        }
      });
  };

  // Reset state
  const reState = () => {
    setIsSliderOpen(false);
    setIsEdit(false);
    setEditId(null);
    setId("");
    setUserId("");
    setActivityTime("");
    setActivity("");
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm("");
    setDateFilter(null);
    setActivityFilter("");
  };

  // Export logs
  const handleExportLogs = () => {
    toast.success("Exporting security logs...");
    // In real implementation, this would generate a CSV/PDF
  };

  // Show loading spinner
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <div className="text-center flex flex-col items-center justify-center">
          <HashLoader height="150" width="150" radius={1} color="#84CF16" />
          <p className="mt-4 text-gray-600">Loading security logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <FaShieldAlt className="text-newPrimary w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold text-newPrimary">Security Log</h1>
            <p className="text-gray-500 text-sm">
              Monitor and manage system security activities
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-newPrimary/80 transition-colors flex items-center gap-2"
            onClick={handleAddSecurityLog}
          >
            <FaHistory className="w-4 h-4" />
            Add Security Log
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="mb-6 p-4 bg-white rounded-xl shadow border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <FiFilter className="text-newPrimary" />
            Filter Logs
          </h3>
          <div className="flex items-center gap-3">
            <button
              onClick={handleClearFilters}
              className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1"
            >
              <FiRefreshCw className="w-4 h-4" />
              Clear Filters
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary"
              placeholder="Search logs..."
            />
          </div>

          {/* Date Filter */}
          <div className="relative">
            <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <DatePicker
              selected={dateFilter}
              onChange={(date) => setDateFilter(date)}
              dateFormat="yyyy-MM-dd"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary"
              placeholderText="Filter by date"
              isClearable
            />
          </div>

          {/* Activity Type Filter */}
          <div className="relative">
            <FiActivity className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={activityFilter}
              onChange={(e) => setActivityFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary appearance-none"
            >
              <option value="">All Activity Types</option>
              {activityTypes.map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Security Logs Table */}
      <div className="rounded-xl shadow-lg p-6 border border-gray-200 w-full overflow-hidden bg-white">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="min-w-[1000px]">
            {/* Table Headers */}
            <div className="grid grid-cols-[0.5fr_1.2fr_1fr_1fr_2fr_0.8fr] gap-4 bg-gradient-to-r from-gray-50 to-gray-100 py-4 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200 rounded-t-lg">
              <div>Sr#</div>
              <div>User</div>
              <div>Activity Time</div>
              <div>Date</div>
              <div>Activity</div>
              <div className="text-right">Actions</div>
            </div>

            {/* Security Logs List */}
            <div className="flex flex-col">
              {currentItems.map((log, index) => (
                <div
                  key={log._id}
                  className={`grid grid-cols-[0.5fr_1.2fr_1fr_1fr_2fr_0.8fr] items-center gap-4 px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-all duration-200 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                  }`}
                >
                  {/* Serial Number */}
                  <div className="text-sm font-medium text-gray-900">
                    {startIndex + index + 1}
                  </div>

                  {/* User */}
                  <div>
                    <div className="flex items-center gap-2">
                      <FiUser className="w-4 h-4 text-blue-500" />
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          {log.user}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          ID: {log.userId}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Activity Time */}
                  <div className="flex items-center gap-2">
                    <FiClock className="w-4 h-4 text-purple-500" />
                    <div className="text-sm font-mono text-gray-700">
                      {log.activityTime}
                    </div>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-2">
                    <FiCalendar className="w-4 h-4 text-green-500" />
                    <div className="text-sm text-gray-700">
                      {log.date}
                    </div>
                  </div>

                  {/* Activity */}
                  <div>
                    <div className="flex items-start gap-2">
                      <span className="text-lg mt-0.5">{getActivityIcon(log.activity)}</span>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {log.activity}
                        </div>
                        <div className="mt-1">
                          <span className={`text-xs font-medium px-2 py-1 rounded-full border ${getSeverityBadgeClass(log.severity)}`}>
                            {log.severity.charAt(0).toUpperCase() + log.severity.slice(1)} Severity
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 justify-end">
                    {/* VIEW ICON */}
                    <button
                      onClick={() => handleEdit(log)}
                      className="text-blue-600 hover:bg-blue-100 bg-blue-50 p-2 rounded-md transition"
                      title="View Details"
                    >
                      <FiEye className="w-4 h-4" />
                    </button>
                    
                    {/* EDIT ICON */}
                    <button
                      onClick={() => handleEdit(log)}
                      className="text-purple-600 hover:bg-purple-100 bg-purple-50 p-2 rounded-md transition"
                      title="Edit Log"
                    >
                      <FiEdit3 className="w-4 h-4" />
                    </button>

                    {/* DELETE ICON */}
                    <button
                      onClick={() => handleDelete(log._id)}
                      className="text-red-600 hover:bg-red-100 bg-red-50 p-2 rounded-md transition"
                      title="Delete Log"
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
          className={`relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl transform transition-all duration-500 ease-out ${
            isSliderOpen ? "translate-y-0 scale-100" : "translate-y-8 scale-95"
          }`}
        >
          {/* Header with gradient */}
          <div className="sticky top-0 z-10 bg-gray-200 px-8 py-4 rounded-t-3xl">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                    <FaShieldAlt className="w-6 h-6 text-newPrimary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-newPrimary">
                      {isEdit ? "Update Security Log" : "Add Security Log"}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {isEdit ? "Update security log details" : "Record new security activity"}
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
          <div className="px-8 py-6 overflow-y-auto max-h-[80vh] scrollbar-thin scrollbar-hide scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <div className="space-y-8 pb-2">
              {/* Form Section */}
              <div className="space-y-6 p-6 border border-gray-300/60 rounded-2xl bg-gray-100/40 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-2 border-b border-gray-300 pb-2">
                  <div className="w-1.5 h-6 bg-newPrimary rounded-full"></div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Log Information
                  </h3>
                </div>

                <div className="space-y-6">
                  {/* ID Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Log ID
                    </label>
                    <div className="relative">
                      <svg
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                        />
                      </svg>
                      <input
                        type="text"
                        value={id}
                        readOnly
                        className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl bg-white cursor-not-allowed transition-all duration-200"
                        placeholder="Auto-generated ID"
                      />
                    </div>
                  </div>

                  {/* User Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      User <span className="text-red-500 text-lg">*</span>
                    </label>
                    <div className="relative">
                      <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <select
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        required
                        className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary bg-white transition-all duration-200 hover:border-gray-400 appearance-none"
                      >
                        <option value="">Select User</option>
                        {users.map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.fullName}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Activity Time */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      Activity Time <span className="text-red-500 text-lg">*</span>
                    </label>
                    <div className="relative">
                      <FiClock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="time"
                        value={activityTime}
                        onChange={(e) => setActivityTime(e.target.value)}
                        required
                        className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary bg-white transition-all duration-200 hover:border-gray-400"
                      />
                    </div>
                  </div>

                  {/* Activity */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      Activity <span className="text-red-500 text-lg">*</span>
                    </label>
                    <div className="relative">
                      <FiActivity className="absolute left-4 top-4 text-gray-400" />
                      <textarea
                        value={activity}
                        onChange={(e) => setActivity(e.target.value)}
                        required
                        className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary bg-white transition-all duration-200 hover:border-gray-400 resize-none min-h-[100px]"
                        placeholder="Describe the security activity..."
                        rows="3"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex gap-4">
                <button
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-newPrimary to-newPrimary/90 text-white font-semibold rounded-xl hover:from-newPrimary/90 hover:to-newPrimary transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                  onClick={handleSave}
                >
                  <div className="flex items-center justify-center gap-3">
                    {isEdit ? (
                      <>
                        <FiEdit3 className="w-5 h-5" />
                        Update Security Log
                      </>
                    ) : (
                      <>
                        <FaHistory className="w-5 h-5" />
                        Save Security Log
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

export default SecurityLog;