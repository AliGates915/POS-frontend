import React, { useState, useEffect, useRef, useCallback } from "react";
import { HashLoader } from "react-spinners";
import gsap from "gsap";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import axios from "axios";

const ItemList = () => {
  const [categoryList, setCategoryList] = useState([]);
  const [itemUnitList, setItemUnitList] = useState([]);
  const [manufacturerList, setManufacturerList] = useState([]);
  const [supplierList, setSupplierList] = useState([]);
  const [shelvesList, setShelvesList] = useState([]);

  const [itemList, setItemList] = useState([]);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [itemCategory, setItemCategory] = useState("");
  const [itemName, setItemName] = useState("");
  const [details, setDetails] = useState("");
  const [manufacture, setManufacture] = useState("");
  const [supplier, setSupplier] = useState("");
  const [shelveLocation, setShelveLocation] = useState("");
  const [itemUnit, setItemUnit] = useState("");
  const [perUnit, setPerUnit] = useState("");
  const [purchase, setPurchase] = useState("");
  const [sales, setSales] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [barcode, setBarcode] = useState("");
  const [reorder, setReorder] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const sliderRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [itemType, setItemType] = useState("");
  const [itemKind, setItemKind] = useState("");
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  // Item Type options
  const itemTypeOptions = [
    { value: "raw-material", label: "Raw Material" },
    { value: "finished-goods", label: "Finished Goods" },
    { value: "semi-finished", label: "Semi-Finished" },
    { value: "packaging", label: "Packaging Material" },
    { value: "consumable", label: "Consumable" },
    { value: "capital-goods", label: "Capital Goods" },
  ];

  // Item Kind options
  const itemKindOptions = [
    { value: "stockable", label: "Stockable (Keep in Inventory)" },
    { value: "non-stockable", label: "Non-Stockable" },
    { value: "service", label: "Service" },
    { value: "digital", label: "Digital Product" },
    { value: "expendable", label: "Expendable" },
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



  // Item Detals Fetch 
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/item-details`);
      setItemList(res.data); // store actual categories array
      console.log("Item Details ", res.data);
    } catch (error) {
      console.error("Failed to fetch item details", error);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  }, []);
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // CategoryList Fetch 
  const fetchCategoryList = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/categories/list`);
      setCategoryList(res.data); // store actual categories array
      console.log("Categories ", res.data);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  }, []);
  useEffect(() => {
    fetchCategoryList();
  }, [fetchCategoryList]);

  // Item Unit List Fetch 
  const fetchItemUnitList = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/item-unit`);
      setItemUnitList(res.data); // store actual categories array
      console.log("Item Unit ", res.data);
    } catch (error) {
      console.error("Failed to fetch item unit", error);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  }, []);
  useEffect(() => {
    fetchItemUnitList();
  }, [fetchItemUnitList]);

  // Manufacturer List Fetch 
  const fetchManufacturerList = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/manufacturers/list`);
      setManufacturerList(res.data); // store actual categories array
      console.log("Manufacturer ", res.data);
    } catch (error) {
      console.error("Failed to fetch Manufacturer", error);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  }, []);
  useEffect(() => {
    fetchManufacturerList();
  }, [fetchManufacturerList]);

  // Supplier List Fetch 
  const fetchSupplierList = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/suppliers/list`);
      setSupplierList(res.data); // store actual categories array
      console.log("Supplier ", res.data);
    } catch (error) {
      console.error("Failed to fetch Supplier", error);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  }, []);
  useEffect(() => {
    fetchSupplierList();
  }, [fetchSupplierList]);

  // Shelves List Fetch 
  const fetchShelvesList = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/shelves`);
      setShelvesList(res.data); // store actual categories array
      console.log("Shelves ", res.data);
    } catch (error) {
      console.error("Failed to fetch Shelves", error);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  }, []);
  useEffect(() => {
    fetchShelvesList();
  }, [fetchShelvesList]);





  // Handlers
  const handleAddItem = () => {
    setIsSliderOpen(true);
    setIsEdit(false);
    setEditId(null);
    setItemCategory("");
    setItemName("");
    setDetails("");
    setManufacture("");
    setSupplier("");
    setShelveLocation("");
    setItemUnit("");
    setPerUnit("");
    setPurchase("");
    setSales("");
    setStock("");
    setPrice("");
    setBarcode("");
    setReorder("");
    setEnabled(true);
    setImage(null);
    setImagePreview(null);
    setItemType("");
    setItemKind("");
  };

  // Save or Update Item
  const handleSave = async () => {
    const formData = new FormData();

    formData.append("itemCategory", itemCategory);
    formData.append("itemName", itemName);
    formData.append("details", details);
    formData.append("manufacturer", manufacture);
    formData.append("supplier", supplier);
    formData.append("shelveLocation", shelveLocation);
    formData.append("itemUnit", itemUnit);
    formData.append("perUnit", parseInt(perUnit) || 0);
    formData.append("purchase", parseFloat(purchase) || 0);
    formData.append("price", parseFloat(sales) || 0);
    formData.append("stock", parseInt(stock) || 0);
    formData.append("labelBarcode", barcode);
    formData.append("reorder", parseInt(reorder) || 0);
    formData.append("isEnable", enabled);
    formData.append("itemType", itemType);
    formData.append("itemKind", itemKind);

    if (image) {
      formData.append("itemImage", image); // ✅ append actual file, not preview
    }

    console.log("Form Data", [...formData.entries()]);

    try {
      const headers = {
        Authorization: `Bearer ${userInfo.token}`,
        "Content-Type": "multipart/form-data",
      };

      if (isEdit && editId) {
        await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/item-details/${editId}`,
          formData,
          { headers }
        );
        toast.success("Item Details Updated successfully");
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/item-details`,
          formData,
          { headers }
        );
        toast.success("Item Details Added successfully");
      }

      reState();
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error(`❌ ${isEdit ? "Update" : "Add"} Item Unit failed`);
    }
  };


  // Set All States Null
  const reState = () => {
    setIsSliderOpen(false);
    setIsEdit(false);
    setEditId(null);
    setItemCategory('')
    setManufacture('');
    setItemName("");
    setDetails("");
    setSupplier("");
    setShelveLocation("");
    setItemUnit("");
    setPerUnit("");
    setPurchase("");
    setSales("");
    setStock("");
    setPrice("");
    setBarcode("");
    setReorder("");
    setEnabled(false);
    setImagePreview("");
    setImage(null);
    setItemType("");
    setItemKind("");
  }
  // Edit Item
  const handleEdit = (item) => {
    console.log("Item", item);

    setIsEdit(true);
    setEditId(item._id);

    // Dropdowns ke liye _id set karo
    setItemCategory(item?.itemCategory?._id || "");
    setManufacture(item?.manufacturer?._id || "");
    setSupplier(item?.supplier?._id || "");
    setShelveLocation(item?.shelveLocation?._id || "");
    setItemUnit(item?.itemUnit?._id || "");

    // Normal fields
    setItemName(item.itemName || "");
    setDetails(item.details || "");
    setPerUnit(item.perUnit ? item.perUnit.toString() : "");
    setPurchase(item.purchase ? item.purchase.toString() : "");
    setSales(item.sales ? item.sales.toString() : "");
    setStock(item.stock ? item.stock.toString() : "");
    setPrice(item.price ? item.price.toString() : "");
    setBarcode(item.labelBarcode || "");
    setReorder(item.reorder ? item.reorder.toString() : "");

    // Set new fields from backend data
    setItemType(item.itemType || "");
    setItemKind(item.itemKind || "");

    // Enable/Disable
    setEnabled(item.isEnable !== undefined ? item.isEnable : true);

    // Image
    setImagePreview(item?.itemImage?.url || "");
    setImage(null);

    setIsSliderOpen(true);
  };

  // Delete Item
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

            await axios.delete(
              `${import.meta.env.VITE_API_BASE_URL}/item-details/${id}`,
              {
                headers: {
                  Authorization: `Bearer ${userInfo.token}` // if you’re using auth
                }
              }
            );
            setItemList(itemList.filter((item) => item._id !== id));
            swalWithTailwindButtons.fire(
              "Deleted!",
              "Item deleted successfully.",
              "success"
            );
          } catch (error) {
            console.error("Delete error:", error);
            swalWithTailwindButtons.fire(
              "Error!",
              "Failed to delete item.",
              "error"
            );
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithTailwindButtons.fire(
            "Cancelled",
            "Item is safe 🙂",
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

  // Capitalize First Letter
  function capitalizeFirstLetter(value) {
    if (!value) return "";
    const str = String(value); // ensure it's a string
    return str.charAt(0).toUpperCase() + str.slice(1);
  }


  // Show loading spinner
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <HashLoader height="150" width="150" radius={1} color="#84CF16" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-newPrimary">Items List</h1>
          <p className="text-gray-500 text-sm">Manage your items details</p>
        </div>
        <button
          className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-newPrimary/80 transition-colors"
          onClick={handleAddItem}
        >
          + Add Item
        </button>
      </div>

      {/* Item Table */}
      <div className="rounded-xl shadow-lg p-6 border border-gray-200 w-full overflow-hidden bg-white">
        <div className="overflow-x-auto scrollbar-hide">
          {/* Table wrapper with minimum width */}
          <div className="min-w-[1000px]">
            {/* Table Headers */}
            <div className="grid grid-cols-[1fr_2fr_1fr_1fr_1fr_1.5fr_0.8fr] gap-4 bg-gradient-to-r from-gray-50 to-gray-100 py-4 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200 rounded-t-lg">
              <div>Item Category</div>
              <div>Item Name</div>
              <div className="text-right">Purchase</div>
              <div className="text-right">Sales</div>
              <div className="text-right">Stock</div>
              <div>Barcode</div>
              {userInfo?.isAdmin && <div className="text-right">Actions</div>}
            </div>

            {/* Items in Table */}
            <div className="flex flex-col mb-14">
              {itemList.map((item, index) => (
                <div
                  key={item._id}
                  className={`grid grid-cols-[1fr_2fr_1fr_1fr_1fr_1.5fr_0.8fr] items-center gap-4 px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                    }`}
                >
                  {/* Item Category */}
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={item.itemImage?.url}
                        alt="Product Icon"
                        className="w-8 h-8 object-cover rounded-lg border border-gray-200 shadow-sm"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.itemName)}&background=4f46e5&color=fff&size=32`;
                        }}
                      />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 border-2 border-white rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {capitalizeFirstLetter(item?.itemCategory?.categoryName)}
                    </span>
                  </div>

                  {/* Item Name */}
                  <div className="text-sm text-gray-600 font-medium truncate">{item.itemName}</div>

                  {/* Purchase */}
                  <div className="text-sm font-semibold text-gray-900 text-right">
                    ${parseFloat(item.purchase).toFixed(2)}
                  </div>

                  {/* Sales */}
                  <div className="text-sm font-semibold text-green-600 text-right">
                    ${parseFloat(item.price).toFixed(2)}
                  </div>

                  {/* Stock */}
                  <div className="text-sm font-semibold text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.stock > 20
                      ? 'bg-green-100 text-green-800'
                      : item.stock > 5
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                      }`}>
                      {item.stock}
                    </span>
                  </div>

                  {/* Barcode */}
                  <div className="text-sm font-mono text-gray-600 bg-gray-100 px-3 py-1 rounded-md border border-gray-200 truncate">
                    {item.labelBarcode.slice(0, 12)}
                  </div>

                  {/* Actions */}
                  {userInfo?.isAdmin && (
                    <div className="text-right relative group">
                      <button className="text-gray-400 hover:text-gray-700 transition-colors p-1 rounded-md hover:bg-gray-200">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                      <div className="absolute right-0 top-8 w-32 bg-white border border-gray-200 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible pointer-events-none group-hover:pointer-events-auto transition-all duration-200 z-50 flex flex-col py-1">
                        <button
                          onClick={() => handleEdit(item)}
                          className="w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 text-blue-600 flex items-center gap-2 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="w-full text-left px-4 py-2.5 text-sm hover:bg-red-50 text-red-600 flex items-center gap-2 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
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
      <div
        className={`fixed inset-0 flex items-center justify-center z-50 transition-all duration-300 ${isSliderOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-gray-600/70 backdrop-blur-0 transition-opacity duration-300 ${isSliderOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => {
            setIsSliderOpen(false);
            setIsEdit(false);
            setEditId(null);
            setItemCategory("");
            setItemName("");
            setDetails("");
            setManufacture("");
            setSupplier("");
            setShelveLocation("");
            setItemUnit("");
            setPerUnit("");
            setPurchase("");
            setSales("");
            setStock("");
            setPrice("");
            setBarcode("");
            setReorder("");
            setEnabled(true);
            setImage(null);
            setImagePreview(null);
          }}
        />

        {/* Slider Content */}
        <div
          ref={sliderRef}
          className={`relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl h-[90vh] overflow-hidden transform transition-all duration-500 ease-out ${isSliderOpen ? "translate-y-0 scale-100" : "translate-y-8 scale-95"}`}
        >
          {/* Header with gradient */}
          <div className="sticky top-0 z-10 bg-gray-200 -bottom-10 px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                    <svg className="w-6 h-6 text-newPrimary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-newPrimary">
                      {isEdit ? "Update Item" : "Add New Item"}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {isEdit ? "Update existing item details" : "Fill in the item information below"}
                    </p>
                  </div>
                </div>
              </div>
              <button
                className="p-1 hover:bg-white/20 bg-white/10 rounded-xl transition-all duration-300 group backdrop-blur-sm hover:scale-105"
                onClick={() => {
                  setIsSliderOpen(false);
                  setIsEdit(false);
                  setEditId(null);
                  setItemCategory("");
                  setItemName("");
                  setDetails("");
                  setManufacture("");
                  setSupplier("");
                  setShelveLocation("");
                  setItemUnit("");
                  setPerUnit("");
                  setPurchase("");
                  setSales("");
                  setStock("");
                  setPrice("");
                  setBarcode("");
                  setReorder("");
                  setEnabled(true);
                  setImage(null);
                  setImagePreview(null);
                }}
              >
                <svg className="w-6 h-6 text-white bg-newPrimary rounded-lg group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="px-8 py-6 overflow-y-scroll h-[calc(90vh-88px)] scrollbar-hide">
            <div className="space-y-8">
              {/* Section 1: Basic Information */}
              <div className="space-y-6 p-6 border border-gray-300/60 rounded-2xl bg-gray-100/40 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-2 border-b border-gray-300 pb-2">
                  <div className="w-1.5 h-6 bg-newPrimary rounded-full"></div>
                  <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {/* Item Category */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                      Item Category <span className="text-red-500 text-lg">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={itemCategory}
                        required
                        onChange={(e) => setItemCategory(e.target.value)}
                        className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary bg-white transition-all duration-200 hover:border-gray-400 appearance-none"
                      >
                        <option value="">Select Category</option>
                        {categoryList.map((category) => (
                          <option key={category._id} value={category._id}>
                            {category.categoryName}
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

                  {/* Item Type */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                      Item Type <span className="text-red-500 text-lg">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={itemType}
                        required
                        onChange={(e) => setItemType(e.target.value)}
                        className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary bg-white transition-all duration-200 hover:border-gray-400 appearance-none"
                      >
                        <option value="">Select Item Type</option>
                        {itemTypeOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
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

                <div className="grid grid-cols-2 gap-6">
                  {/* Item Kind */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                      Item Kind <span className="text-red-500 text-lg">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={itemKind}
                        required
                        onChange={(e) => setItemKind(e.target.value)}
                        className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary bg-white transition-all duration-200 hover:border-gray-400 appearance-none"
                      >
                        <option value="">Select Item Kind</option>
                        {itemKindOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
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

                  {/* Item Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                      Item Name <span className="text-red-500 text-lg">*</span>
                    </label>
                    <input
                      type="text"
                      value={itemName}
                      required
                      onChange={(e) => setItemName(e.target.value)}
                      className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary bg-white transition-all duration-200 hover:border-gray-400 placeholder:text-gray-400"
                      placeholder="Enter item name"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Supplier & Pricing */}
              <div className="space-y-6 p-6 border border-gray-300/60 rounded-2xl bg-gray-100/40 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-2 border-b border-gray-300 pb-2">
                  <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
                  <h3 className="text-lg font-semibold text-gray-800">Supplier & Pricing</h3>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {/* Manufacture */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                      Manufacturer <span className="text-red-500 text-lg">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={manufacture}
                        required
                        onChange={(e) => setManufacture(e.target.value)}
                        className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary bg-white transition-all duration-200 hover:border-gray-400 appearance-none"
                      >
                        <option value="">Select Manufacturer</option>
                        {manufacturerList.map((manufacture) => (
                          <option key={manufacture._id} value={manufacture._id}>
                            {manufacture.manufacturerName}
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

                  {/* Supplier */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                      Supplier <span className="text-red-500 text-lg">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={supplier}
                        required
                        onChange={(e) => setSupplier(e.target.value)}
                        className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary bg-white transition-all duration-200 hover:border-gray-400 appearance-none"
                      >
                        <option value="">Select Supplier</option>
                        {supplierList.map((supplier) => (
                          <option key={supplier._id} value={supplier._id}>
                            {supplier.supplierName}
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

                <div className="grid grid-cols-2 gap-6">
                  {/* Purchase */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                      Purchase Price <span className="text-red-500 text-lg">*</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="text-gray-500 font-medium">$</span>
                      </div>
                      <input
                        type="number"
                        value={purchase}
                        required
                        onChange={(e) => setPurchase(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary bg-white transition-all duration-200 hover:border-gray-400"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                      />
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <span className="text-gray-400 text-sm">USD</span>
                      </div>
                    </div>
                  </div>

                  {/* Sales */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                      Sales <span className="text-red-500 text-lg">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="text-gray-500 font-medium">$</span>
                      </div>
                      <input
                        type="number"
                        value={sales}
                        required
                        onChange={(e) => setSales(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary bg-white transition-all duration-200 hover:border-gray-400"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                      />
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <span className="text-gray-400 text-sm">USD</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {/* Stock */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                      Opening Stock <span className="text-red-500 text-lg">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={stock}
                        required
                        onChange={(e) => setStock(e.target.value)}
                        className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary bg-white transition-all duration-200 hover:border-gray-400"
                        placeholder="0"
                        min="0"
                      />
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <span className="text-gray-400 text-sm">units</span>
                      </div>
                    </div>
                  </div>

                  {/* Barcode */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                      Barcode <span className="text-red-500 text-lg">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={barcode}
                        required
                        onChange={(e) => setBarcode(e.target.value)}
                        className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary bg-white transition-all duration-200 hover:border-gray-400 font-mono"
                        placeholder="BAR1234567890"
                      />
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Description & Details */}
              <div className="space-y-6 p-6 border border-gray-300/60 rounded-2xl bg-gray-100/40 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-2 border-b border-gray-300 pb-2">
                  <div className="w-1.5 h-6 bg-purple-500 rounded-full"></div>
                  <h3 className="text-lg font-semibold text-gray-800">Description & Details</h3>
                </div>

                {/* Details */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <div className="relative">
                    <textarea
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary bg-white transition-all duration-200 hover:border-gray-400 resize-none min-h-[120px]"
                      rows="3"
                      placeholder="Enter item description..."
                    />
                    <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                      {details.length}/500
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {/* Shelve Location */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                      Shelve Location <span className="text-red-500 text-lg">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={shelveLocation}
                        required
                        onChange={(e) => setShelveLocation(e.target.value)}
                        className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary bg-white transition-all duration-200 hover:border-gray-400 appearance-none"
                      >
                        <option value="">Select Location</option>
                        {shelvesList.map((shelves) => (
                          <option key={shelves._id} value={shelves._id}>
                            {shelves.shelfNameCode}
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

                  {/* Item Unit */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                      Item Unit <span className="text-red-500 text-lg">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={itemUnit}
                        required
                        onChange={(e) => setItemUnit(e.target.value)}
                        className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary bg-white transition-all duration-200 hover:border-gray-400 appearance-none"
                      >
                        <option value="">Select Unit</option>
                        {itemUnitList.map((item) => (
                          <option key={item._id} value={item._id}>
                            {item.unitName}
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

                <div className="grid grid-cols-2 gap-6">
                  {/* Per Unit */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Per Unit
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={perUnit}
                        onChange={(e) => setPerUnit(e.target.value)}
                        className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary bg-white transition-all duration-200 hover:border-gray-400"
                        placeholder="0"
                        min="0"
                      />
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <span className="text-gray-400 text-sm">per pack</span>
                      </div>
                    </div>
                  </div>

                  {/* Reorder */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Reorder
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={reorder}
                        onChange={(e) => setReorder(e.target.value)}
                        className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary bg-white transition-all duration-200 hover:border-gray-400"
                        placeholder="0"
                        min="0"
                      />
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <span className="text-gray-400 text-sm">units</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 4: Image Upload */}
              <div className="space-y-6 p-6 border border-gray-300/60 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-2 ">
                  <div className="w-1.5 h-6 bg-green-500 rounded-full"></div>
                  <h3 className="text-lg font-semibold text-gray-800">Product Image</h3>
                </div>

                <div className={`border-2 ${imagePreview ? 'border-gray-200' : 'border-dashed border-gray-300'} rounded-2xl p-8 transition-all duration-300 hover:border-newPrimary/50 bg-gradient-to-br from-gray-50 to-white`}>
                  {imagePreview ? (
                    <div className="flex flex-col items-center">
                      <div className="relative w-56 h-56 mb-6 group">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-transparent rounded-xl"></div>
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-300"
                        />
                        <button
                          onClick={removeImage}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-9 h-9 flex items-center justify-center shadow-lg hover:bg-red-600 hover:scale-110 transition-all duration-200 group-hover:opacity-100 opacity-90"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <button
                        onClick={() => document.getElementById('file-upload')?.click()}
                        className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
                      >
                        Change Image
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                        <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="space-y-4">
                        <p className="text-sm text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="cursor-pointer font-semibold text-blue-600 hover:text-blue-800 transition-colors duration-200"
                          >
                            Click to upload
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
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    onChange={handleImageUpload}
                    className="sr-only"
                    accept="image/*"
                  />
                </div>
              </div>

              {/* Section 5: Status & Actions */}
              <div className="space-y-6 p-6 border border-gray-300/60 rounded-2xl bg-gray-100/40">
                <div className="flex items-center gap-3 mb-2 border-b border-gray-300 pb-2">
                  <div className="w-1.5 h-6 bg-yellow-500 rounded-full"></div>
                  <h3 className="text-lg font-semibold text-gray-800">Status</h3>
                </div>

                {/* Enable / Disable */}
                <div className="flex items-center justify-between p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
                  <div className="space-y-1">
                    <label className="block text-sm font-semibold text-gray-700">
                      Item Status
                    </label>
                    <p className="text-sm text-gray-500">
                      {enabled ? "Active • Visible to customers" : "Disabled • Hidden from customers"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-medium ${enabled ? 'text-green-600' : 'text-gray-500'}`}>
                      {enabled ? 'Active' : 'Inactive'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setEnabled(!enabled)}
                      className={`relative inline-flex h-8 w-16 items-center rounded-full transition-all duration-300 ${enabled ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gray-300'}`}
                    >
                      <span
                        className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-all duration-300 ${enabled ? 'translate-x-9' : 'translate-x-1'}`}
                      />
                    </button>
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
                        Update Item
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Save Item
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

export default ItemList;