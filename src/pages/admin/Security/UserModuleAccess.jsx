// import React, { useState, useCallback, useEffect, useRef } from "react";
// import gsap from "gsap";
// import { toast } from "react-toastify";
// import axios from "axios";
// import { HashLoader } from "react-spinners";
// import Swal from "sweetalert2";
// import { FaEdit, FaTrash, FaCog, FaTimes } from "react-icons/fa";

// const AssignRights = () => {
//   const [moduleList, setModuleList] = useState([]);
//   const [assignRightsList, setAssignRightsList] = useState([]);
//   const [groups, setGroups] = useState([]);
//   const [functionalityList, setFunctionalityList] = useState([]);
//   const [functionalityModuleList, setFunctionalityModuleList] = useState([]);
//   const [isSliderOpen, setIsSliderOpen] = useState(false);
//   const [groupId, setGroupId] = useState("");
//   const [moduleId, setModuleId] = useState("");
//   const [selectedFunctionalities, setSelectedFunctionalities] = useState([]); // Stores names for UI
//   const [isEdit, setIsEdit] = useState(false);
//   const [editId, setEditId] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const sliderRef = useRef(null);

//   const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
//   const headers = {
//     Authorization: `Bearer ${userInfo?.token || ""}`,
//     "Content-Type": "application/json",
//   };

//   const handleAddAssignRights = () => {
//     setIsSliderOpen(true);
//   };

//   // GSAP Animation for Slider
//   useEffect(() => {
//     if (isSliderOpen) {
//       sliderRef.current.style.display = "block";
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

//   // Fetch Assign Rights Data
//   const fetchRights = useCallback(async () => {
//     try {
//       setLoading(true);
//       const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/rights`, { headers });
//       if (!res.ok) throw new Error("Failed to fetch rights");
//       const result = await res.json();
//       console.log("Fetched Rights:", result);
//       setAssignRightsList(result);
//     } catch (error) {
//       console.error("Error fetching rights:", error);
//       toast.error("Failed to fetch rights");
//       setAssignRightsList([]);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // Fetch Group Data
//   const fetchGroupData = useCallback(async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/groups`, { headers });
//       if (!response.ok) throw new Error("Failed to fetch groups");
//       const result = await response.json();
//       setGroups(result);
//     } catch (error) {
//       console.error("Error fetching group data:", error);
//       toast.error("Failed to fetch groups");
//       setGroups([]);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // Fetch Functionality Data
//   const fetchFunctionalityData = useCallback(async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/functionality`, { headers });
//       if (!response.ok) throw new Error("Failed to fetch functionalities");
//       const result = await response.json();
//       console.log("Functionalities Response:", result);
//       setFunctionalityList(result);
//     } catch (error) {
//       console.error("Error fetching functionality data:", error);
//       toast.error("Failed to fetch functionalities");
//       setFunctionalityList([]);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // Fetch Module Data
//   const fetchModuleData = useCallback(async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/modules`, { headers });
//       if (!response.ok) throw new Error("Failed to fetch modules");
//       const result = await response.json();
//       console.log("Modules:", result);
//       setModuleList(result);

//     } catch (error) {
//       console.error("Error fetching module data:", error);
//       toast.error("Failed to fetch modules");
//       setModuleList([]);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const selectModule = (e) => {
//     const id = e.target.value;
//     setSelectedFunctionalities([])
//     setModuleId(id);
//     fetchFunctionalityModuleData(id); // ✅ use fresh value directly
//   };

//   // Fetch Functionality Data
//   const fetchFunctionalityModuleData = useCallback(async (moduleId) => {
//     if (!moduleId) return;
//     console.log("Module ...... ", moduleId);

//     const controller = new AbortController();
//     try {
//       setLoading(true);
//       const response = await fetch(
//         `${import.meta.env.VITE_API_BASE_URL}/functionality/module/${moduleId}`,
//         { signal: controller.signal }
//       );
//       if (!response.ok) throw new Error("Failed to fetch functionalities");
//       const result = await response.json();
//       setFunctionalityModuleList(result);
//     } catch (error) {
//       if (error.name !== "AbortError") {
//         toast.error("Failed to fetch functionalities");
//         setFunctionalityModuleList([]);
//       }
//     } finally {
//       setLoading(false);
//     }
//     return () => controller.abort();
//   }, []);

//   // Fetch all data on mount
//   useEffect(() => {
//     fetchGroupData();
//     fetchModuleData();
//     fetchFunctionalityData();
//     fetchRights();
//   }, [fetchGroupData, fetchModuleData, fetchFunctionalityData, fetchRights]);

//   // Convert functionality IDs to names for display
//   const getFunctionalityNames = (ids) => {

//     return ids
//       .map((id) => {
//         const func = functionalityList.find((f) => f._id === id);
//         return func ? func.functionality : null;
//       })
//       .filter((name) => name !== null);
//   };

//   // Save Assign Rights Data
//   const handleSave = async () => {
//     if (!groupId || !moduleId || selectedFunctionalities.length === 0) {
//       toast.error("Please fill all fields");
//       return;
//     }

//     try {
//       const groupName = groups.find((g) => g._id === groupId)?.groupName || "";
//       const moduleName = moduleList.find((m) => m._id === moduleId)?.moduleName || "";

//       const payload = {
//         group: groupId,          // ✅ match backend field
//         module: moduleId,        // ✅ match backend field
//         functionalities: functionalityIds,
//       };

//       const config = {
//         headers: {
//           Authorization: `Bearer ${userInfo?.token || ""}`,
//           "Content-Type": "application/json", // ✅ correct
//         },
//       };

//       let newRight;
//       if (isEdit && editId) {
//         newRight = {
//           _id: editId,
//           groupId,
//           groupName,
//           moduleId,
//           moduleName,
//           functionalities: functionalityIds,
//         };
//         setAssignRightsList(
//           assignRightsList.map((right) => (right._id === editId ? newRight : right))
//         );
//         await axios.put(`${import.meta.env.VITE_API_BASE_URL}/rights/${editId}`, payload, config);
//         toast.success("✅ Right updated successfully");
//       } else {
//         newRight = {
//           _id: `r${assignRightsList.length + 1}`,
//           groupId,
//           groupName,
//           moduleId,
//           moduleName,
//           functionalities: functionalityIds,
//         };
//         setAssignRightsList([...assignRightsList, newRight]);
//         await axios.post(`${import.meta.env.VITE_API_BASE_URL}/rights`, payload, config);
//         toast.success("✅ Right added successfully");
//       }

//       // Reset fields
//       setEditId(null);
//       setIsEdit(false);
//       setIsSliderOpen(false);
//       setGroupId("");
//       setModuleId("");
//       setSelectedFunctionalities([]);
//       fetchRights();
//     } catch (error) {
//       console.error(error);
//       toast.error(`❌ ${isEdit ? "Update" : "Add"} right failed`);
//     }
//   };

//   // Edit Assign Rights
//   const handleEdit = (right) => {
//     console.log("Right Edit", right);

//     setIsEdit(true);
//     setEditId(right._id);

//     // ✅ group and module come as objects, so pick _id
//     setGroupId(right?.group?._id || "");
//     setModuleId(right?.module?._id || "");

//     // ✅ functionalities already have _id and name
//     const functionalities = Array.isArray(right.functionalities)
//       ? right.functionalities.map(f => ({ _id: f._id, name: f.name }))
//       : [];

//     setSelectedFunctionalities(functionalities);

//     setIsSliderOpen(true);
//   };

//   // Delete Assign Rights
//   const handleDelete = async (id) => {
//     const swalWithTailwindButtons = Swal.mixin({
//       customClass: {
//         confirmButton: "bg-newPrimary text-white px-4 py-2 rounded-lg",
//         cancelButton: "bg-gray-300 text-gray-700 px-4 py-2 rounded-lg",
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

//             await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/rights/${id}`, {
//               headers: {
//                 Authorization: `Bearer ${userInfo.token}`,
//               },
//             });

//             setAssignRightsList(assignRightsList.filter((p) => p._id !== id));
//             swalWithTailwindButtons.fire("Deleted!", "Right deleted successfully.", "success");
//           } catch (error) {
//             console.error("Delete error:", error);
//             swalWithTailwindButtons.fire("Error!", "Failed to delete Right.", "error");
//           }
//         } else if (result.dismiss === Swal.DismissReason.cancel) {
//           swalWithTailwindButtons.fire("Cancelled", "Right is safe 🙂", "info");
//         }
//       });
//   };

//   // Handle Functionality Selection
//   const handleFunctionalitySelect = (e) => {
//     const selectedId = e.target.value;
//     if (!selectedId) return;

//     const selectedFunc = functionalityModuleList.find(
//       (func) => func._id === selectedId
//     );

//     if (selectedFunc) {
//       setSelectedFunctionalities((prev) => {
//         if (prev.some((f) => f._id === selectedFunc._id)) return prev;

//         const updated = [...prev, { _id: selectedFunc._id, name: selectedFunc.name }];
//         console.log("✅ Updated Selected Functionalities:", updated);
//         return updated;
//       });
//     }

//     e.target.value = ""; // reset dropdown
//   };

//   const functionalityIds = selectedFunctionalities.map(f => f._id);
//   console.log("functionalityIds ", functionalityIds);

//   // Remove a functionality
//   const removeFunctionality = (funcId) => {
//     setSelectedFunctionalities(
//       selectedFunctionalities.filter((func) => func._id !== funcId)
//     );
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
//           <h1 className="text-2xl font-bold text-newPrimary">Assign Rights List</h1>
//           <p className="text-gray-500 text-sm">Assign Rights Management Dashboard</p>
//         </div>
//         <button
//           className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-primaryDark transition-colors duration-200"
//           onClick={handleAddAssignRights}
//         >
//           + Add Right
//         </button>
//       </div>

//       {/* Assign Rights Table */}
//       <div className="rounded-xl shadow p-6 border border-gray-100 w-full overflow-hidden">
//         <div className="overflow-x-auto scrollbar-hide">
//           <div className="w-full">
//             {/* Table Headers */}
//             <div className="hidden lg:grid grid-cols-4 gap-4 bg-gray-50 py-3 px-6 text-xs font-medium text-gray-500 uppercase rounded-lg">
//               <div>Group</div>
//               <div>Module</div>
//               <div>Functionalities</div>
//               {userInfo?.isAdmin && (
//                 <div className="text-right flex items-center justify-end gap-1">
//                   <FaCog className="text-gray-500" />
//                   <span>Actions</span>
//                 </div>
//               )}
//             </div>

//             {/* Assign Rights Table */}
//             <div className="mt-4 flex flex-col gap-[14px] pb-14">
//               {assignRightsList.map((right) => (
//                 <div
//                   key={right._id}
//                   className="grid grid-cols-4 items-center gap-4 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100"
//                 >
//                   <div className="text-sm font-medium text-gray-900">{right?.group?.groupName}</div>
//                   <div className="text-sm font-semibold text-green-600">{right?.module?.moduleName}</div>
//                   <div className="text-sm text-gray-500">
//                     {right?.functionalities?.map((func) => (
//                       <div key={func._id}>{func.name}</div>
//                     ))}

//                   </div>

//                   {userInfo?.isAdmin && (
//                     <div className="text-right relative group">
//                       <button className="text-gray-400 hover:text-gray-600 text-xl">⋯</button>
//                       <div className="absolute right-0 top-6 w-28 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-300 z-50 flex flex-col justify-between">
//                         <button
//                           onClick={() => handleEdit(right)}
//                           className="w-full text-left px-4 py-2 text-sm hover:bg-blue-100 text-blue-600 flex items-center gap-2"
//                         >
//                           <FaEdit />
//                           Edit
//                         </button>
//                         <button
//                           onClick={() => handleDelete(right._id)}
//                           className="w-full text-left px-4 py-2 text-sm hover:bg-red-100 text-red-500 flex items-center gap-2"
//                         >
//                           <FaTrash />
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
//               <h2 className="text-xl font-bold text-newPrimary">{isEdit ? "Edit Right" : "Add Right"}</h2>
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
//                     <label className="block text-gray-700 mb-1">Group</label>
//                     <select
//                       value={groupId}
//                       onChange={(e) => setGroupId(e.target.value)}
//                       className="w-full p-2 border rounded focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary outline-none transition-all"
//                     >
//                       <option value="">Select Group</option>
//                       {groups.map((group) => (
//                         <option key={group._id} value={group._id}>
//                           {group.groupName}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-gray-700 mb-1">Module</label>
//                     <select
//                       value={moduleId}
//                       onChange={selectModule}
//                       className="w-full p-2 border rounded focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary outline-none transition-all"
//                     >
//                       <option value="">Select Module</option>
//                       {moduleList.map((module) => (
//                         <option key={module._id} value={module._id}>
//                           {module.moduleName}
//                         </option>
//                       ))}
//                     </select>

//                   </div>

//                   <div>
//                     <label className="block text-gray-700 mb-1">Functionalities</label>
//                     <select
//                       onChange={handleFunctionalitySelect}
//                       className="w-full p-2 border rounded focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary outline-none transition-all"
//                     >
//                       <option value="">Select functionality</option>
//                       {functionalityModuleList
//                         .filter((func) => !selectedFunctionalities.some(f => f._id === func._id))
//                         .map((func) => (
//                           <option key={func._id} value={func._id}>
//                             {func.name}
//                           </option>
//                         ))}
//                     </select>

//                     <div className="mt-2 flex flex-wrap gap-2">
//                       {selectedFunctionalities.map((func) => (
//                         <div
//                           key={func._id}
//                           className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
//                         >
//                           {func.name}
//                           <button
//                             type="button"
//                             onClick={() => removeFunctionality(func._id)}
//                             className="ml-2 text-blue-600 hover:text-blue-800"
//                           >
//                             <FaTimes className="text-xs" />
//                           </button>
//                         </div>
//                       ))}
//                     </div>
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
//                   {isEdit ? "Update Right" : "Save Right"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AssignRights;

import React, { useState, useEffect, useRef, useCallback } from "react";
import { HashLoader } from "react-spinners";
import gsap from "gsap";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import axios from "axios";
import { FiEdit3, FiTrash2, FiUser, FiGrid, FiKey } from "react-icons/fi";
import Pagination from "../pagination/Pagination";

const UsersModuleAccess = () => {
  // State declarations
  const [accessList, setAccessList] = useState([]);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedModuleId, setSelectedModuleId] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const sliderRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Sample data (in real app, fetch from APIs)
  const users = [
    { _id: "US001", userName: "Admin User", email: "admin@infinitybyte.com" },
    {
      _id: "US002",
      userName: "Manager Ali",
      email: "ali.manager@infinitybyte.com",
    },
    {
      _id: "US003",
      userName: "Sales Staff Sara",
      email: "sara.sales@infinitybyte.com",
    },
    {
      _id: "US004",
      userName: "Inventory Manager",
      email: "inventory@infinitybyte.com",
    },
    {
      _id: "US005",
      userName: "Cashier Rizwan",
      email: "rizwan.cashier@infinitybyte.com",
    },
    {
      _id: "US006",
      userName: "View Only User",
      email: "viewer@infinitybyte.com",
    },
  ];

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
  const dummyAccess = [
    {
      _id: "UMA001",
      userId: "US001",
      moduleId: "MI001",
      userName: "Admin User",
      moduleName: "Dashboard",
      userEmail: "admin@infinitybyte.com",
    },
    {
      _id: "UMA002",
      userId: "US001",
      moduleId: "MI002",
      userName: "Admin User",
      moduleName: "Inventory Management",
      userEmail: "admin@infinitybyte.com",
    },
    {
      _id: "UMA003",
      userId: "US001",
      moduleId: "MI003",
      userName: "Admin User",
      moduleName: "Sales & Invoicing",
      userEmail: "admin@infinitybyte.com",
    },
    {
      _id: "UMA004",
      userId: "US002",
      moduleId: "MI003",
      userName: "Manager Ali",
      moduleName: "Sales & Invoicing",
      userEmail: "ali.manager@infinitybyte.com",
    },
    {
      _id: "UMA005",
      userId: "US002",
      moduleId: "MI005",
      userName: "Manager Ali",
      moduleName: "Reporting & Analytics",
      userEmail: "ali.manager@infinitybyte.com",
    },
    {
      _id: "UMA006",
      userId: "US003",
      moduleId: "MI003",
      userName: "Sales Staff Sara",
      moduleName: "Sales & Invoicing",
      userEmail: "sara.sales@infinitybyte.com",
    },
    {
      _id: "UMA007",
      userId: "US003",
      moduleId: "MI004",
      userName: "Sales Staff Sara",
      moduleName: "Customer Management",
      userEmail: "sara.sales@infinitybyte.com",
    },
    {
      _id: "UMA008",
      userId: "US004",
      moduleId: "MI002",
      userName: "Inventory Manager",
      moduleName: "Inventory Management",
      userEmail: "inventory@infinitybyte.com",
    },
    {
      _id: "UMA009",
      userId: "US005",
      moduleId: "MI011",
      userName: "Cashier Rizwan",
      moduleName: "Point of Sale",
      userEmail: "rizwan.cashier@infinitybyte.com",
    },
    {
      _id: "UMA010",
      userId: "US006",
      moduleId: "MI001",
      userName: "View Only User",
      moduleName: "Dashboard",
      userEmail: "viewer@infinitybyte.com",
    },
  ];

  // Generate the next available access ID
  const generateNextAccessId = () => {
    if (accessList.length === 0) {
      return "UMA001";
    }

    // Extract all numeric parts from existing IDs
    const existingIds = accessList
      .map((access) => access._id)
      .filter((id) => id && id.startsWith("UMA"))
      .map((id) => {
        const match = id.match(/^UMA(\d+)$/);
        return match ? parseInt(match[1]) : 0;
      })
      .filter((num) => num > 0);

    if (existingIds.length === 0) {
      return "UMA001";
    }

    // Find the highest number
    const maxNumber = Math.max(...existingIds);
    const nextNumber = maxNumber + 1;

    // Format with leading zeros (3 digits)
    return `UMA${nextNumber.toString().padStart(3, "0")}`;
  };

  // Get display names for IDs
  const getUserNameById = (userId) => {
    const user = users.find((u) => u._id === userId);
    return user ? user.userName : "Unknown User";
  };

  const getUserEmailById = (userId) => {
    const user = users.find((u) => u._id === userId);
    return user ? user.email : "Unknown Email";
  };

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

  // Fetch access records
  const fetchAccess = useCallback(async () => {
    try {
      setLoading(true);
      // Try to fetch from API first
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/user-module-access`
      );
      if (res.data && res.data.length > 0) {
        // Add display names for better UX
        const accessWithNames = res.data.map((access) => ({
          ...access,
          userName: getUserNameById(access.userId),
          moduleName: getModuleNameById(access.moduleId),
          userEmail: getUserEmailById(access.userId),
        }));
        setAccessList(accessWithNames);
      } else {
        // If no data from API, use dummy data
        setAccessList(dummyAccess);
        console.log("Using dummy access data");
      }
    } catch (error) {
      // If API fails, use dummy data for demonstration
      console.log("API failed, using dummy data");
      setAccessList(dummyAccess);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  }, []);

  useEffect(() => {
    fetchAccess();
  }, [fetchAccess]);

  // Handlers
  const handleAddAccess = () => {
    setIsSliderOpen(true);
    setIsEdit(false);
    setEditId(null);
    setSelectedUserId("");
    setSelectedModuleId("");
  };

  // Save or Update Access
  const handleSave = async () => {
    if (!selectedUserId || !selectedModuleId) {
      toast.error("User and Module are required");
      return;
    }

    // Check if this user already has access to this module
    const existingAccess = accessList.find(
      (access) =>
        access.userId === selectedUserId && access.moduleId === selectedModuleId
    );

    if (existingAccess && !isEdit) {
      toast.error("This user already has access to this module");
      return;
    }

    try {
      if (isEdit && editId) {
        // Update existing access
        const updatedAccess = {
          _id: editId,
          userId: selectedUserId,
          moduleId: selectedModuleId,
          userName: getUserNameById(selectedUserId),
          moduleName: getModuleNameById(selectedModuleId),
          userEmail: getUserEmailById(selectedUserId),
        };

        setAccessList(
          accessList.map((access) =>
            access._id === editId ? updatedAccess : access
          )
        );
        toast.success("Access updated successfully");
      } else {
        // Add new access with auto-generated ID
        const newId = generateNextAccessId();
        const newAccess = {
          _id: newId,
          userId: selectedUserId,
          moduleId: selectedModuleId,
          userName: getUserNameById(selectedUserId),
          moduleName: getModuleNameById(selectedModuleId),
          userEmail: getUserEmailById(selectedUserId),
        };

        setAccessList([newAccess, ...accessList]);
        toast.success("Access granted successfully");
      }

      reState();
    } catch (error) {
      console.error(error);
      toast.error(`❌ ${isEdit ? "Update" : "Add"} Access failed`);
    }
  };

  // Reset state
  const reState = () => {
    setIsSliderOpen(false);
    setIsEdit(false);
    setEditId(null);
    setSelectedUserId("");
    setSelectedModuleId("");
  };

  // Edit Access
  const handleEdit = (access) => {
    setIsEdit(true);
    setEditId(access._id);
    setSelectedUserId(access.userId || "");
    setSelectedModuleId(access.moduleId || "");
    setIsSliderOpen(true);
  };

  // Delete Access
  const handleDelete = async (id) => {
    const swalWithTailwindButtons = Swal.mixin({
      customClass: {
        actions: "space-x-2",
        confirmButton:
          "bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300",
        cancelButton:
          "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-green-300",
      },
      buttonsStyling: false,
    });

    swalWithTailwindButtons
      .fire({
        title: "Revoke Access?",
        text: "This user will lose access to this module",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, revoke it!",
        cancelButtonText: "No, keep access!",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            // For dummy data, delete locally
            setAccessList(accessList.filter((access) => access._id !== id));
            swalWithTailwindButtons.fire(
              "Revoked!",
              "Access removed successfully.",
              "success"
            );
          } catch (error) {
            console.error("Delete error:", error);
            swalWithTailwindButtons.fire(
              "Error!",
              "Failed to revoke access.",
              "error"
            );
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithTailwindButtons.fire(
            "Cancelled",
            "Access is maintained 🙂",
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
          <p className="mt-4 text-gray-600">Loading user module access...</p>
        </div>
      </div>
    );
  }

  // Calculate pagination values
  const totalItems = accessList.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = accessList.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <FiKey className="text-newPrimary w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold text-newPrimary">
              Users Module Access
            </h1>
            <p className="text-gray-500 text-sm">
              Manage which modules each user can access in the system
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-newPrimary/80 transition-colors flex items-center gap-2"
            onClick={handleAddAccess}
          >
            + Grant Access
          </button>
        </div>
      </div>

      {/* Access Table */}
      <div className="rounded-xl shadow-lg p-6 border border-gray-200 w-full overflow-hidden bg-white">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="min-w-[900px]">
            {/* Table Headers */}
            <div className="grid grid-cols-[0.5fr_1.5fr_1.5fr_0.8fr] gap-4 bg-gradient-to-r from-gray-50 to-gray-100 py-4 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200 rounded-t-lg">
              <div>Sr#</div>
              <div>User</div>
              <div>Module</div>
              <div className="text-right">Actions</div>
            </div>

            {/* Access List */}
            <div className="flex flex-col">
              {currentItems.map((access, index) => (
                <div
                  key={access._id}
                  className={`grid grid-cols-[0.5fr_1.5fr_1.5fr_0.8fr] items-center gap-4 px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-all duration-200 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                  }`}
                >
                  {/* Serial Number */}
                  <div className="text-sm font-medium text-gray-900">
                    {startIndex + index + 1}
                  </div>

                  {/* User */}
                  <div className="text-sm text-gray-900 flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-100">
                      <FiUser className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold">{access.userName}</span>
                      <span className="text-xs text-gray-500">
                        {access.userEmail}
                      </span>
                      <span className="text-xs text-gray-400 font-mono mt-1">
                        ID: {access.userId}
                      </span>
                    </div>
                  </div>

                  {/* Module */}
                  <div className="text-sm text-gray-900 flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-100">
                      <FiGrid className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold">{access.moduleName}</span>
                      <span className="text-xs text-gray-400 font-mono">
                        ID: {access.moduleId}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 justify-end">
                    {/* EDIT ICON */}
                    <button
                      onClick={() => handleEdit(access)}
                      className="text-purple-600 hover:bg-purple-100 bg-purple-50 p-2 rounded-md transition"
                    >
                      <FiEdit3 className="w-4 h-4" />
                    </button>
                    {/* DELETE ICON */}
                    <button
                      onClick={() => handleDelete(access._id)}
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
                    <FiKey className="w-6 h-6 text-newPrimary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-newPrimary">
                      {isEdit ? "Update Access" : "Grant Module Access"}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {isEdit
                        ? "Update user module access"
                        : "Select user and module to grant access"}
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
              {/* Section 1: Access Information */}
              <div className="space-y-6 p-6 border border-gray-300/60 rounded-2xl bg-gray-100/40 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-2 border-b border-gray-300 pb-2">
                  <div className="w-1.5 h-6 bg-newPrimary rounded-full"></div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Access Information
                  </h3>
                </div>

                <div className="space-y-6">
                  {/* Access ID */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      Access ID
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FiKey className="w-5 h-5 text-gray-400" />
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
                              {generateNextAccessId()}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* User Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      User <span className="text-red-500 text-lg">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FiUser className="w-5 h-5 text-gray-400" />
                      </div>
                      <select
                        value={selectedUserId}
                        required
                        onChange={(e) => setSelectedUserId(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary bg-white transition-all duration-200 hover:border-gray-400 appearance-none cursor-pointer"
                      >
                        <option value="">Select a user</option>
                        {users.map((user) => (
                          <option key={user._id} value={user._id}>
                            {user.userName} ({user.email})
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
                        Update Access
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
                        Grant Access
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

export default UsersModuleAccess;
