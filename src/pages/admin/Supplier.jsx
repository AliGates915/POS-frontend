import React, { useState, useEffect, useRef } from "react";
import { PuffLoader } from "react-spinners";
import gsap from "gsap";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const SupplierList = () => {
  const [supplierList, setSupplierList] = useState([]);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [supplierName, setSupplierName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [productsSupplied, setProductsSupplied] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("");
  const [status, setStatus] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");

  const [designation, setDesignation] = useState("");
  const [ntn, setNtn] = useState("");
  const [gst, setGst] = useState("");
  const [creditLimit, setCreditLimit] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const sliderRef = useRef(null);
  const [loading, setLoading] = useState(true);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  // Slider animation
  useEffect(() => {
    if (isSliderOpen && sliderRef.current) {
      gsap.fromTo(
        sliderRef.current,
        { x: "100%", opacity: 0 },
        { x: "0%", opacity: 1, duration: 1.2, ease: "expo.out" }
      );
    }
  }, [isSliderOpen]);

  // Initialize supplier list with static data
  useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/suppliers`);
      setSupplierList(res.data); // store actual categories array
      console.log("Suppliers", res.data);
    } catch (error) {
      console.error("Failed to fetch products or categories", error);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);

  // Handlers
  const handleAddSupplier = () => {
    setIsSliderOpen(true);
    setIsEdit(false);
    setEditId(null);
    setSupplierName("");
    setContactPerson("");
    setEmail("");
    setAddress("");
    setProductsSupplied("");
    setPaymentTerms("");
    setPhoneNumber("");
    setDesignation("");
    setNtn("");
    setGst("");
    setCreditLimit("");
    setStatus(true);
  };

  // Save or Update Supplier
  const handleSave = async () => {
    if (paymentTerms === "CreditCard" && status && (!creditLimit || creditLimit > 5000000)) {
      toast.error("❌ Credit limit is required and must not exceed 50 lac");
      return;
    }

    const formData = {
      supplierName,
      contactPerson,
      email,
      address,
      phoneNumber,
      designation,
      ntn,
      gst,
      paymentTerms,
      creditLimit: paymentTerms === "CreditCard" && status ? creditLimit : undefined,
      status,
    };

    try {
      const { token } = userInfo || {};
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      if (isEdit && editId) {
        setSupplierList(
          supplierList.map((s) =>
            s._id === editId ? { ...s, ...formData } : s
          )
        );
        toast.success("✅ Supplier updated successfully");
      } else {
        const newSupplier = {
          ...formData,
          _id: String(supplierList.length + 1),
        };
        setSupplierList([...supplierList, newSupplier]);
        toast.success("✅ Supplier added successfully");
      }

      setSupplierName("");
      setContactPerson("");
      setEmail("");
      setAddress("");
      setProductsSupplied("");
      setPaymentTerms("");
      setPhoneNumber("");
      setDesignation("");
      setNtn("");
      setGst("");
      setCreditLimit("");
      setStatus(true);
      setIsSliderOpen(false);
      setIsEdit(false);
      setEditId(null);
    } catch (error) {
      console.error(error);
      toast.error(`❌ ${isEdit ? "Update" : "Add"} supplier failed`);
    }
  };

  // Edit Supplier
  const handleEdit = (supplier) => {
    setIsEdit(true);
    setEditId(supplier._id);
    setSupplierName(supplier.supplierName);
    setContactPerson(supplier.contactPerson);
    setEmail(supplier.email);
    setAddress(supplier.address);
    setPhoneNumber(supplier.phoneNumber || "");
    setDesignation(supplier.designation || "");
    setNtn(supplier.ntn || "");
    setGst(supplier.gst || "");
    setPaymentTerms(supplier.paymentTerms || "");
    setCreditLimit(supplier.creditLimit || "");
    setStatus(supplier.status);
    setIsSliderOpen(true);
  };

  // Delete Supplier
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
            setSupplierList(supplierList.filter((s) => s._id !== id));
            swalWithTailwindButtons.fire(
              "Deleted!",
              "Supplier deleted successfully.",
              "success"
            );
          } catch (error) {
            console.error("Delete error:", error);
            swalWithTailwindButtons.fire(
              "Error!",
              "Failed to delete supplier.",
              "error"
            );
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithTailwindButtons.fire(
            "Cancelled",
            "Supplier is safe 🙂",
            "error"
          );
        }
      });
  };

  // Show loading spinner
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <PuffLoader height="150" width="150" radius={1} color="#00809D" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-newPrimary">Suppliers List</h1>
          <p className="text-gray-500 text-sm">Manage your supplier details</p>
        </div>
        <button
          className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-newPrimary/90"
          onClick={handleAddSupplier}
        >
          + Add Supplier
        </button>
      </div>

      {/* Supplier Table */}
      <div className="rounded-xl shadow border border-gray-100">
        <div className="table-container max-w-full">
          <div className="w-full">
            {/* Table Headers */}
            <div className="hidden lg:grid grid-cols-[1fr_2fr_1.5fr_2fr_3fr_2fr_2fr_1fr_0.5fr] gap-2 bg-gray-50 py-3 px-4 text-xs font-medium text-gray-500 uppercase rounded-t-lg sticky top-0 z-10">
              <div>Supplier ID</div>
              <div>Supplier Name</div>
              <div>Contact Person</div>
              <div>Email</div>
              <div>Address</div>
              <div>Phone Number</div>
              <div>Payment Terms</div>
              <div>Status</div>
              {userInfo?.isAdmin && <div className="text-center">Actions</div>}
            </div>

            {/* Suppliers in Table */}
            <div className="flex flex-col gap-2">
              {supplierList.map((supplier) => (
                <div
                  key={supplier._id}
                  className="grid grid-cols-[1fr_2fr_1.5fr_2fr_3fr_2fr_2fr_1fr_0.5fr] items-center gap-2 bg-white p-4 rounded-lg border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <div className="text-sm font-medium text-gray-900 truncate">{supplier._id}</div>
                  <div className="text-sm text-gray-500 truncate">{supplier.supplierName}</div>
                  <div className="text-sm text-gray-500 truncate">{supplier.contactPerson}</div>
                  <div className="text-sm text-gray-500 truncate">{supplier.email}</div>
                  <div className="text-sm text-gray-500 truncate">{supplier.address}</div>
                  <div className="text-sm text-gray-500 truncate">{supplier.phoneNumber}</div>
                  <div className="text-sm text-gray-500 truncate">
                    {supplier.paymentTerms}
                    {supplier.paymentTerms === "CreditCard" && supplier.creditLimit ? ` (${supplier.creditLimit})` : ""}
                  </div>
                  <div className="text-sm font-semibold text-center">
                    {supplier.status ? (
                      <span className="text-green-600">Active</span>
                    ) : (
                      <span className="text-red-600">Inactive</span>
                    )}
                  </div>
                  {userInfo?.isAdmin && (
                    <div className="flex justify-center">
                      <div className="relative group">
                        <button className="text-gray-400 hover:text-gray-600 text-xl">⋯</button>
                        <div className="absolute right-0 top-6 w-28 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-300 z-50 flex flex-col">
                          <button
                            onClick={() => handleEdit(supplier)}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-newPrimary/10 text-newPrimary flex items-center gap-2"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(supplier._id)}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-500 flex items-center gap-2"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Slider */}
      {isSliderOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-end z-50">
          <div
            ref={sliderRef}
            className="w-full max-w-md bg-white p-6 h-full overflow-y-auto custom-scrollbar"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-newPrimary">
                {isEdit ? "Update Supplier" : "Add a New Supplier"}
              </h2>
              <button
                className="text-2xl text-gray-500 hover:text-gray-700"
                onClick={() => {
                  setIsSliderOpen(false);
                  setIsEdit(false);
                  setEditId(null);
                  setSupplierName("");
                  setContactPerson("");
                  setEmail("");
                  setAddress("");
                  setProductsSupplied("");
                  setPaymentTerms("");
                  setPhoneNumber("");
                  setDesignation("");
                  setNtn("");
                  setGst("");
                  setCreditLimit("");
                  setStatus(true);
                }}
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium">
                  Supplier Name <span className="text-newPrimary">*</span>
                </label>
                <input
                  type="text"
                  value={supplierName}
                  required
                  onChange={(e) => setSupplierName(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">
                  Phone Number <span className="text-newPrimary">*</span>
                </label>
                <input
                  type="text"
                  value={phoneNumber}
                  required
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="e.g. +1-212-555-1234"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">
                  Email Address <span className="text-newPrimary">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>


              <div>
                <label className="block text-gray-700 font-medium">
                  Contact Person <span className="text-newPrimary">*</span>
                </label>
                <input
                  type="text"
                  value={contactPerson}
                  required
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              

              {/* Mobile Number */}
              
              <div>
                <label className="block text-gray-700 font-medium">
                  Mobile Number <span className="text-newPrimary">*</span>
                </label>
                <input
                  type="text"
                  value={mobileNumber}
                  required
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              
                {/* Address */}
              <div>
                <label className="block text-gray-700 font-medium">
                  Address <span className="text-newPrimary">*</span>
                </label>
                <input
                  type="text"
                  value={address}
                  required
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">
                  Designation <span className="text-newPrimary">*</span>
                </label>
                <input
                  type="text"
                  value={designation}
                  required
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="e.g. Sales Manager"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">
                  NTN <span className="text-newPrimary">*</span>
                </label>
                <input
                  type="text"
                  value={ntn}
                  required
                  onChange={(e) => setNtn(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="e.g. NTN123456789"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">
                  GST <span className="text-newPrimary">*</span>
                </label>
                <input
                  type="text"
                  value={gst}
                  required
                  onChange={(e) => setGst(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="e.g. 27ABCDE1234F1Z5"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">
                  Payment Terms <span className="text-newPrimary">*</span>
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="CreditCard"
                      checked={paymentTerms === "CreditCard"}
                      onChange={(e) => setPaymentTerms(e.target.value)}
                      className="form-radio"
                    />
                    Credit Card
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="Cash"
                      checked={paymentTerms === "Cash"}
                      onChange={(e) => setPaymentTerms(e.target.value)}
                      className="form-radio"
                    />
                    Cash
                  </label>
                </div>
              </div>
              {paymentTerms === "CreditCard" && status && (
                <div>
                  <label className="block text-gray-700 font-medium">
                    Credit Limit (Max 50 Lac) <span className="text-newPrimary">*</span>
                  </label>
                  <input
                    type="number"
                    value={creditLimit}
                    required
                    onChange={(e) => setCreditLimit(e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="Enter credit limit (e.g. 4000000)"
                    max="5000000"
                  />
                </div>
              )}
              <div className="flex items-center gap-3">
                <label className="text-gray-700 font-medium">Status</label>
                <button
                  type="button"
                  onClick={() => setStatus(!status)}
                  className={`w-14 h-7 flex items-center rounded-full p-1 transition-colors duration-300 ${
                    status ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                      status ? "translate-x-7" : "translate-x-0"
                    }`}
                  />
                </button>
                <span>{status ? "Active" : "Inactive"}</span>
              </div>
              <button
                className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-900 w-full"
                onClick={handleSave}
              >
                Save Supplier
              </button>
            </div>
          </div>
        </div>
      )}
      <style jsx>{`
        .table-container {
          max-width: 100%;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #edf2f7;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #a0aec0;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #718096;
        }
        @media (max-width: 1024px) {
          .grid-cols-\[1fr_2fr_1.5fr_2fr_3fr_2fr_2fr_1fr_0.5fr\] {
            grid-template-columns: 1fr 2fr 1.5fr 2fr 2.5fr 1.5fr 1.5fr 1fr 0.5fr;
          }
        }
        @media (max-width: 640px) {
          .grid-cols-\[1fr_2fr_1.5fr_2fr_3fr_2fr_2fr_1fr_0.5fr\] {
            grid-template-columns: 1fr 1.5fr 1fr 1.5fr 2fr 1fr 1fr 0.8fr 0.5fr;
          }
        }
      `}</style>
    </div>
  );
};

export default SupplierList;