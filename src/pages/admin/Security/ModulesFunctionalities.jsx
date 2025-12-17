// import React, { useState, useCallback, useEffect, useRef } from "react";
// import gsap from "gsap";
// import { toast } from "react-toastify";
// import axios from "axios";
// import { HashLoader } from "react-spinners";
// import Swal from "sweetalert2";



// const ModulesFunctionalities = () => {
//   const [functionalityList, setFunctionalityList] = useState([]);
//   const [modules, setModules] = useState([]);
//   const [isSliderOpen, setIsSliderOpen] = useState(false);
//   const [moduleId, setModuleId] = useState(""); // Use moduleId for selection
//   const [name, setName] = useState("");
//   const [isEdit, setIsEdit] = useState(false);
//   const [editId, setEditId] = useState(null);
//   const [loading, setLoading] = useState(false); // Initialize as false
//   const sliderRef = useRef(null);

//   const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
//   const headers = {
//     Authorization: `Bearer ${userInfo?.token || ""}`,
//     "Content-Type": "application/json",
//   };

//   const handleAddFunctionality = () => {
//     setIsSliderOpen(true);
//   };

//   // GSAP Animation for Slider
//   useEffect(() => {
//     if (isSliderOpen) {
//       gsap.fromTo(
//         sliderRef.current,
//         { x: "100%", opacity: 0 },
//         { x: "0%", opacity: 1, duration: 0.5, ease: "power2.out" }
//       );
//     } else {
//       gsap.to(sliderRef.current, {
//         x: "100%",
//         opacity: 0,
//         duration: 0.5,
//         ease: "power2.in",
//         onComplete: () => {
//           if (sliderRef.current) {
//             sliderRef.current.style.display = "none";
//           }
//         },
//       });
//     }
//   }, [isSliderOpen]);

//   // Fetch Functionality Data
//   const fetchFunctionalityData = useCallback(async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/functionality`);
//       if (!response.ok) throw new Error("Failed to fetch functionalities");
//       const result = await response.json();
//       console.log("Functionalities Response:", result);

//       setFunctionalityList(result);
//     } catch (error) {
//       console.error("Error fetching functionality data:", error);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // Fetch Module Data
//   const fetchModuleData = useCallback(async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/modules`);


//       if (!response.ok) throw new Error("Failed to fetch modules");
//       const result = await response.json();
//       console.log("Modules Response:", result);
//       setModules(result);
//     } catch (error) {
//       console.error("Error fetching module data:", error);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // Fetch data on mount
//   useEffect(() => {
//     fetchModuleData();
//     fetchFunctionalityData();
//   }, [fetchModuleData, fetchFunctionalityData]);

//   // Save Functionality Data
//   const handleSave = async () => {

//     console.log("Module Id", moduleId);
//     console.log("Functionality Name", name);

//     if (!moduleId || !name) {
//       toast.error("Please select a module and enter a functionality");
//       return;
//     }

//     // const formData = new FormData();
//     // formData.append("moduleId", moduleId);
//     // formData.append("name", name);


//     try {
//       const config = {
//         headers: {
//           Authorization: `Bearer ${userInfo?.token || ""}`,
//           // "Content-Type": "multipart/form-data",
//         },
//       };

//       if (isEdit && editId) {
//         await axios.put(
//           `${import.meta.env.VITE_API_BASE_URL}/functionality/${editId}`,
//           { moduleId, name },
//           config
//         );
//         toast.success("✅ Functionality updated successfully");
//       } else {
//         await axios.post(
//           `${import.meta.env.VITE_API_BASE_URL}/functionality`,
//           { moduleId, name },
//           config
//         );
//         toast.success("✅ Functionality added successfully");
//       }

//       // Reset fields
//       setEditId(null);
//       setIsEdit(false);
//       setIsSliderOpen(false);
//       setModuleId("");
//       setName("");
//       fetchFunctionalityData(); // Refresh list
//     } catch (error) {
//       console.error(error);
//       toast.error(`❌ ${isEdit ? "Update" : "Add"} functionality failed`);
//     }
//   };

//   // Edit Functionality
//   const handleEdit = (func) => {
//     setIsEdit(true);
//     setEditId(func._id);
//     setModuleId(func.moduleId || "");
//     setName(func.name || "");
//     setIsSliderOpen(true);
//   };

//   // Delete Functionality
//   const handleDelete = async (id) => {
//     const swalWithTailwindButtons = Swal.mixin({
//       customClass: {
//         confirmButton: "bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300",
//         cancelButton: "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300",
//       },
//       buttonsStyling: false,
//     });

//     swalWithTailwindButtons
//       .fire({
//         title: "Are you sure?",
//         text: "You won't be able to revert this!",
//         icon: "warning",
//         showCancelButton: true,
//         confirmButtonText: "Yes, delete it!",
//         cancelButtonText: "No, cancel!",
//         reverseButtons: true,
//       })
//       .then(async (result) => {
//         if (result.isConfirmed) {
//           try {
//             if (!userInfo?.token) {
//               toast.error("Authorization token missing!");
//               return;
//             }

//             await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/functionality/${id}`, {
//               headers: {
//                 Authorization: `Bearer ${userInfo.token}`,
//               },
//             });

//             setFunctionalityList(functionalityList.filter((p) => p._id !== id));
//             swalWithTailwindButtons.fire("Deleted!", "Functionality deleted successfully.", "success");
//           } catch (error) {
//             console.error("Delete error:", error);
//             swalWithTailwindButtons.fire("Error!", "Failed to delete Functionality.", "error");
//           }
//         } else if (result.dismiss === Swal.DismissReason.cancel) {
//           swalWithTailwindButtons.fire("Cancelled", "Functionality is safe 🙂", "info");
//         }
//       });
//   };

//   // Show loading spinner
//   if (loading) {
//     return (
//       <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <HashLoader height="150" width="150" radius={1} color="#84CF16" />
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-2xl font-bold text-newPrimary">Functionality List</h1>
//           <p className="text-gray-500 text-sm">Functionality Management Dashboard</p>
//         </div>
//         <button
//           className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-primaryDark transition-colors duration-200"
//           onClick={handleAddFunctionality}
//         >
//           + Add Functionality
//         </button>
//       </div>

//       {/* Functionality Table */}
//       <div className="rounded-xl shadow p-6 border border-gray-100 w-full overflow-hidden">
//         <div className="overflow-x-auto scrollbar-hide">
//           <div className="w-full">
//             {/* Table Headers */}
//             <div className="hidden lg:grid grid-cols-3 gap-4 bg-gray-50 py-3 px-6 text-xs font-medium text-gray-500 uppercase rounded-lg">
//               <div>Module</div>
//               <div>Functionality</div>
//               {userInfo?.isAdmin && <div className="text-right">Actions</div>}
//             </div>

//             {/* Functionality Table */}
//             <div className="mt-4 flex flex-col gap-[14px] pb-14">
//               {functionalityList.map((func) => (
//                 <div
//                   key={func._id} // Use _id for better key stability
//                   className="grid grid-cols-3 items-center gap-4 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100"
//                 >
//                   <div className="text-sm font-medium text-gray-900">{func?.moduleId?.moduleName}</div>
//                   <div className="text-sm text-gray-500">{func.name}</div>
//                   {userInfo?.isAdmin && (
//                     <div className="text-right relative group">
//                       <button className="text-gray-400 hover:text-gray-600 text-xl">⋯</button>
//                       <div className="absolute right-0 top-6 w-28 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-300 z-50 flex flex-col justify-between">
//                         <button
//                           onClick={() => handleEdit(func)}
//                           className="w-full text-left px-4 py-2 text-sm hover:bg-blue-100 text-blue-600 flex items-center gap-2"
//                         >
//                           Edit
//                         </button>
//                         <button
//                           onClick={() => handleDelete(func._id)}
//                           className="w-full text-left px-4 py-2 text-sm hover:bg-red-100 text-red-500 flex items-center gap-2"
//                         >
//                           Delete
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Right-Side Slider */}
//       {isSliderOpen && (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50">
//           <div
//             ref={sliderRef}
//             className="fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-xl overflow-y-auto"
//             style={{ display: "block" }}
//           >
//             <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
//               <h2 className="text-xl font-bold text-newPrimary">{isEdit ? "Edit Functionality" : "Add Functionality"}</h2>
//               <button
//                 className="w-6 h-6 text-white rounded-full flex justify-center items-center hover:text-gray-400 text-xl bg-newPrimary"
//                 onClick={() => setIsSliderOpen(false)}
//               >
//                 &times;
//               </button>
//             </div>
//             <div className="p-6 space-y-6">
//               <div className="border rounded-lg p-4">
//                 <div className="grid grid-cols-1 gap-4">
//                   <div>
//                     <label className="block text-gray-700 mb-1">Module</label>
//                     <select
//                       value={moduleId}
//                       onChange={(e) => setModuleId(e.target.value)}
//                       className="w-full p-2 border rounded focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary outline-none transition-all"
//                     >
//                       <option value="">Select Module</option>
//                       {modules.map((module) => (
//                         <option key={module._id} value={module._id}>
//                           {module.moduleName}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-gray-700 mb-1">Functionality</label>
//                     <input
//                       type="text"
//                       value={name}
//                       onChange={(e) => setName(e.target.value)}
//                       className="w-full p-2 border rounded focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary outline-none transition-all"
//                       placeholder="Enter functionality"
//                     />
//                   </div>
//                 </div>
//               </div>
//               <div className="flex justify-end gap-3 pt-4">
//                 <button
//                   className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
//                   onClick={() => setIsSliderOpen(false)}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   className="bg-newPrimary text-white px-6 py-2 rounded-lg hover:bg-primaryDark transition-colors duration-200"
//                   onClick={handleSave}
//                 >
//                   {isEdit ? "Update Functionality" : "Save Functionality"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ModulesFunctionalities;

import React, { useState, useEffect, useRef, useCallback } from "react";
import { HashLoader } from "react-spinners";
import gsap from "gsap";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import axios from "axios";
import { FiEdit3, FiTrash2, FiGrid, FiCode } from "react-icons/fi";
import { MdDescription } from "react-icons/md";
import Pagination from "../pagination/Pagination";

const ModuleFunctions = () => {
  // State declarations
  const [functionList, setFunctionList] = useState([]);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [functionName, setFunctionName] = useState("");
  const [selectedModuleId, setSelectedModuleId] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const sliderRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modules data (you might want to fetch this from API)
  const modules = [
    { _id: "MI001", moduleName: "Dashboard" },
    { _id: "MI002", moduleName: "Inventory Management" },
    { _id: "MI003", moduleName: "Sales & Invoicing" },
    { _id: "MI004", moduleName: "Customer Management" },
    { _id: "MI005", moduleName: "Reporting & Analytics" },
    { _id: "MI006", moduleName: "User Management" },
    { _id: "MI007", moduleName: "Supplier Management" },
    { _id: "MI008", moduleName: "Expense Tracking" },
    { _id: "MI009", moduleName: "Purchase Orders" },
    { _id: "MI010", moduleName: "Product Catalog" },
    { _id: "MI011", moduleName: "Point of Sale" },
    { _id: "MI012", moduleName: "Settings" },
  ];

  // Dummy data for demonstration
  const dummyFunctions = [
    {
      _id: "MF001",
      moduleId: "MI001",
      functionName: "View Dashboard",
      moduleName: "Dashboard",
    },
    {
      _id: "MF002",
      moduleId: "MI002",
      functionName: "Add Product",
      moduleName: "Inventory Management",
    },
    {
      _id: "MF003",
      moduleId: "MI002",
      functionName: "Update Stock",
      moduleName: "Inventory Management",
    },
    {
      _id: "MF004",
      moduleId: "MI003",
      functionName: "Create Invoice",
      moduleName: "Sales & Invoicing",
    },
    {
      _id: "MF005",
      moduleId: "MI003",
      functionName: "Process Payment",
      moduleName: "Sales & Invoicing",
    },
    {
      _id: "MF006",
      moduleId: "MI004",
      functionName: "Add Customer",
      moduleName: "Customer Management",
    },
    {
      _id: "MF007",
      moduleId: "MI004",
      functionName: "View Customer History",
      moduleName: "Customer Management",
    },
    {
      _id: "MF008",
      moduleId: "MI005",
      functionName: "Generate Sales Report",
      moduleName: "Reporting & Analytics",
    },
    {
      _id: "MF009",
      moduleId: "MI006",
      functionName: "Create User",
      moduleName: "User Management",
    },
    {
      _id: "MF010",
      moduleId: "MI006",
      functionName: "Assign Roles",
      moduleName: "User Management",
    },
    {
      _id: "MF011",
      moduleId: "MI007",
      functionName: "Add Supplier",
      moduleName: "Supplier Management",
    },
    {
      _id: "MF012",
      moduleId: "MI011",
      functionName: "Scan Barcode",
      moduleName: "Point of Sale",
    },
    {
      _id: "MF013",
      moduleId: "MI011",
      functionName: "Apply Discount",
      moduleName: "Point of Sale",
    },
    {
      _id: "MF014",
      moduleId: "MI011",
      functionName: "Print Receipt",
      moduleName: "Point of Sale",
    },
  ];

  // Generate the next available function ID
  const generateNextFunctionId = () => {
    if (functionList.length === 0) {
      return "MF001";
    }

    // Extract all numeric parts from existing IDs
    const existingIds = functionList
      .map((func) => func._id)
      .filter((id) => id && id.startsWith("MF"))
      .map((id) => {
        const match = id.match(/^MF(\d+)$/);
        return match ? parseInt(match[1]) : 0;
      })
      .filter((num) => num > 0);

    if (existingIds.length === 0) {
      return "MF001";
    }

    // Find the highest number
    const maxNumber = Math.max(...existingIds);
    const nextNumber = maxNumber + 1;

    // Format with leading zeros (3 digits)
    return `MF${nextNumber.toString().padStart(3, "0")}`;
  };

  // Get module name by ID
  const getModuleNameById = (moduleId) => {
    const module = modules.find((m) => m._id === moduleId);
    return module ? module.moduleName : "Unknown Module";
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

  // Fetch functions
  const fetchFunctions = useCallback(async () => {
    try {
      setLoading(true);
      // Try to fetch from API first
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/module-functions`
      );
      if (res.data && res.data.length > 0) {
        // Add module names for display
        const functionsWithModuleNames = res.data.map((func) => ({
          ...func,
          moduleName: getModuleNameById(func.moduleId),
        }));
        setFunctionList(functionsWithModuleNames);
      } else {
        // If no data from API, use dummy data
        setFunctionList(dummyFunctions);
        console.log("Using dummy functions data");
      }
    } catch (error) {
      // If API fails, use dummy data for demonstration
      console.log("API failed, using dummy data");
      setFunctionList(dummyFunctions);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  }, []);

  useEffect(() => {
    fetchFunctions();
  }, [fetchFunctions]);

  // Handlers
  const handleAddFunction = () => {
    setIsSliderOpen(true);
    setIsEdit(false);
    setEditId(null);
    setFunctionName("");
    setSelectedModuleId("");
  };

  // Save or Update Function
  const handleSave = async () => {
    if (!functionName || !selectedModuleId) {
      toast.error("Function Name and Module are required");
      return;
    }

    try {
      if (isEdit && editId) {
        // Update existing function
        const updatedFunction = {
          _id: editId,
          moduleId: selectedModuleId,
          functionName,
          moduleName: getModuleNameById(selectedModuleId),
        };

        setFunctionList(
          functionList.map((func) =>
            func._id === editId ? updatedFunction : func
          )
        );
        toast.success("Function updated successfully");
      } else {
        // Add new function with auto-generated ID
        const newId = generateNextFunctionId();
        const newFunction = {
          _id: newId,
          moduleId: selectedModuleId,
          functionName,
          moduleName: getModuleNameById(selectedModuleId),
        };

        setFunctionList([newFunction, ...functionList]);
        toast.success("Function added successfully");
      }

      reState();
    } catch (error) {
      console.error(error);
      toast.error(`❌ ${isEdit ? "Update" : "Add"} Function failed`);
    }
  };

  // Reset state
  const reState = () => {
    setIsSliderOpen(false);
    setIsEdit(false);
    setEditId(null);
    setFunctionName("");
    setSelectedModuleId("");
  };

  // Edit Function
  const handleEdit = (func) => {
    setIsEdit(true);
    setEditId(func._id);
    setFunctionName(func.functionName || "");
    setSelectedModuleId(func.moduleId || "");
    setIsSliderOpen(true);
  };

  // Delete Function
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
            setFunctionList(functionList.filter((func) => func._id !== id));
            swalWithTailwindButtons.fire(
              "Deleted!",
              "Function deleted successfully.",
              "success"
            );
          } catch (error) {
            console.error("Delete error:", error);
            swalWithTailwindButtons.fire(
              "Error!",
              "Failed to delete function.",
              "error"
            );
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithTailwindButtons.fire(
            "Cancelled",
            "Function is safe 🙂",
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
          <p className="mt-4 text-gray-600">Loading functions...</p>
        </div>
      </div>
    );
  }

  // Calculate pagination values
  const totalItems = functionList.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = functionList.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <FiCode className="text-newPrimary w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold text-newPrimary">
              Module Functions
            </h1>
            <p className="text-gray-500 text-sm">
              Manage functions and permissions for each module
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-newPrimary/80 transition-colors flex items-center gap-2"
            onClick={handleAddFunction}
          >
            + Add Function
          </button>
        </div>
      </div>

      {/* Functions Table */}
      <div className="rounded-xl shadow-lg p-6 border border-gray-200 w-full overflow-hidden bg-white">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="min-w-[900px]">
            {/* Table Headers */}
            <div className="grid grid-cols-[0.5fr_1fr_1.5fr_1.5fr_0.8fr] gap-4 bg-gradient-to-r from-gray-50 to-gray-100 py-4 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200 rounded-t-lg">
              <div>Sr#</div>
              <div>Function ID</div>
              <div>Module</div>
              <div>Function Name</div>
              <div className="text-right">Actions</div>
            </div>

            {/* Functions List */}
            <div className="flex flex-col">
              {currentItems.map((func, index) => (
                <div
                  key={func._id}
                  className={`grid grid-cols-[0.5fr_1fr_1.5fr_1.5fr_0.8fr] items-center gap-4 px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-all duration-200 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                  }`}
                >
                  {/* Serial Number */}
                  <div className="text-sm font-medium text-gray-900">
                    {startIndex + index + 1}
                  </div>

                  {/* Function ID */}
                  <div className="text-sm">
                    <span className="font-mono bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200">
                      {func._id}
                    </span>
                  </div>

                  {/* Module */}
                  <div className="text-sm font-semibold text-gray-900 flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200">
                      <FiGrid className="w-5 h-5 text-newPrimary" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-900 font-semibold">
                        {func.moduleName}
                      </span>
                      <span className="text-xs text-gray-500 font-mono">
                        {func.moduleId}
                      </span>
                    </div>
                  </div>

                  {/* Function Name */}
                  <div className="text-sm text-gray-900 flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-100">
                      <FiCode className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="font-medium">{func.functionName}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 justify-end">
                    {/* EDIT ICON */}
                    <button
                      onClick={() => handleEdit(func)}
                      className="text-purple-600 hover:bg-purple-100 bg-purple-50 p-2 rounded-md transition"
                    >
                      <FiEdit3 className="w-4 h-4" />
                    </button>
                    {/* DELETE ICON */}
                    <button
                      onClick={() => handleDelete(func._id)}
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
                Total Functions
              </div>
              <div className="text-2xl font-bold text-blue-700">
                {functionList.length}
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
              <div className="text-sm text-green-600 font-medium">Modules</div>
              <div className="text-2xl font-bold text-green-700">
                {[...new Set(functionList.map((f) => f.moduleId))].length}
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
              <div className="text-sm text-purple-600 font-medium">
                POS Functions
              </div>
              <div className="text-2xl font-bold text-purple-700">
                {
                  functionList.filter((f) =>
                    f.functionName.includes("POS") ||
                    f.moduleName.includes("Point of Sale")
                  ).length
                }
              </div>
            </div>
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
              <div className="text-sm text-orange-600 font-medium">
                Last Added
              </div>
              <div className="text-2xl font-bold text-orange-700">
                {functionList.length > 0
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
                    <FiCode className="w-6 h-6 text-newPrimary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-newPrimary">
                      {isEdit ? "Update Function" : "Add New Function"}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {isEdit
                        ? "Update function details"
                        : "Fill in the function information below"}
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
              {/* Section 1: Function Information */}
              <div className="space-y-6 p-6 border border-gray-300/60 rounded-2xl bg-gray-100/40 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-2 border-b border-gray-300 pb-2">
                  <div className="w-1.5 h-6 bg-newPrimary rounded-full"></div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Function Information
                  </h3>
                </div>

                <div className="space-y-6">
                  {/* Function ID */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      Function ID
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FiCode className="w-5 h-5 text-gray-400" />
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
                              {generateNextFunctionId()}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Module Selection */}
                  <div className="space-y-2">
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
                        onChange={(e) => setSelectedModuleId(e.target.value)}
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

                  {/* Function Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      Function Name{" "}
                      <span className="text-red-500 text-lg">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FiCode className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={functionName}
                        required
                        onChange={(e) => setFunctionName(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary bg-white transition-all duration-200 hover:border-gray-400 placeholder:text-gray-400"
                        placeholder="Enter function name (e.g., Create Invoice, View Report)"
                      />
                    </div>
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
                        Update Function
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
                        Save Function
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

export default ModuleFunctions;