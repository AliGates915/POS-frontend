import React, { useState, useEffect, useRef, useCallback } from "react";
import { HashLoader } from "react-spinners";
import gsap from "gsap";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import axios from "axios";
import { FiEdit3, FiTrash2, FiGrid } from "react-icons/fi";
import { MdDescription } from "react-icons/md";
import Pagination from "../pagination/Pagination";

const Modules = () => {
  // State declarations
  const [moduleList, setModuleList] = useState([]);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [moduleName, setModuleName] = useState("");
  const [description, setDescription] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const sliderRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate pagination values
  const totalItems = moduleList.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = moduleList.slice(startIndex, startIndex + itemsPerPage);

  // Dummy data for demonstration
  const dummyModules = [
    {
      _id: "MI001",
      moduleName: "Dashboard",
      description: "Main dashboard with analytics and overview widgets",
    },
    {
      _id: "MI002",
      moduleName: "Inventory Management",
      description: "Track, manage, and optimize product inventory",
    },
    {
      _id: "MI003",
      moduleName: "Sales & Invoicing",
      description: "Process sales transactions and generate invoices",
    },
    {
      _id: "MI004",
      moduleName: "Customer Management",
      description: "Manage customer profiles and relationships",
    },
    {
      _id: "MI005",
      moduleName: "Reporting & Analytics",
      description: "Generate business reports and analytics",
    },
    {
      _id: "MI006",
      moduleName: "User Management",
      description: "Manage system users, roles, and permissions",
    },
    {
      _id: "MI007",
      moduleName: "Supplier Management",
      description: "Manage supplier information and orders",
    },
    {
      _id: "MI008",
      moduleName: "Expense Tracking",
      description: "Track and categorize business expenses",
    },
    {
      _id: "MI009",
      moduleName: "Purchase Orders",
      description: "Create and manage purchase orders",
    },
    {
      _id: "MI0010",
      moduleName: "Product Catalog",
      description: "Manage product listings and categories",
    },
    {
      _id: "MI0011",
      moduleName: "Point of Sale",
      description: "POS interface for retail transactions",
    },
    {
      _id: "MI0012",
      moduleName: "Settings",
      description: "System configuration and settings",
    },
  ];

  // Generate the next available module ID
  const generateNextModuleId = () => {
    if (moduleList.length === 0) {
      return "MI001";
    }

    // Extract all numeric parts from existing IDs
    const existingIds = moduleList
      .map((module) => module._id)
      .filter((id) => id && id.startsWith("MI"))
      .map((id) => {
        const match = id.match(/^MI(\d+)$/);
        return match ? parseInt(match[1]) : 0;
      })
      .filter((num) => num > 0);

    if (existingIds.length === 0) {
      return "MI001";
    }

    // Find the highest number
    const maxNumber = Math.max(...existingIds);
    const nextNumber = maxNumber + 1;

    // Format with leading zeros (3 digits)
    return `MI${nextNumber.toString().padStart(3, "0")}`;
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

  // Fetch modules
  const fetchModules = useCallback(async () => {
    try {
      setLoading(true);
      // Try to fetch from API first
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/modules`
      );
      if (res.data && res.data.length > 0) {
        setModuleList(res.data);
      } else {
        // If no data from API, use dummy data
        setModuleList(dummyModules);
        console.log("Using dummy modules data");
      }
    } catch (error) {
      // If API fails, use dummy data for demonstration
      console.log("API failed, using dummy data");
      setModuleList(dummyModules);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  }, []);

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  // Handlers
  const handleAddModule = () => {
    setIsSliderOpen(true);
    setIsEdit(false);
    setEditId(null);
    setModuleName("");
    setDescription("");
  };

  // Save or Update Module
  const handleSave = async () => {
    if (!moduleName) {
      toast.error("Module Name is required");
      return;
    }

    const moduleData = {
      moduleName,
      description,
    };

    try {
      const headers = {
        Authorization: `Bearer ${userInfo?.token || "dummy-token"}`,
        "Content-Type": "application/json",
      };

      if (isEdit && editId) {
        // For dummy data, update locally
        const updatedModule = {
          _id: editId,
          ...moduleData,
        };

        setModuleList(
          moduleList.map((module) =>
            module._id === editId ? updatedModule : module
          )
        );
        toast.success("Module updated successfully");
      } else {
        // Add new module with auto-generated ID
        const newId = generateNextModuleId();
        const newModule = {
          _id: newId,
          moduleName,
          description,
        };

        setModuleList([newModule, ...moduleList]);
        toast.success("Module added successfully");
      }

      reState();
    } catch (error) {
      console.error(error);
      toast.error(`❌ ${isEdit ? "Update" : "Add"} Module failed`);
    }
  };

  // Reset state
  const reState = () => {
    setIsSliderOpen(false);
    setIsEdit(false);
    setEditId(null);
    setModuleName("");
    setDescription("");
  };

  // Edit Module
  const handleEdit = (module) => {
    setIsEdit(true);
    setEditId(module._id);
    setModuleName(module.moduleName || "");
    setDescription(module.description || "");
    setIsSliderOpen(true);
  };

  // Delete Module
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
            setModuleList(moduleList.filter((module) => module._id !== id));
            swalWithTailwindButtons.fire(
              "Deleted!",
              "Module deleted successfully.",
              "success"
            );
          } catch (error) {
            console.error("Delete error:", error);
            swalWithTailwindButtons.fire(
              "Error!",
              "Failed to delete module.",
              "error"
            );
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithTailwindButtons.fire(
            "Cancelled",
            "Module is safe 🙂",
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
          <p className="mt-4 text-gray-600">Loading modules...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <FiGrid className="text-newPrimary w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold text-newPrimary">Modules</h1>
            <p className="text-gray-500 text-sm">
              Manage your system modules and their descriptions
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-newPrimary/80 transition-colors flex items-center gap-2"
            onClick={handleAddModule}
          >
            + Add Module
          </button>
        </div>
      </div>

      {/* Modules Table */}
      <div className="rounded-xl shadow-lg p-6 border border-gray-200 w-full overflow-hidden bg-white">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="min-w-[800px]">
            {/* Table Headers */}
            <div className="grid grid-cols-[0.5fr_1.5fr_2fr_0.8fr] gap-4 bg-gradient-to-r from-gray-50 to-gray-100 py-4 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200 rounded-t-lg">
              <div>Sr#</div>
              <div>Module Name</div>
              <div>Description</div>
              <div className="text-right">Actions</div>
            </div>

            {/* Modules List */}
            <div className="flex flex-col">
              {currentItems.map((module, index) => (
                <div
                  key={module._id}
                  className={`grid grid-cols-[0.5fr_1.5fr_2fr_0.8fr] items-center gap-4 px-6 py-4 border-b border-gray-100 group-hover:text-newPrimary group hover:bg-gray-50 transition-all duration-200 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                  }`}
                >
                  {/* Serial Number */}
                  <div className="text-sm font-medium text-gray-900">
                    {startIndex + index + 1}
                  </div>

                  {/* Module Name */}
                  <div className="text-sm font-semibold text-gray-900 flex items-center gap-3 group">
                    <div className="p-2 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200 transition-all duration-300">
                      <FiGrid className="w-5 h-5 text-newPrimary transition-colors duration-300" />
                    </div>
                    <span className="text-gray-900 font-semibold group-hover:text-newPrimary transition-colors duration-300">
                      {module.moduleName}
                    </span>
                  </div>

                  {/* Description */}
                  <div className="text-sm text-gray-600">
                    <div className="flex items-start gap-2">
                      <MdDescription className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-2" title={module.description}>
                        {module.description || "No description provided"}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 justify-end">
                    {/* EDIT ICON */}
                    <button
                      onClick={() => handleEdit(module)}
                      className="text-purple-600 hover:bg-purple-100 bg-purple-50 p-2 rounded-md transition"
                    >
                      <FiEdit3 className="w-4 h-4" />
                    </button>
                    {/* DELETE ICON */}
                    <button
                      onClick={() => handleDelete(module._id)}
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
                Total Modules
              </div>
              <div className="text-2xl font-bold text-blue-700">
                {moduleList.length}
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
              <div className="text-sm text-green-600 font-medium">Active</div>
              <div className="text-2xl font-bold text-green-700">
                {moduleList.length}
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
              <div className="text-sm text-purple-600 font-medium">
                Core Modules
              </div>
              <div className="text-2xl font-bold text-purple-700">
                {
                  moduleList.filter((m) =>
                    [
                      "Dashboard",
                      "Inventory Management",
                      "Sales & Invoicing",
                      "Customer Management",
                    ].includes(m.moduleName)
                  ).length
                }
              </div>
            </div>
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
              <div className="text-sm text-orange-600 font-medium">
                Last Added
              </div>
              <div className="text-2xl font-bold text-orange-700">
                {moduleList.length > 0
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
                    <FiGrid className="w-6 h-6 text-newPrimary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-newPrimary">
                      {isEdit ? "Update Module" : "Add New Module"}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {isEdit
                        ? "Update module details"
                        : "Fill in the module information below"}
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
              {/* Section 1: Module Information */}
              <div className="space-y-6 p-6 border border-gray-300/60 rounded-2xl bg-gray-100/40 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-2 border-b border-gray-300 pb-2">
                  <div className="w-1.5 h-6 bg-newPrimary rounded-full"></div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Module Information
                  </h3>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      Module ID
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
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
                            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                          />
                        </svg>
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
                            <span className="font-semibold text-gray-400">
                              {generateNextModuleId()}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Module Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      Module Name{" "}
                      <span className="text-red-500 text-lg">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FiGrid className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={moduleName}
                        required
                        onChange={(e) => setModuleName(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary bg-white transition-all duration-200 hover:border-gray-400 placeholder:text-gray-400"
                        placeholder="Enter module name"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <div className="relative">
                      <div className="absolute top-3 left-4 pointer-events-none">
                        <MdDescription className="w-5 h-5 text-gray-400" />
                      </div>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary bg-white transition-all duration-200 hover:border-gray-400 resize-none min-h-[120px]"
                        rows="4"
                        placeholder="Enter module description (what this module does, its purpose, features, etc.)"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Describe the purpose and functionality of this module
                    </p>
                  </div>
                </div>
              </div>

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
                        Update Module
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
                        Save Module
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

export default Modules;
