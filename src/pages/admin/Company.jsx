import React, { useState, useEffect, useRef, useCallback } from "react";
import { HashLoader } from "react-spinners";
import gsap from "gsap";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import { FaBuilding } from "react-icons/fa";
import Pagination from "../../pages/admin/pagination/Pagination";

const Company = () => {
  const [companyList, setCompanyList] = useState([]);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [renewable, setRenewable] = useState(true);
  const [expiryDate, setExpiryDate] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const sliderRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // You can change if you want

  const totalItems = companyList.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = companyList.slice(startIndex, startIndex + itemsPerPage);


  // Dummy data for demonstration
  const dummyCompanies = [
    {
      _id: "1",
      companyName: "Tech Solutions Inc.",
      address: "123 Innovation Drive, San Francisco, CA 94107",
      phone: "+1 (415) 555-0123",
      email: "info@techsolutions.com",
      website: "https://techsolutions.com",
      renewable: true,
      expiryDate: "2024-12-31T23:59:59.000Z",
      companyImage: {
        url: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=100&h=100&fit=crop&crop=face"
      }
    },
    {
      _id: "2",
      companyName: "Global Pharmaceuticals",
      address: "456 Medical Blvd, Boston, MA 02115",
      phone: "+1 (617) 555-9876",
      email: "contact@globalpharma.com",
      website: "https://globalpharma.com",
      renewable: true,
      expiryDate: "2024-06-15T23:59:59.000Z",
      companyImage: {
        url: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=100&h=100&fit=crop&crop=face"
      }
    },
    {
      _id: "3",
      companyName: "Green Energy Corp",
      address: "789 Solar Street, Austin, TX 73301",
      phone: "+1 (512) 555-4567",
      email: "support@greenenergy.com",
      website: "https://greenenergy.com",
      renewable: false,
      expiryDate: null,
      companyImage: {
        url: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=100&h=100&fit=crop&crop=face"
      }
    },
    {
      _id: "4",
      companyName: "Urban Logistics Ltd",
      address: "101 Transport Ave, Chicago, IL 60601",
      phone: "+1 (312) 555-7890",
      email: "operations@urbanlogistics.com",
      website: "https://urbanlogistics.com",
      renewable: true,
      expiryDate: "2024-03-20T23:59:59.000Z",
      companyImage: {
        url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&crop=face"
      }
    },
    {
      _id: "5",
      companyName: "Creative Designs Studio",
      address: "202 Art District, Brooklyn, NY 11201",
      phone: "+1 (718) 555-2345",
      email: "hello@creativedesigns.com",
      website: "https://creativedesigns.com",
      renewable: true,
      expiryDate: "2025-01-15T23:59:59.000Z",
      companyImage: {
        url: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=100&h=100&fit=crop&crop=face"
      }
    },
    {
      _id: "6",
      companyName: "Financial Trust Bank",
      address: "303 Wall Street, New York, NY 10005",
      phone: "+1 (212) 555-6789",
      email: "banking@financialtrust.com",
      website: "https://financialtrust.com",
      renewable: true,
      expiryDate: "2024-01-10T23:59:59.000Z", // Expired
      companyImage: {
        url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&crop=face"
      }
    },
    {
      _id: "7",
      companyName: "Health & Wellness Center",
      address: "404 Care Lane, Miami, FL 33101",
      phone: "+1 (305) 555-3456",
      email: "care@wellnesscenter.com",
      website: "https://wellnesscenter.com",
      renewable: true,
      expiryDate: "2024-02-28T23:59:59.000Z", // About to expire
      companyImage: {
        url: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=100&h=100&fit=crop&crop=face"
      }
    },
    {
      _id: "8",
      companyName: "Eco Food Products",
      address: "505 Organic Way, Portland, OR 97201",
      phone: "+1 (503) 555-9012",
      email: "organic@ecofoods.com",
      website: "https://ecofoods.com",
      renewable: true,
      expiryDate: "2024-11-30T23:59:59.000Z",
      companyImage: {
        url: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=100&h=100&fit=crop&crop=face"
      }
    }
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

  // Fetch companies
  const fetchCompanies = useCallback(async () => {
    try {
      setLoading(true);
      // Try to fetch from API first
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/companies`);
      if (res.data && res.data.length > 0) {
        setCompanyList(res.data);
      } else {
        // If no data from API, use dummy data
        setCompanyList(dummyCompanies);
        console.log("Using dummy companies data");
      }
    } catch (error) {
      // If API fails, use dummy data for demonstration
      console.log("API failed, using dummy data");
      setCompanyList(dummyCompanies);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  }, []);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate days remaining
  const getDaysRemaining = (expiryDate) => {
    if (!expiryDate) return { days: null, status: "none" };

    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { days: Math.abs(diffDays), status: "expired" };
    } else if (diffDays <= 30) {
      return { days: diffDays, status: "warning" };
    } else {
      return { days: diffDays, status: "good" };
    }
  };

  // Handlers
  const handleAddCompany = () => {
    setIsSliderOpen(true);
    setIsEdit(false);
    setEditId(null);
    setCompanyName("");
    setAddress("");
    setPhone("");
    setEmail("");
    setWebsite("");
    setRenewable(true);
    setExpiryDate(null);
    setImage(null);
    setImagePreview(null);
  };

  // Save or Update Company
  const handleSave = async () => {
    if (!companyName || !email) {
      toast.error("Company Name and Email are required");
      return;
    }

    const formData = new FormData();
    formData.append("companyName", companyName);
    formData.append("address", address);
    formData.append("phone", phone);
    formData.append("email", email);
    formData.append("website", website);
    formData.append("renewable", renewable);
    if (expiryDate) {
      formData.append("expiryDate", expiryDate.toISOString());
    }

    if (image) {
      formData.append("companyImage", image);
    }

    console.log("Form Data", [...formData.entries()]);

    try {
      const headers = {
        Authorization: `Bearer ${userInfo?.token || "dummy-token"}`,
        "Content-Type": "multipart/form-data",
      };

      if (isEdit && editId) {
        // For dummy data, update locally
        const updatedCompany = {
          _id: editId,
          companyName,
          address,
          phone,
          email,
          website,
          renewable,
          expiryDate: expiryDate ? expiryDate.toISOString() : null,
          companyImage: imagePreview ? { url: imagePreview } : { url: `https://ui-avatars.com/api/?name=${encodeURIComponent(companyName)}&background=4f46e5&color=fff&size=100` }
        };

        setCompanyList(companyList.map(company =>
          company._id === editId ? updatedCompany : company
        ));
        toast.success("Company updated successfully");
      } else {
        // For dummy data, add new company locally
        const newCompany = {
          _id: `company-${Date.now()}`,
          companyName,
          address,
          phone,
          email,
          website,
          renewable,
          expiryDate: expiryDate ? expiryDate.toISOString() : null,
          companyImage: imagePreview ? { url: imagePreview } : { url: `https://ui-avatars.com/api/?name=${encodeURIComponent(companyName)}&background=4f46e5&color=fff&size=100` }
        };

        setCompanyList([newCompany, ...companyList]);
        toast.success("Company added successfully");
      }

      reState();
    } catch (error) {
      console.error(error);
      toast.error(`❌ ${isEdit ? "Update" : "Add"} Company failed`);
    }
  };

  // Reset state
  const reState = () => {
    setIsSliderOpen(false);
    setIsEdit(false);
    setEditId(null);
    setCompanyName("");
    setAddress("");
    setPhone("");
    setEmail("");
    setWebsite("");
    setRenewable(true);
    setExpiryDate(null);
    setImage(null);
    setImagePreview(null);
  };

  // Edit Company
  const handleEdit = (company) => {
    setIsEdit(true);
    setEditId(company._id);
    setCompanyName(company.companyName || "");
    setAddress(company.address || "");
    setPhone(company.phone || "");
    setEmail(company.email || "");
    setWebsite(company.website || "");
    setRenewable(company.renewable !== undefined ? company.renewable : true);
    setExpiryDate(company.expiryDate ? new Date(company.expiryDate) : null);
    setImagePreview(company?.companyImage?.url || "");
    setImage(null);
    setIsSliderOpen(true);
  };

  // Delete Company
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
            setCompanyList(companyList.filter((company) => company._id !== id));
            swalWithTailwindButtons.fire(
              "Deleted!",
              "Company deleted successfully.",
              "success"
            );
          } catch (error) {
            console.error("Delete error:", error);
            swalWithTailwindButtons.fire(
              "Error!",
              "Failed to delete company.",
              "error"
            );
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithTailwindButtons.fire(
            "Cancelled",
            "Company is safe 🙂",
            "error"
          );
        }
      });
  };

  // Image Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove Image
  const removeImage = () => {
    setImage(null);
    setImagePreview("");
  };

  // Get status badge class
  const getStatusBadgeClass = (renewable, expiryDate) => {
    if (!renewable) return "bg-gray-100 text-gray-800";

    const { status } = getDaysRemaining(expiryDate);
    switch (status) {
      case "expired":
        return "bg-red-100 text-red-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "good":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get status text
  const getStatusText = (renewable, expiryDate) => {
    if (!renewable) return "Non-Renewable";

    const { days, status } = getDaysRemaining(expiryDate);
    switch (status) {
      case "expired":
        return `Expired ${days} days ago`;
      case "warning":
        return `${days} days remaining`;
      case "good":
        return `${days} days remaining`;
      default:
        return "Active";
    }
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
          <p className="mt-4 text-gray-600">Loading companies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <FaBuilding className="text-newPrimary w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold text-newPrimary">Companies</h1>
            <p className="text-gray-500 text-sm">Manage your companies and their details</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-newPrimary/80 transition-colors flex items-center gap-2"
            onClick={handleAddCompany}
          >
            + Add Company
          </button>
        </div>
      </div>

      {/* Companies Table */}
      <div className="rounded-xl shadow-lg p-6 border border-gray-200 w-full overflow-hidden bg-white">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="min-w-[1200px]">
            {/* Table Headers */}
            <div className="grid grid-cols-[0.5fr_0.7fr_1fr_1.5fr_1fr_1fr_1fr_1fr_0.8fr] gap-4 bg-gradient-to-r from-gray-50 to-gray-100 py-4 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200 rounded-t-lg">
              <div>Sr#</div>
              <div>Logo</div>
              <div>Company Name</div>
              <div>Address</div>
              <div>Phone</div>
              <div>Email</div>
              <div>Website</div>
              <div>Status</div>
              <div className="text-right">Actions</div>
            </div>

            {/* Companies List */}
            <div className="flex flex-col">
              {currentItems.map((company, index) => {
                const { days, status } = getDaysRemaining(company.expiryDate);
                const expiryDateFormatted = company.expiryDate ? formatDate(company.expiryDate) : "N/A";

                return (
                  <div
                    key={company._id}
                    className={`grid grid-cols-[0.5fr_0.7fr_1fr_1.5fr_1fr_1fr_1fr_1fr_0.8fr] items-center gap-4 px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                      }`}
                  >
                    {/* Serial Number */}
                    <div className="text-sm font-medium text-gray-900">
                      {startIndex + index + 1}
                    </div>

                    {/* Logo */}
                    <div className="flex items-center">
                      <div className="relative">
                        <img
                          src={company.companyImage?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(company.companyName)}&background=4f46e5&color=fff&size=40`}
                          alt={company.companyName}
                          className="w-10 h-10 object-cover rounded-lg border border-gray-200 shadow-sm"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(company.companyName)}&background=4f46e5&color=fff&size=40`;
                          }}
                        />
                        {company.renewable && status === "warning" && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 border-2 border-white rounded-full animate-pulse"></div>
                        )}
                        {company.renewable && status === "expired" && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                    </div>

                    {/* Company Name */}
                    <div>
                      <div className="text-sm font-semibold text-gray-900 truncate">
                        {company.companyName}
                      </div>
                      {company.expiryDate && (
                        <div className="text-xs text-gray-500 mt-1">
                          Expires: {expiryDateFormatted}
                        </div>
                      )}
                    </div>

                    {/* Address */}
                    <div className="text-sm text-gray-600 truncate" title={company.address}>
                      {company.address || "N/A"}
                    </div>

                    {/* Phone */}
                    <div className="text-sm text-gray-600 font-mono">
                      {company.phone || "N/A"}
                    </div>

                    {/* Email */}
                    <div className="text-sm text-gray-600 truncate" title={company.email}>
                      {company.email}
                    </div>

                    {/* Website */}
                    <div className="text-sm text-blue-600 hover:text-blue-800 truncate">
                      {company.website ? (
                        <a
                          href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                          title={company.website}
                        >
                          {company.website.replace(/^https?:\/\//, '').replace(/\/$/, '').substring(0, 20)}
                          {company.website.length > 20 ? '...' : ''}
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </div>

                    {/* Status */}
                    <div className="text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(company.renewable, company.expiryDate)}`}>
                        {getStatusText(company.renewable, company.expiryDate)}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 justify-end">
                      {/* EDIT ICON */}
                      <button
                        onClick={() => handleEdit(company)}
                        className="text-blue-600 hover:bg-blue-100 bg-blue-50 p-2 rounded-md transition"
                      >
                        <FiEdit3 className="w-4 h-4" />
                      </button>
                      {/* DELETE ICON */}
                      <button
                        onClick={() => handleDelete(company._id)}
                        className="text-red-600 hover:bg-red-100 bg-red-50 p-2 rounded-md transition"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        {/* <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
              <div className="text-sm text-blue-600 font-medium">Total Companies</div>
              <div className="text-2xl font-bold text-blue-700">{companyList.length}</div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
              <div className="text-sm text-green-600 font-medium">Active Licenses</div>
              <div className="text-2xl font-bold text-green-700">
                {companyList.filter(c => c.renewable && getDaysRemaining(c.expiryDate).status === 'good').length}
              </div>
            </div>
            <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-xl border border-yellow-200">
              <div className="text-sm text-yellow-600 font-medium">Expiring Soon</div>
              <div className="text-2xl font-bold text-yellow-700">
                {companyList.filter(c => c.renewable && getDaysRemaining(c.expiryDate).status === 'warning').length}
              </div>
            </div>
            <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-xl border border-red-200">
              <div className="text-sm text-red-600 font-medium">Expired</div>
              <div className="text-2xl font-bold text-red-700">
                {companyList.filter(c => c.renewable && getDaysRemaining(c.expiryDate).status === 'expired').length}
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
                    <svg className="w-6 h-6 text-newPrimary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-newPrimary">
                      {isEdit ? "Update Company" : "Add New Company"}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {isEdit ? "Update company details" : "Fill in the company information below"}
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

                <div className="grid grid-cols-1 gap-6">
                  {/* Company Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                      Company Name <span className="text-red-500 text-lg">*</span>
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      required
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary bg-white transition-all duration-200 hover:border-gray-400 placeholder:text-gray-400"
                      placeholder="Enter company name"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                      Email Address <span className="text-red-500 text-lg">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <input
                        type="email"
                        value={email}
                        required
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary bg-white transition-all duration-200 hover:border-gray-400"
                        placeholder="company@example.com"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Contact Information */}
              <div className="space-y-6 p-6 border border-gray-300/60 rounded-2xl bg-gray-100/40 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-2 border-b border-gray-300 pb-2">
                  <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
                  <h3 className="text-lg font-semibold text-gray-800">Contact Information</h3>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {/* Address */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary bg-white transition-all duration-200 hover:border-gray-400 resize-none min-h-[80px]"
                      rows="2"
                      placeholder="Enter company address..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    {/* Phone */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Phone Number
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary bg-white transition-all duration-200 hover:border-gray-400"
                          placeholder="+1 (123) 456-7890"
                        />
                      </div>
                    </div>

                    {/* Website */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Website
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                          </svg>
                        </div>
                        <input
                          type="url"
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary bg-white transition-all duration-200 hover:border-gray-400"
                          placeholder="https://example.com"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: License Information */}
              <div className="space-y-6 p-6 border border-gray-300/60 rounded-2xl bg-gray-100/40 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-2 border-b border-gray-300 pb-2">
                  <div className="w-1.5 h-6 bg-purple-500 rounded-full"></div>
                  <h3 className="text-lg font-semibold text-gray-800">License Information</h3>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {/* Renewable */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      License Type
                    </label>
                    <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-700">Renewable License</p>
                        <p className="text-xs text-gray-500">Requires expiry date</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setRenewable(!renewable)}
                        className={`relative inline-flex h-7 w-14 items-center rounded-full transition-all duration-300 ${renewable ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gray-300'
                          }`}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-all duration-300 ${renewable ? 'translate-x-8' : 'translate-x-1'
                            }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Expiry Date */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Expiry Date {renewable && <span className="text-red-500">*</span>}
                    </label>
                    <div className="relative">
                      <DatePicker
                        selected={expiryDate}
                        onChange={(date) => setExpiryDate(date)}
                        minDate={new Date()}
                        disabled={!renewable}
                        dateFormat="MMMM d, yyyy"
                        className={`w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary bg-white transition-all duration-200 ${!renewable ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400'
                          }`}
                        placeholderText={renewable ? "Select expiry date" : "Not applicable"}
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                    {expiryDate && renewable && (
                      <div className="mt-2">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${getDaysRemaining(expiryDate).status === 'expired' ? 'bg-red-100 text-red-800' :
                          getDaysRemaining(expiryDate).status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                          {getDaysRemaining(expiryDate).status === 'expired' ? `Expired ${Math.abs(getDaysRemaining(expiryDate).days)} days ago` :
                            `${getDaysRemaining(expiryDate).days} days remaining`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 4: Company Logo */}
              <div className="space-y-6 p-6 border border-gray-300/60 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-1.5 h-6 bg-green-500 rounded-full"></div>
                  <h3 className="text-lg font-semibold text-gray-800">Company Logo</h3>
                </div>

                <div className={`border-2 ${imagePreview ? 'border-gray-200' : 'border-dashed border-gray-300'
                  } rounded-2xl p-6 transition-all duration-300 hover:border-newPrimary/50 bg-gradient-to-br from-gray-50 to-white`}>
                  {imagePreview ? (
                    <div className="flex flex-col items-center">
                      <div className="relative w-40 h-40 mb-4 group">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-transparent rounded-xl"></div>
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-contain rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-300 bg-white p-3"
                        />
                        <button
                          onClick={removeImage}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-red-600 hover:scale-110 transition-all duration-200 group-hover:opacity-100 opacity-90"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <button
                        onClick={() => document.getElementById('company-logo-upload')?.click()}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg text-sm"
                      >
                        Change Logo
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
                        <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="space-y-4">
                        <p className="text-sm text-gray-600">
                          <label
                            htmlFor="company-logo-upload"
                            className="cursor-pointer font-semibold text-blue-600 hover:text-blue-800 transition-colors duration-200"
                          >
                            Click to upload logo
                          </label>
                          <span className="ml-2 text-gray-500">or drag and drop</span>
                        </p>
                        <p className="text-xs text-gray-400 bg-gray-50 py-2 px-4 rounded-lg inline-block">
                          SVG, PNG, JPG or GIF (max. 10MB)
                        </p>
                      </div>
                    </div>
                  )}
                  <input
                    id="company-logo-upload"
                    name="company-logo-upload"
                    type="file"
                    onChange={handleImageUpload}
                    className="sr-only"
                    accept="image/*"
                  />
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
                        Update Company
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Save Company
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

export default Company;