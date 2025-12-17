import React, { useState, useEffect, useRef, useCallback } from "react";
import { HashLoader } from "react-spinners";
import gsap from "gsap";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import axios from "axios";
import { FiEdit3, FiTrash2, FiLayers, FiPlus } from "react-icons/fi";
import { FaCode, FaServer } from "react-icons/fa";
import Pagination from "../pagination/Pagination";

const SoftwareGroup = () => {
    const [softwareGroupList, setSoftwareGroupList] = useState([]);
    const [isSliderOpen, setIsSliderOpen] = useState(false);
    const [id, setId] = useState("");
    const [softwareGroupName, setSoftwareGroupName] = useState("");
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);
    const sliderRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Dummy data for demonstration
    const dummySoftwareGroups = [
        {
            _id: "1",
            softwareGroup: "Enterprise Resource Planning (ERP)",
        },
        {
            _id: "2",
            softwareGroup: "Customer Relationship Management (CRM)",
        },
        {
            _id: "3",
            softwareGroup: "Human Resource Management (HRM)",
        },
        {
            _id: "4",
            softwareGroup: "Supply Chain Management (SCM)",
        },
        {
            _id: "5",
            softwareGroup: "Content Management System (CMS)",
        },
        {
            _id: "6",
            softwareGroup: "Learning Management System (LMS)",
        },
        {
            _id: "7",
            softwareGroup: "Project Management Tools",
        },
        {
            _id: "8",
            softwareGroup: "Accounting Software",
        },
        {
            _id: "9",
            softwareGroup: "Business Intelligence (BI)",
        },
        {
            _id: "10",
            softwareGroup: "E-commerce Platforms",
        },
        {
            _id: "11",
            softwareGroup: "Point of Sale (POS)",
        },
        {
            _id: "12",
            softwareGroup: "Communication & Collaboration",
        },
        {
            _id: "13",
            softwareGroup: "Marketing Automation",
        },
        {
            _id: "14",
            softwareGroup: "Help Desk & Support",
        },
        {
            _id: "15",
            softwareGroup: "Document Management",
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

    // Fetch software groups
    const fetchSoftwareGroups = useCallback(async () => {
        try {
            setLoading(true);
            // Try to fetch from API first
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/software-groups`);
            if (res.data && res.data.length > 0) {
                setSoftwareGroupList(res.data);
            } else {
                // If no data from API, use dummy data
                setSoftwareGroupList(dummySoftwareGroups);
                console.log("Using dummy software groups data");
            }
        } catch (error) {
            // If API fails, use dummy data for demonstration
            console.log("API failed, using dummy data");
            setSoftwareGroupList(dummySoftwareGroups);
        } finally {
            setTimeout(() => setLoading(false), 1000);
        }
    }, []);

    useEffect(() => {
        fetchSoftwareGroups();
    }, [fetchSoftwareGroups]);

    // Pagination calculations
    const totalItems = softwareGroupList.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = softwareGroupList.slice(startIndex, startIndex + itemsPerPage);

    // Handlers
    const handleAddSoftwareGroup = () => {
        setIsSliderOpen(true);
        setIsEdit(false);
        setEditId(null);
        setId("");
        setSoftwareGroupName("");
    };

    // Save or Update Software Group
    const handleSave = async () => {
        if (!softwareGroupName.trim()) {
            toast.error("Software Group name is required");
            return;
        }

        try {
            if (isEdit && editId) {
                // For dummy data, update locally
                const updatedSoftwareGroup = {
                    _id: editId,
                    softwareGroup: softwareGroupName,
                };

                setSoftwareGroupList(softwareGroupList.map(group =>
                    group._id === editId ? updatedSoftwareGroup : group
                ));
                toast.success("Software Group updated successfully");
            } else {
                // Check for duplicate
                const isDuplicate = softwareGroupList.some(
                    group => group.softwareGroup.toLowerCase() === softwareGroupName.toLowerCase()
                );

                if (isDuplicate) {
                    toast.error("Software Group already exists");
                    return;
                }

                // For dummy data, add new software group locally
                const newSoftwareGroup = {
                    _id: `sg-${Date.now()}`,
                    softwareGroup: softwareGroupName,
                };

                setSoftwareGroupList([newSoftwareGroup, ...softwareGroupList]);
                toast.success("Software Group added successfully");
            }

            reState();
        } catch (error) {
            console.error(error);
            toast.error(`❌ ${isEdit ? "Update" : "Add"} Software Group failed`);
        }
    };

    // Reset state
    const reState = () => {
        setIsSliderOpen(false);
        setIsEdit(false);
        setEditId(null);
        setId("");
        setSoftwareGroupName("");
    };

    // Edit Software Group
    const handleEdit = (softwareGroup) => {
        setIsEdit(true);
        setEditId(softwareGroup._id);
        setSoftwareGroupName(softwareGroup.softwareGroup);
        setIsSliderOpen(true);
    };

    // Delete Software Group
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
                        setSoftwareGroupList(softwareGroupList.filter((group) => group._id !== id));
                        swalWithTailwindButtons.fire(
                            "Deleted!",
                            "Software Group deleted successfully.",
                            "success"
                        );
                    } catch (error) {
                        console.error("Delete error:", error);
                        swalWithTailwindButtons.fire(
                            "Error!",
                            "Failed to delete software group.",
                            "error"
                        );
                    }
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    swalWithTailwindButtons.fire(
                        "Cancelled",
                        "Software Group is safe 🙂",
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
                    <HashLoader
                        height="150"
                        width="150"
                        radius={1}
                        color="#84CF16"
                    />
                    <p className="mt-4 text-gray-600">Loading software groups...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <FaCode className="text-newPrimary w-8 h-8" />
                    <div>
                        <h1 className="text-2xl font-bold text-newPrimary">Software Groups</h1>
                        <p className="text-gray-500 text-sm">Manage software categories and groups</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-newPrimary/80 transition-colors flex items-center gap-2"
                        onClick={handleAddSoftwareGroup}
                    >
                        <FiPlus className="w-4 h-4" />
                        Add Software Group
                    </button>
                </div>
            </div>

            {/* Software Groups Table */}
            <div className="rounded-xl shadow-lg p-6 border border-gray-200 w-full overflow-hidden bg-white">
                <div className="overflow-x-auto scrollbar-hide">
                    <div className="min-w-[800px]">
                        {/* Table Headers */}
                        <div className="grid grid-cols-[0.5fr_3fr_0.8fr] gap-4 bg-gradient-to-r from-gray-50 to-gray-100 py-4 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200 rounded-t-lg">
                            <div>Sr#</div>
                            <div>Software Group</div>
                            <div className="text-right">Actions</div>
                        </div>

                        {/* Software Groups List */}
                        <div className="flex flex-col">
                            {currentItems.map((group, index) => (
                                <div
                                    key={group._id}
                                    className={`grid grid-cols-[0.5fr_3fr_0.8fr] items-center gap-4 px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                                        }`}
                                >
                                    {/* Serial Number */}
                                    <div className="text-sm font-medium text-gray-900">
                                        {startIndex + index + 1}
                                    </div>

                                    {/* Software Group */}
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gradient-to-br from-newPrimary/20 to-newPrimary/10 rounded-lg flex items-center justify-center">
                                                <FiLayers className="w-4 h-4 text-newPrimary" />
                                            </div>
                                            <div className="text-sm font-semibold text-gray-900">
                                                {group.softwareGroup}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-3 justify-end">
                                        {/* EDIT ICON */}
                                        <button
                                            onClick={() => handleEdit(group)}
                                            className="text-purple-600 hover:bg-purple-100 bg-purple-50 p-2 rounded-md transition"
                                        >
                                            <FiEdit3 className="w-4 h-4" />
                                        </button>
                                        {/* DELETE ICON */}
                                        <button
                                            onClick={() => handleDelete(group._id)}
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
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                            <div className="text-sm text-blue-600 font-medium">Total Groups</div>
                            <div className="text-2xl font-bold text-blue-700">{softwareGroupList.length}</div>
                        </div>
                        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                            <div className="text-sm text-green-600 font-medium">Active</div>
                            <div className="text-2xl font-bold text-green-700">{softwareGroupList.length}</div>
                        </div>
                        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                            <div className="text-sm text-purple-600 font-medium">In Use</div>
                            <div className="text-2xl font-bold text-purple-700">
                                {Math.floor(softwareGroupList.length * 0.7)}
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

            {/* Slider/Modal */}
            <div
                className={`fixed inset-0 flex items-center justify-center z-50 transition-all duration-300 ${isSliderOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
            >
                {/* Backdrop */}
                <div
                    className={`absolute inset-0 bg-gray-600/70 backdrop-blur-0 transition-opacity duration-300 ${isSliderOpen ? "opacity-100" : "opacity-0"
                        }`}
                    onClick={reState}
                />

                {/* Slider Content */}
                <div
                    ref={sliderRef}
                    className={`relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl transform transition-all duration-500 ease-out ${isSliderOpen ? "translate-y-0 scale-100" : "translate-y-8 scale-95"
                        }`}
                >
                    {/* Header with gradient */}
                    <div className="sticky top-0 z-10 bg-gray-200 px-8 py-4 rounded-t-3xl">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                                        <FaCode className="w-6 h-6 text-newPrimary" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-newPrimary">
                                            {isEdit ? "Update Software Group" : "Add New Software Group"}
                                        </h2>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {isEdit ? "Update software group details" : "Fill in the software group information below"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <button
                                className="p-1 hover:bg-white/20 bg-white/10 rounded-xl transition-all duration-300 group backdrop-blur-sm hover:scale-105"
                                onClick={reState}
                            >
                                <svg className="w-6 h-6 text-white bg-newPrimary rounded-lg group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Form Content */}
                    <div className="px-8 py-6 overflow-y-auto max-h-[75vh] scrollbar-thin scrollbar-hide scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                        <div className="space-y-8 pb-2">
                            {/* Section: Software Group Information */}
                            <div className="space-y-6 p-6 border border-gray-300/60 rounded-2xl bg-gray-100/40 shadow-sm hover:shadow-md transition-shadow duration-300">
                                <div className="flex items-center gap-3 mb-2 border-b border-gray-300 pb-2">
                                    <div className="w-1.5 h-6 bg-newPrimary rounded-full"></div>
                                    <h3 className="text-lg font-semibold text-gray-800">Software Group Information</h3>
                                </div>

                                <div className="grid grid-cols-1 gap-6">
                                    {/* Software Group Name */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                            Software Group Name <span className="text-red-500 text-lg">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <FiLayers className="w-5 h-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                value={softwareGroupName}
                                                required
                                                onChange={(e) => setSoftwareGroupName(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary bg-white transition-all duration-200 hover:border-gray-400 placeholder:text-gray-400"
                                                placeholder="Enter software group name"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">e.g., Enterprise Resource Planning (ERP), Customer Relationship Management (CRM)</p>
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
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                Update Software Group
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                </svg>
                                                Save Software Group
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

export default SoftwareGroup;