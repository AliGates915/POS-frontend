import React, { useState, useEffect, useRef, useCallback } from "react";
import { HashLoader } from "react-spinners";
import gsap from "gsap";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import axios from "axios";
import { FiEdit3, FiTrash2, FiUsers, FiGrid, FiCode } from "react-icons/fi";
import Pagination from "../pagination/Pagination";

const GroupRights = () => {
  // State declarations
  const [rightsList, setRightsList] = useState([]);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [selectedModuleId, setSelectedModuleId] = useState("");
  const [selectedFunctionId, setSelectedFunctionId] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const sliderRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Sample data (in real app, fetch from APIs)
  const groups = [
    { _id: "GR001", groupName: "Administrators" },
    { _id: "GR002", groupName: "Managers" },
    { _id: "GR003", groupName: "Sales Staff" },
    { _id: "GR004", groupName: "Inventory Managers" },
    { _id: "GR005", groupName: "Cashiers" },
    { _id: "GR006", groupName: "View Only" },
  ];

  const modules = [
    { _id: "MI001", moduleName: "Dashboard" },
    { _id: "MI002", moduleName: "Inventory Management" },
    { _id: "MI003", moduleName: "Sales & Invoicing" },
    { _id: "MI004", moduleName: "Customer Management" },
    { _id: "MI005", moduleName: "Reporting & Analytics" },
    { _id: "MI006", moduleName: "User Management" },
  ];

  const functions = [
    { _id: "MF001", functionName: "View Dashboard", moduleId: "MI001" },
    { _id: "MF002", functionName: "Add Product", moduleId: "MI002" },
    { _id: "MF003", functionName: "Update Stock", moduleId: "MI002" },
    { _id: "MF004", functionName: "Create Invoice", moduleId: "MI003" },
    { _id: "MF005", functionName: "Process Payment", moduleId: "MI003" },
    { _id: "MF006", functionName: "Add Customer", moduleId: "MI004" },
    { _id: "MF007", functionName: "View Customer History", moduleId: "MI004" },
    { _id: "MF008", functionName: "Generate Sales Report", moduleId: "MI005" },
    { _id: "MF009", functionName: "Create User", moduleId: "MI006" },
    { _id: "MF010", functionName: "Assign Roles", moduleId: "MI006" },
  ];

  // Dummy data for demonstration
  const dummyRights = [
    {
      _id: "GRT001",
      groupId: "GR001",
      moduleId: "MI001",
      functionId: "MF001",
      groupName: "Administrators",
      moduleName: "Dashboard",
      functionName: "View Dashboard",
    },
    {
      _id: "GRT002",
      groupId: "GR001",
      moduleId: "MI002",
      functionId: "MF002",
      groupName: "Administrators",
      moduleName: "Inventory Management",
      functionName: "Add Product",
    },
    {
      _id: "GRT003",
      groupId: "GR001",
      moduleId: "MI002",
      functionId: "MF003",
      groupName: "Administrators",
      moduleName: "Inventory Management",
      functionName: "Update Stock",
    },
    {
      _id: "GRT004",
      groupId: "GR002",
      moduleId: "MI003",
      functionId: "MF004",
      groupName: "Managers",
      moduleName: "Sales & Invoicing",
      functionName: "Create Invoice",
    },
    {
      _id: "GRT005",
      groupId: "GR002",
      moduleId: "MI003",
      functionId: "MF005",
      groupName: "Managers",
      moduleName: "Sales & Invoicing",
      functionName: "Process Payment",
    },
    {
      _id: "GRT006",
      groupId: "GR003",
      moduleId: "MI004",
      functionId: "MF006",
      groupName: "Sales Staff",
      moduleName: "Customer Management",
      functionName: "Add Customer",
    },
    {
      _id: "GRT007",
      groupId: "GR004",
      moduleId: "MI002",
      functionId: "MF003",
      groupName: "Inventory Managers",
      moduleName: "Inventory Management",
      functionName: "Update Stock",
    },
    {
      _id: "GRT008",
      groupId: "GR005",
      moduleId: "MI003",
      functionId: "MF005",
      groupName: "Cashiers",
      moduleName: "Sales & Invoicing",
      functionName: "Process Payment",
    },
    {
      _id: "GRT009",
      groupId: "GR006",
      moduleId: "MI001",
      functionId: "MF001",
      groupName: "View Only",
      moduleName: "Dashboard",
      functionName: "View Dashboard",
    },
    {
      _id: "GRT010",
      groupId: "GR001",
      moduleId: "MI005",
      functionId: "MF008",
      groupName: "Administrators",
      moduleName: "Reporting & Analytics",
      functionName: "Generate Sales Report",
    },
  ];

  // Generate the next available right ID
  const generateNextRightId = () => {
    if (rightsList.length === 0) {
      return "GRT001";
    }

    // Extract all numeric parts from existing IDs
    const existingIds = rightsList
      .map((right) => right._id)
      .filter((id) => id && id.startsWith("GRT"))
      .map((id) => {
        const match = id.match(/^GRT(\d+)$/);
        return match ? parseInt(match[1]) : 0;
      })
      .filter((num) => num > 0);

    if (existingIds.length === 0) {
      return "GRT001";
    }

    // Find the highest number
    const maxNumber = Math.max(...existingIds);
    const nextNumber = maxNumber + 1;

    // Format with leading zeros (3 digits)
    return `GRT${nextNumber.toString().padStart(3, "0")}`;
  };

  // Get filtered functions based on selected module
  const getFilteredFunctions = () => {
    if (!selectedModuleId) return functions;
    return functions.filter((func) => func.moduleId === selectedModuleId);
  };

  // Get display names for IDs
  const getGroupNameById = (groupId) => {
    const group = groups.find((g) => g._id === groupId);
    return group ? group.groupName : "Unknown Group";
  };

  const getModuleNameById = (moduleId) => {
    const module = modules.find((m) => m._id === moduleId);
    return module ? module.moduleName : "Unknown Module";
  };

  const getFunctionNameById = (functionId) => {
    const func = functions.find((f) => f._id === functionId);
    return func ? func.functionName : "Unknown Function";
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

  // Fetch rights
  const fetchRights = useCallback(async () => {
    try {
      setLoading(true);
      // Try to fetch from API first
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/group-rights`
      );
      if (res.data && res.data.length > 0) {
        // Add display names for better UX
        const rightsWithNames = res.data.map((right) => ({
          ...right,
          groupName: getGroupNameById(right.groupId),
          moduleName: getModuleNameById(right.moduleId),
          functionName: getFunctionNameById(right.functionId),
        }));
        setRightsList(rightsWithNames);
      } else {
        // If no data from API, use dummy data
        setRightsList(dummyRights);
        console.log("Using dummy rights data");
      }
    } catch (error) {
      // If API fails, use dummy data for demonstration
      console.log("API failed, using dummy data");
      setRightsList(dummyRights);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  }, []);

  useEffect(() => {
    fetchRights();
  }, [fetchRights]);

  // Handlers
  const handleAddRight = () => {
    setIsSliderOpen(true);
    setIsEdit(false);
    setEditId(null);
    setSelectedGroupId("");
    setSelectedModuleId("");
    setSelectedFunctionId("");
  };

  // Save or Update Right
  const handleSave = async () => {
    if (!selectedGroupId || !selectedModuleId || !selectedFunctionId) {
      toast.error("All fields are required");
      return;
    }

    try {
      if (isEdit && editId) {
        // Update existing right
        const updatedRight = {
          _id: editId,
          groupId: selectedGroupId,
          moduleId: selectedModuleId,
          functionId: selectedFunctionId,
          groupName: getGroupNameById(selectedGroupId),
          moduleName: getModuleNameById(selectedModuleId),
          functionName: getFunctionNameById(selectedFunctionId),
        };

        setRightsList(
          rightsList.map((right) =>
            right._id === editId ? updatedRight : right
          )
        );
        toast.success("Group right updated successfully");
      } else {
        // Add new right with auto-generated ID
        const newId = generateNextRightId();
        const newRight = {
          _id: newId,
          groupId: selectedGroupId,
          moduleId: selectedModuleId,
          functionId: selectedFunctionId,
          groupName: getGroupNameById(selectedGroupId),
          moduleName: getModuleNameById(selectedModuleId),
          functionName: getFunctionNameById(selectedFunctionId),
        };

        setRightsList([newRight, ...rightsList]);
        toast.success("Group right added successfully");
      }

      reState();
    } catch (error) {
      console.error(error);
      toast.error(`❌ ${isEdit ? "Update" : "Add"} Group Right failed`);
    }
  };

  // Reset state
  const reState = () => {
    setIsSliderOpen(false);
    setIsEdit(false);
    setEditId(null);
    setSelectedGroupId("");
    setSelectedModuleId("");
    setSelectedFunctionId("");
  };

  // Edit Right
  const handleEdit = (right) => {
    setIsEdit(true);
    setEditId(right._id);
    setSelectedGroupId(right.groupId || "");
    setSelectedModuleId(right.moduleId || "");
    setSelectedFunctionId(right.functionId || "");
    setIsSliderOpen(true);
  };

  // Delete Right
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
            setRightsList(rightsList.filter((right) => right._id !== id));
            swalWithTailwindButtons.fire(
              "Deleted!",
              "Group right deleted successfully.",
              "success"
            );
          } catch (error) {
            console.error("Delete error:", error);
            swalWithTailwindButtons.fire(
              "Error!",
              "Failed to delete group right.",
              "error"
            );
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithTailwindButtons.fire(
            "Cancelled",
            "Group right is safe 🙂",
            "error"
          );
        }
      });
  };

  // Show loading spinner
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <div className="text-center flex flex-col items-center justify-center">
          <HashLoader height="150" width="150" radius={1} color="#84CF16" />
          <p className="mt-4 text-gray-600">Loading group rights...</p>
        </div>
      </div>
    );
  }

  // Calculate pagination values
  const totalItems = rightsList.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = rightsList.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <FiUsers className="text-newPrimary w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold text-newPrimary">Group Rights</h1>
            <p className="text-gray-500 text-sm">
              Manage permissions for user groups across modules and functions
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-newPrimary/80 transition-colors flex items-center gap-2"
            onClick={handleAddRight}
          >
            + Assign Right
          </button>
        </div>
      </div>

      {/* Rights Table */}
      <div className="rounded-xl shadow-lg p-6 border border-gray-200 w-full overflow-hidden bg-white">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="min-w-[1000px]">
            {/* Table Headers */}
            <div className="grid grid-cols-[0.5fr_1.2fr_1.5fr_2fr_0.8fr] gap-4 bg-gradient-to-r from-gray-50 to-gray-100 py-4 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200 rounded-t-lg">
              <div>Sr#</div>
              <div>Group Name</div>
              <div>Module Name</div>
              <div>Functionality Name</div>
              <div className="text-right">Actions</div>
            </div>

            {/* Rights List */}
            <div className="flex flex-col">
              {currentItems.map((right, index) => (
                <div
                  key={right._id}
                  className={`grid grid-cols-[0.5fr_1.2fr_1.5fr_2fr_0.8fr] items-center gap-4 px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-all duration-200 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                  }`}
                >
                  {/* Serial Number */}
                  <div className="text-sm font-medium text-gray-900">
                    {startIndex + index + 1}
                  </div>

                  {/* Group Name */}
                  <div className="text-sm text-gray-900 flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-100">
                      <FiUsers className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold">{right.groupName}</span>
                      <span className="text-xs text-gray-500 font-mono">
                        {right.groupId}
                      </span>
                    </div>
                  </div>

                  {/* Module Name */}
                  <div className="text-sm text-gray-900 flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-100">
                      <FiGrid className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold">{right.moduleName}</span>
                      <span className="text-xs text-gray-500 font-mono">
                        {right.moduleId}
                      </span>
                    </div>
                  </div>

                  {/* Functionality Name */}
                  <div className="text-sm text-gray-900 flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-100">
                      <FiCode className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold">
                        {right.functionName}
                      </span>
                      <span className="text-xs text-gray-500 font-mono">
                        {right.functionId}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 justify-end">
                    {/* EDIT ICON */}
                    <button
                      onClick={() => handleEdit(right)}
                      className="text-purple-600 hover:bg-purple-100 bg-purple-50 p-2 rounded-md transition"
                    >
                      <FiEdit3 className="w-4 h-4" />
                    </button>
                    {/* DELETE ICON */}
                    <button
                      onClick={() => handleDelete(right._id)}
                      className="text-red-600 hover:bg-red-100 bg-red-50 p-2 rounded-md transition"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        {/* <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
              <div className="text-sm text-blue-600 font-medium">
                Total Rights
              </div>
              <div className="text-2xl font-bold text-blue-700">
                {rightsList.length}
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
              <div className="text-sm text-green-600 font-medium">
                Groups with Rights
              </div>
              <div className="text-2xl font-bold text-green-700">
                {[...new Set(rightsList.map((r) => r.groupId))].length}
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
              <div className="text-sm text-purple-600 font-medium">
                Admin Rights
              </div>
              <div className="text-2xl font-bold text-purple-700">
                {rightsList.filter((r) => r.groupId === "GR001").length}
              </div>
            </div>
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
              <div className="text-sm text-orange-600 font-medium">
                Last Assigned
              </div>
              <div className="text-2xl font-bold text-orange-700">
                {rightsList.length > 0
                  ? new Date().toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  : "N/A"}
              </div>
            </div>
          </div>
        </div> */}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          compact={true}
        />
      </div>

      {/* Slider/Modal for Add/Edit */}
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
          className={`relative bg-white w-full max-w-[700px] rounded-3xl shadow-2xl transform transition-all duration-500 ease-out ${
            isSliderOpen ? "translate-y-0 scale-100" : "translate-y-8 scale-95"
          }`}
        >
          {/* Header with gradient */}
          <div className="sticky top-0 z-10 bg-gray-200 px-8 py-4 rounded-t-3xl">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                    <FiUsers className="w-6 h-6 text-newPrimary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-newPrimary">
                      {isEdit ? "Update Group Right" : "Assign New Right"}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {isEdit
                        ? "Update permission details"
                        : "Assign permission to a user group"}
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
              {/* Section 1: Right Information */}
              <div className="space-y-6 p-6 border border-gray-300/60 rounded-2xl bg-gray-100/40 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-2 border-b border-gray-300 pb-2">
                  <div className="w-1.5 h-6 bg-newPrimary rounded-full"></div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Permission Information
                  </h3>
                </div>

                <div className="space-y-6">
                  <div className="flex flex-col-2 gap-4">
                    {/* Right ID */}
                    <div className="space-y-2 w-full">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                        Right ID
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <FiUsers className="w-5 h-5 text-gray-400" />
                        </div>
                        {isEdit ? (
                          <input
                            type="text"
                            value={editId || ""}
                            readOnly
                            className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                            placeholder="Auto-generated ID"
                          />
                        ) : (
                          <div className="w-full pl-12 pr-4 py-3.5 border rounded-xl">
                            <div className="flex items-center justify-between">
                              <span className="font-mono font-semibold text-gray-400">
                                {generateNextRightId()}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Group Selection */}
                    <div className="space-y-2 w-full">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                        Group <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <FiUsers className="w-5 h-5 text-gray-400" />
                        </div>
                        <select
                          value={selectedGroupId}
                          required
                          onChange={(e) => setSelectedGroupId(e.target.value)}
                          className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary bg-white transition-all duration-200 hover:border-gray-400 appearance-none cursor-pointer"
                        >
                          <option value="">Select a user group</option>
                          {groups.map((group) => (
                            <option key={group._id} value={group._id}>
                              {group.groupName} ({group._id})
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
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
                  </div>

                  <div className="flex flex-col-2 gap-4">
                    {/* Module Selection */}
                    <div className="space-y-2 w-full">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                        Module <span className="text-red-500 text-lg">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <FiGrid className="w-5 h-5 text-gray-400" />
                        </div>
                        <select
                          value={selectedModuleId}
                          required
                          onChange={(e) => {
                            setSelectedModuleId(e.target.value);
                            setSelectedFunctionId(""); // Reset function when module changes
                          }}
                          className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary bg-white transition-all duration-200 hover:border-gray-400 appearance-none cursor-pointer"
                        >
                          <option value="">Select a module</option>
                          {modules.map((module) => (
                            <option key={module._id} value={module._id}>
                              {module.moduleName} ({module._id})
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
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

                    {/* Functionality Selection */}
                    <div className="space-y-2 w-full">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                        Functionality{" "}
                        <span className="text-red-500 text-lg">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <FiCode className="w-5 h-5 text-gray-400" />
                        </div>
                        <select
                          value={selectedFunctionId}
                          required
                          onChange={(e) =>
                            setSelectedFunctionId(e.target.value)
                          }
                          disabled={!selectedModuleId}
                          className={`w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary bg-white transition-all duration-200 hover:border-gray-400 appearance-none cursor-pointer ${
                            !selectedModuleId
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          <option value="">
                            {selectedModuleId
                              ? "Select a functionality"
                              : "Select a module first"}
                          </option>
                          {getFilteredFunctions().map((func) => (
                            <option key={func._id} value={func._id}>
                              {func.functionName} ({func._id})
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
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
                  </div>
                </div>
              </div>

              {/* Summary Preview */}
              {/* {selectedGroupId && selectedModuleId && selectedFunctionId && (
                <div className="space-y-6 p-6 border border-gray-300/60 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Permission Summary
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-white/80 p-4 rounded-xl border border-blue-100">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                          <FiUsers className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Group</p>
                          <p className="font-semibold text-gray-900">
                            {getGroupNameById(selectedGroupId)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white/80 p-4 rounded-xl border border-blue-100">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                          <FiGrid className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Module</p>
                          <p className="font-semibold text-gray-900">
                            {getModuleNameById(selectedModuleId)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white/80 p-4 rounded-xl border border-blue-100">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                          <FiCode className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Functionality</p>
                          <p className="font-semibold text-gray-900">
                            {getFunctionNameById(selectedFunctionId)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )} */}

              {/* Form Actions */}
              <div className="flex gap-4">
                <button
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-newPrimary to-newPrimary/90 text-white font-semibold rounded-xl hover:from-newPrimary/90 hover:to-newPrimary transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                  onClick={handleSave}
                >
                  <div className="flex items-center justify-center gap-3">
                    {isEdit ? (
                      <>
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Update Right
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        Assign Right
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

export default GroupRights;
