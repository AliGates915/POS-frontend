import React, { useState, useEffect, useRef, useCallback } from "react";
import { HashLoader } from "react-spinners";
import gsap from "gsap";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import axios from "axios";
import { FiEdit3, FiTrash2, FiUser, FiMail, FiBriefcase, FiAward, FiHash } from "react-icons/fi";
import { FaUsers, FaBuilding } from "react-icons/fa";
import Pagination from "../../pages/admin/pagination/Pagination";

const Employee = () => {
    const [employeeList, setEmployeeList] = useState([]);
    const [companyList, setCompanyList] = useState([]);
    const [isSliderOpen, setIsSliderOpen] = useState(false);
    const [id, setId] = useState("");
    const [companyId, setCompanyId] = useState("");
    const [employeeCode, setEmployeeCode] = useState("");
    const [employeeName, setEmployeeName] = useState("");
    const [email, setEmail] = useState("");
    const [department, setDepartment] = useState("");
    const [designation, setDesignation] = useState("");
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);
    const sliderRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Departments list
    const departments = [
        "Engineering",
        "Marketing",
        "Sales",
        "Human Resources",
        "Finance",
        "Operations",
        "Customer Support",
        "Product Management",
        "Research & Development",
        "Quality Assurance",
        "IT Support",
        "Legal"
    ];

    // Designations list
    const designations = [
        "Software Engineer",
        "Senior Software Engineer",
        "Team Lead",
        "Engineering Manager",
        "Product Manager",
        "Project Manager",
        "Marketing Specialist",
        "Sales Executive",
        "HR Manager",
        "Finance Analyst",
        "Operations Manager",
        "CEO",
        "CTO",
        "CFO",
        "COO",
        "Frontend Developer",
        "Backend Developer",
        "Full Stack Developer",
        "DevOps Engineer",
        "Data Analyst",
        "UX Designer",
        "UI Designer",
        "System Administrator",
        "Network Engineer"
    ];

    // Dummy data for demonstration
    const dummyEmployees = [
        {
            _id: "1",
            companyId: "1",
            employeeCode: "EMP001",
            employeeName: "John Smith",
            email: "john.smith@techsolutions.com",
            department: "Engineering",
            designation: "Senior Software Engineer",
            companyName: "Tech Solutions Inc."
        },
        {
            _id: "2",
            companyId: "1",
            employeeCode: "EMP002",
            employeeName: "Sarah Johnson",
            email: "sarah.j@techsolutions.com",
            department: "Marketing",
            designation: "Marketing Manager",
            companyName: "Tech Solutions Inc."
        },
        {
            _id: "3",
            companyId: "2",
            employeeCode: "EMP003",
            employeeName: "Michael Chen",
            email: "michael.chen@globalpharma.com",
            department: "Research & Development",
            designation: "Research Scientist",
            companyName: "Global Pharmaceuticals"
        },
        {
            _id: "4",
            companyId: "3",
            employeeCode: "EMP004",
            employeeName: "Emily Rodriguez",
            email: "emily.r@greenenergy.com",
            department: "Operations",
            designation: "Operations Manager",
            companyName: "Green Energy Corp"
        },
        {
            _id: "5",
            companyId: "4",
            employeeCode: "EMP005",
            employeeName: "David Wilson",
            email: "david.w@urbanlogistics.com",
            department: "Sales",
            designation: "Sales Executive",
            companyName: "Urban Logistics Ltd"
        },
        {
            _id: "6",
            companyId: "5",
            employeeCode: "EMP006",
            employeeName: "Lisa Thompson",
            email: "lisa.t@creativedesigns.com",
            department: "Product Management",
            designation: "Product Manager",
            companyName: "Creative Designs Studio"
        },
        {
            _id: "7",
            companyId: "6",
            employeeCode: "EMP007",
            employeeName: "Robert Kim",
            email: "robert.k@financialtrust.com",
            department: "Finance",
            designation: "Finance Analyst",
            companyName: "Financial Trust Bank"
        },
        {
            _id: "8",
            companyId: "7",
            employeeCode: "EMP008",
            employeeName: "Jessica Lee",
            email: "jessica.l@wellnesscenter.com",
            department: "Customer Support",
            designation: "Support Specialist",
            companyName: "Health & Wellness Center"
        },
        {
            _id: "9",
            companyId: "8",
            employeeCode: "EMP009",
            employeeName: "Thomas Brown",
            email: "thomas.b@ecofoods.com",
            department: "Operations",
            designation: "Logistics Coordinator",
            companyName: "Eco Food Products"
        },
        {
            _id: "10",
            companyId: "1",
            employeeCode: "EMP010",
            employeeName: "Amanda Clark",
            email: "amanda.c@techsolutions.com",
            department: "Engineering",
            designation: "Frontend Developer",
            companyName: "Tech Solutions Inc."
        }
    ];

    // Dummy companies for dropdown
    const dummyCompanies = [
        { _id: "1", companyName: "Tech Solutions Inc." },
        { _id: "2", companyName: "Global Pharmaceuticals" },
        { _id: "3", companyName: "Green Energy Corp" },
        { _id: "4", companyName: "Urban Logistics Ltd" },
        { _id: "5", companyName: "Creative Designs Studio" },
        { _id: "6", companyName: "Financial Trust Bank" },
        { _id: "7", companyName: "Health & Wellness Center" },
        { _id: "8", companyName: "Eco Food Products" }
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

    // Fetch employees
    const fetchEmployees = useCallback(async () => {
        try {
            setLoading(true);
            // Try to fetch from API first
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/employees`);
            if (res.data && res.data.length > 0) {
                setEmployeeList(res.data);
            } else {
                // If no data from API, use dummy data
                setEmployeeList(dummyEmployees);
                console.log("Using dummy employees data");
            }
        } catch (error) {
            // If API fails, use dummy data for demonstration
            console.log("API failed, using dummy data");
            setEmployeeList(dummyEmployees);
        } finally {
            setTimeout(() => setLoading(false), 1000);
        }
    }, []);

    // Fetch companies for dropdown
    const fetchCompanies = useCallback(async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/companies`);
            if (res.data && res.data.length > 0) {
                setCompanyList(res.data);
            } else {
                setCompanyList(dummyCompanies);
            }
        } catch (error) {
            setCompanyList(dummyCompanies);
        }
    }, []);

    useEffect(() => {
        fetchEmployees();
        fetchCompanies();
    }, [fetchEmployees, fetchCompanies]);

    // Pagination calculations
    const totalItems = employeeList.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = employeeList.slice(startIndex, startIndex + itemsPerPage);

    // Handlers
    const handleAddEmployee = () => {
        setIsSliderOpen(true);
        setIsEdit(false);
        setEditId(null);
        setId("");
        setCompanyId("");

        // Generate next employee code
        const nextCode = generateNextEmployeeCode();
        setEmployeeCode(nextCode);

        setEmployeeName("");
        setEmail("");
        setDepartment("");
        setDesignation("");
    };

    // Generate next employee code in format [EMP001]
    const generateNextEmployeeCode = () => {
        if (employeeList.length === 0) {
            return "EMP001";
        }

        // Extract all numeric parts from existing codes
        const codes = employeeList
            .map(emp => {
                const code = emp.employeeCode || "";
                // Remove all non-digit characters
                const numbers = code.replace(/\D/g, '');
                return numbers ? parseInt(numbers, 10) : 0;
            })
            .filter(num => !isNaN(num) && num > 0);

        // Find the highest number
        const maxCode = codes.length > 0 ? Math.max(...codes) : 0;

        // Generate next code with leading zeros
        const nextNumber = maxCode + 1;
        const formattedNumber = nextNumber.toString().padStart(3, '0');
        return `EMP${formattedNumber}`;
    };

    // Save or Update Employee
    const handleSave = async () => {
        if (!employeeName || !email || !companyId) {
            toast.error("Employee Name, Email, and Company are required");
            return;
        }

        try {
            const selectedCompany = companyList.find(company => company._id === companyId);

            if (isEdit && editId) {
                // For dummy data, update locally
                const updatedEmployee = {
                    _id: editId,
                    companyId,
                    employeeCode: employeeCode || generateEmployeeCode(),
                    employeeName,
                    email,
                    department,
                    designation,
                    companyName: selectedCompany?.companyName || "Unknown Company"
                };

                setEmployeeList(employeeList.map(employee =>
                    employee._id === editId ? updatedEmployee : employee
                ));
                toast.success("Employee updated successfully");
            } else {
                // For dummy data, add new employee locally
                const newEmployee = {
                    _id: `emp-${Date.now()}`,
                    companyId,
                    employeeCode: employeeCode || generateEmployeeCode(),
                    employeeName,
                    email,
                    department,
                    designation,
                    companyName: selectedCompany?.companyName || "Unknown Company"
                };

                setEmployeeList([newEmployee, ...employeeList]);
                toast.success("Employee added successfully");
            }

            reState();
        } catch (error) {
            console.error(error);
            toast.error(`❌ ${isEdit ? "Update" : "Add"} Employee failed`);
        }
    };

    // Reset state
    const reState = () => {
        setIsSliderOpen(false);
        setIsEdit(false);
        setEditId(null);
        setId("");
        setCompanyId("");
        setEmployeeCode("");
        setEmployeeName("");
        setEmail("");
        setDepartment("");
        setDesignation("");
    };

    // Edit Employee
    const handleEdit = (employee) => {
        setIsEdit(true);
        setEditId(employee._id);
        setCompanyId(employee.companyId);
        setEmployeeCode(employee.employeeCode);
        setEmployeeName(employee.employeeName);
        setEmail(employee.email);
        setDepartment(employee.department);
        setDesignation(employee.designation);
        setIsSliderOpen(true);
    };

    // Delete Employee
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
                        setEmployeeList(employeeList.filter((employee) => employee._id !== id));
                        swalWithTailwindButtons.fire(
                            "Deleted!",
                            "Employee deleted successfully.",
                            "success"
                        );
                    } catch (error) {
                        console.error("Delete error:", error);
                        swalWithTailwindButtons.fire(
                            "Error!",
                            "Failed to delete employee.",
                            "error"
                        );
                    }
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    swalWithTailwindButtons.fire(
                        "Cancelled",
                        "Employee is safe 🙂",
                        "error"
                    );
                }
            });
    };

    // Get company name by ID
    const getCompanyName = (companyId) => {
        const company = companyList.find(c => c._id === companyId);
        return company?.companyName || "Unknown Company";
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
                    <p className="mt-4 text-gray-600">Loading employees...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <FaUsers className="text-newPrimary w-8 h-8" />
                    <div>
                        <h1 className="text-2xl font-bold text-newPrimary">Employees</h1>
                        <p className="text-gray-500 text-sm">Manage your employees and their details</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-newPrimary/80 transition-colors flex items-center gap-2"
                        onClick={handleAddEmployee}
                    >
                        <FiUser className="w-4 h-4" />
                        Add Employee
                    </button>
                </div>
            </div>

            {/* Employees Table */}
            <div className="rounded-xl shadow-lg p-6 border border-gray-200 w-full overflow-hidden bg-white">
                <div className="overflow-x-auto scrollbar-hide">
                    <div className="min-w-[1200px]">
                        {/* Table Headers */}
                        <div className="grid grid-cols-[0.5fr_2fr_2fr_2fr_1.5fr_2fr_0.8fr] gap-4 bg-gradient-to-r from-gray-50 to-gray-100 py-4 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200 rounded-t-lg">
                            <div>Sr#</div>
                            <div>Employee Name</div>
                            <div>Company Name</div>
                            <div>Email</div>
                            <div>Department</div>
                            <div>Designation</div>
                            <div className="text-right">Actions</div>
                        </div>

                        {/* Employees List */}
                        <div className="flex flex-col">
                            {currentItems.map((employee, index) => (
                                <div
                                    key={employee._id}
                                    className={`grid grid-cols-[0.5fr_2fr_2fr_2fr_1.5fr_2fr_0.8fr] items-center gap-4 px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                                        }`}
                                >
                                    {/* Serial Number */}
                                    <div className="text-sm font-medium text-gray-900">
                                        {startIndex + index + 1}
                                    </div>

                                    {/* Employee Name */}
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gradient-to-br from-newPrimary/20 to-newPrimary/10 rounded-lg flex items-center justify-center">
                                                <FiUser className="w-4 h-4 text-newPrimary" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-semibold text-gray-900">
                                                    {employee.employeeName}
                                                </div>
                                                <div className="text-xs text-gray-500 font-mono">
                                                    {employee.employeeCode}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Company Name */}
                                    <div className="text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <FaBuilding className="w-3 h-3 text-gray-400" />
                                            {getCompanyName(employee.companyId)}
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="text-sm text-gray-600 truncate" title={employee.email}>
                                        <div className="flex items-center gap-2">
                                            <FiMail className="w-3 h-3 text-gray-400" />
                                            {employee.email}
                                        </div>
                                    </div>

                                    {/* Department */}
                                    <div className="text-sm">
                                        <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                                            {employee.department || "Not Assigned"}
                                        </span>
                                    </div>

                                    {/* Designation */}
                                    <div className="text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <FiAward className="w-3 h-3 text-gray-400" />
                                            {employee.designation || "Not Assigned"}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-3 justify-end">
                                        {/* EDIT ICON */}
                                        <button
                                            onClick={() => handleEdit(employee)}
                                            className="text-blue-600 hover:bg-blue-100 bg-blue-50 p-2 rounded-md transition"
                                        >
                                            <FiEdit3 className="w-4 h-4" />
                                        </button>
                                        {/* DELETE ICON */}
                                        <button
                                            onClick={() => handleDelete(employee._id)}
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
              <div className="text-sm text-blue-600 font-medium">Total Employees</div>
              <div className="text-2xl font-bold text-blue-700">{employeeList.length}</div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
              <div className="text-sm text-green-600 font-medium">Active Departments</div>
              <div className="text-2xl font-bold text-green-700">
                {[...new Set(employeeList.map(emp => emp.department))].length}
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
              <div className="text-sm text-purple-600 font-medium">Companies</div>
              <div className="text-2xl font-bold text-purple-700">
                {[...new Set(employeeList.map(emp => emp.companyId))].length}
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
                    className={`relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl transform transition-all duration-500 ease-out ${isSliderOpen ? "translate-y-0 scale-100" : "translate-y-8 scale-95"
                        }`}
                >
                    {/* Header with gradient */}
                    <div className="sticky top-0 z-10 bg-gray-200 px-8 py-4 rounded-t-3xl">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                                        <FaUsers className="w-6 h-6 text-newPrimary" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-newPrimary">
                                            {isEdit ? "Update Employee" : "Add New Employee"}
                                        </h2>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {isEdit ? "Update employee details" : "Fill in the employee information below"}
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
                            {/* Section 1: Basic Information */}
                            <div className="space-y-6 p-6 border border-gray-300/60 rounded-2xl bg-gray-100/40 shadow-sm hover:shadow-md transition-shadow duration-300">
                                <div className="flex items-center gap-3 mb-2 border-b border-gray-300 pb-2">
                                    <div className="w-1.5 h-6 bg-newPrimary rounded-full"></div>
                                    <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    {/* Employee Code */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                            Employee Code <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <FiHash className="w-5 h-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                value={employeeCode}
                                                disabled
                                                onChange={(e) => {
                                                    // Ensure format is maintained
                                                    let value = e.target.value;
                                                    // Allow empty or format starting with [EMP
                                                    if (value === "" || value.startsWith("[EMP")) {
                                                        setEmployeeCode(value);
                                                    }
                                                }}
                                                className="w-full bg-gray-50 pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary transition-all duration-200 hover:border-gray-400 placeholder:text-gray-400"
                                                placeholder="[EMP001]"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setEmployeeCode(generateNextEmployeeCode())}
                                                className="absolute right-10 top-1/2 transform -translate-y-1/2 text-newPrimary hover:text-newPrimary/80 transition-colors"
                                                title="Generate next code"
                                            >
                                            </button>
                                        </div>
                                    </div>

                                    {/* Employee Name */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                            Employee Name <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <FiUser className="w-5 h-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                value={employeeName}
                                                required
                                                onChange={(e) => setEmployeeName(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary bg-white transition-all duration-200 hover:border-gray-400 placeholder:text-gray-400"
                                                placeholder="Enter employee name"
                                            />
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                            Email Address <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <FiMail className="w-5 h-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="email"
                                                value={email}
                                                required
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary bg-white transition-all duration-200 hover:border-gray-400"
                                                placeholder="employee@example.com"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Company & Role Information */}
                            <div className="space-y-6 p-6 border border-gray-300/60 rounded-2xl bg-gray-100/40 shadow-sm hover:shadow-md transition-shadow duration-300">
                                <div className="flex items-center gap-3 mb-2 border-b border-gray-300 pb-2">
                                    <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
                                    <h3 className="text-lg font-semibold text-gray-800">Company & Role Information</h3>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    {/* Company Selection */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                            Company <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <FaBuilding className="w-5 h-5 text-gray-400" />
                                            </div>
                                            <select
                                                value={companyId}
                                                onChange={(e) => setCompanyId(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary bg-white transition-all duration-200 hover:border-gray-400 appearance-none"
                                            >
                                                <option value="">Select a company</option>
                                                {companyList.map((company) => (
                                                    <option key={company._id} value={company._id}>
                                                        {company.companyName}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Department */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Department
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <FiBriefcase className="w-5 h-5 text-gray-400" />
                                            </div>
                                            <select
                                                value={department}
                                                onChange={(e) => setDepartment(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary bg-white transition-all duration-200 hover:border-gray-400 appearance-none"
                                            >
                                                <option value="">Select department</option>
                                                {departments.map((dept) => (
                                                    <option key={dept} value={dept}>
                                                        {dept}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Designation */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Designation
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <FiAward className="w-5 h-5 text-gray-400" />
                                            </div>
                                            <select
                                                value={designation}
                                                onChange={(e) => setDesignation(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary bg-white transition-all duration-200 hover:border-gray-400 appearance-none"
                                            >
                                                <option value="">Select designation</option>
                                                {designations.map((designation) => (
                                                    <option key={designation} value={designation}>
                                                        {designation}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
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
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                Update Employee
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                </svg>
                                                Save Employee
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

export default Employee;