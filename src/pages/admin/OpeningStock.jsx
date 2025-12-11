import React, { useState, useEffect, useCallback } from "react";
import { HashLoader } from "react-spinners";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const OpeningStock = () => {
  const [openingStockList, setOpeningStockList] = useState([]);
  const [filteredStockList, setFilteredStockList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // State for editing stock quantity
  const [editingStockId, setEditingStockId] = useState(null);
  const [editingStockValue, setEditingStockValue] = useState("");
  
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  // Dummy data for practice
  const dummyData = [
    {
      srNo: 1,
      id: "item001",
      itemCategory: "Electronics",
      itemType: "finished-goods",
      itemName: "Smartphone X Pro",
      supplier: "TechCorp Inc",
      salesPrice: 999.99,
      purchasePrice: 650.50,
      stockQuantity: 25,
    },
    {
      srNo: 2,
      id: "item002",
      itemCategory: "Electronics",
      itemType: "finished-goods",
      itemName: "Wireless Headphones",
      supplier: "AudioTech Ltd",
      salesPrice: 199.99,
      purchasePrice: 120.75,
      stockQuantity: 48,
    },
    {
      srNo: 3,
      id: "item003",
      itemCategory: "Stationery",
      itemType: "raw-material",
      itemName: "Premium Notebooks",
      supplier: "PaperWorks Co",
      salesPrice: 15.50,
      purchasePrice: 8.25,
      stockQuantity: 120,
    },
    {
      srNo: 4,
      id: "item004",
      itemCategory: "Furniture",
      itemType: "finished-goods",
      itemName: "Ergonomic Office Chair",
      supplier: "ComfortSeat Inc",
      salesPrice: 349.99,
      purchasePrice: 220.00,
      stockQuantity: 12,
    },
    {
      srNo: 5,
      id: "item005",
      itemCategory: "Kitchenware",
      itemType: "finished-goods",
      itemName: "Non-Stick Cookware Set",
      supplier: "KitchenPro Ltd",
      salesPrice: 89.99,
      purchasePrice: 55.30,
      stockQuantity: 35,
    },
    {
      srNo: 6,
      id: "item006",
      itemCategory: "Clothing",
      itemType: "finished-goods",
      itemName: "Premium Cotton T-Shirts",
      supplier: "FashionFabrics",
      salesPrice: 29.99,
      purchasePrice: 12.50,
      stockQuantity: 200,
    },
    {
      srNo: 7,
      id: "item007",
      itemCategory: "Books",
      itemType: "finished-goods",
      itemName: "Best Selling Novel",
      supplier: "BookWorld Publishers",
      salesPrice: 24.99,
      purchasePrice: 14.75,
      stockQuantity: 75,
    },
    {
      srNo: 8,
      id: "item008",
      itemCategory: "Sports",
      itemType: "finished-goods",
      itemName: "Professional Football",
      supplier: "SportGear Co",
      salesPrice: 45.99,
      purchasePrice: 28.50,
      stockQuantity: 30,
    },
    {
      srNo: 9,
      id: "item009",
      itemCategory: "Toys",
      itemType: "finished-goods",
      itemName: "Educational Building Blocks",
      supplier: "KidzPlay Inc",
      salesPrice: 39.99,
      purchasePrice: 22.80,
      stockQuantity: 60,
    },
    {
      srNo: 10,
      id: "item010",
      itemCategory: "Electronics",
      itemType: "finished-goods",
      itemName: "Smart Watch Series 5",
      supplier: "TechCorp Inc",
      salesPrice: 299.99,
      purchasePrice: 180.25,
      stockQuantity: 18,
    },
  ];

  // Fetch opening stock data
  const fetchOpeningStock = useCallback(async () => {
    try {
      setLoading(true);
      
      // For now, use dummy data
      // In production, you would use the API call:
      // const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/item-details`);
      
      // Using dummy data for practice
      const stockData = dummyData;
      
      setOpeningStockList(stockData);
      setFilteredStockList(stockData);
    } catch (error) {
      console.error("Failed to fetch opening stock", error);
      toast.error("Failed to load opening stock data");
      
      // Fallback to dummy data if API fails
      setOpeningStockList(dummyData);
      setFilteredStockList(dummyData);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  }, []);

  // Fetch categories for filter
  const fetchCategories = useCallback(async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/categories/list`);
      setCategoryList(res.data);
    } catch (error) {
      console.error("Failed to fetch categories", error);
      // Fallback dummy categories
      setCategoryList([
        { _id: "cat1", categoryName: "Electronics" },
        { _id: "cat2", categoryName: "Stationery" },
        { _id: "cat3", categoryName: "Furniture" },
        { _id: "cat4", categoryName: "Kitchenware" },
        { _id: "cat5", categoryName: "Clothing" },
        { _id: "cat6", categoryName: "Books" },
        { _id: "cat7", categoryName: "Sports" },
        { _id: "cat8", categoryName: "Toys" },
      ]);
    }
  }, []);

  useEffect(() => {
    fetchOpeningStock();
    fetchCategories();
  }, [fetchOpeningStock, fetchCategories]);

  // Apply filters
  useEffect(() => {
    let filtered = [...openingStockList];

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(item => 
        item.itemCategory.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.itemName.toLowerCase().includes(term) ||
        item.itemCategory.toLowerCase().includes(term) ||
        item.supplier.toLowerCase().includes(term)
      );
    }

    setFilteredStockList(filtered);
  }, [selectedCategory, searchTerm, selectedDate, openingStockList]);

  // Handle click on stock quantity to start editing
  const handleStockClick = (item) => {
    if (userInfo?.isAdmin) {
      setEditingStockId(item.id);
      setEditingStockValue(item.stockQuantity.toString());
    }
  };

  // Handle save for a single stock quantity
  const handleSaveStock = async (itemId) => {
    if (!editingStockValue || isNaN(editingStockValue)) {
      toast.error("Please enter a valid number");
      return;
    }

    const newStockValue = parseInt(editingStockValue);
    if (newStockValue < 0) {
      toast.error("Stock quantity cannot be negative");
      return;
    }

    try {
      setSaving(true);
      
      // Update the item in both lists
      const updatedList = openingStockList.map(item => {
        if (item.id === itemId) {
          return { ...item, stockQuantity: newStockValue };
        }
        return item;
      });

      const updatedFilteredList = filteredStockList.map(item => {
        if (item.id === itemId) {
          return { ...item, stockQuantity: newStockValue };
        }
        return item;
      });

      setOpeningStockList(updatedList);
      setFilteredStockList(updatedFilteredList);
      
      // In production, you would make an API call here:
      // await axios.put(
      //   `${import.meta.env.VITE_API_BASE_URL}/item-details/${itemId}`,
      //   { stock: newStockValue },
      //   { headers: { Authorization: `Bearer ${userInfo?.token}` } }
      // );

      toast.success("Stock quantity updated successfully!");
      
      // Reset editing state
      setEditingStockId(null);
      setEditingStockValue("");
      
    } catch (error) {
      console.error("Failed to update stock", error);
      toast.error("Failed to update stock quantity");
    } finally {
      setSaving(false);
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingStockId(null);
    setEditingStockValue("");
  };

  // Handle key press in edit input
  const handleKeyPress = (e, itemId) => {
    if (e.key === 'Enter') {
      handleSaveStock(itemId);
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Capitalize first letter
  const capitalizeFirstLetter = (string) => {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // Reset filters
  const handleResetFilters = () => {
    setSelectedCategory("all");
    setSearchTerm("");
    setSelectedDate(new Date().toISOString().split('T')[0]);
  };

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
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-newPrimary">Opening Stock</h1>
          <p className="text-gray-500 text-sm">Manage initial stock quantities and prices</p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200">
          <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
          <h3 className="text-lg font-semibold text-gray-800">Filter Opening Stock</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Category Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Item Category
            </label>
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary bg-white transition-all duration-200 hover:border-gray-400 appearance-none"
              >
                <option value="all">All Categories</option>
                {categoryList.map((category) => (
                  <option key={category._id} value={category.categoryName}>
                    {capitalizeFirstLetter(category.categoryName)}
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

          {/* Item Name Search */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Item Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by item name..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary transition-all duration-200"
              />
            </div>
          </div>

          {/* Date Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary transition-all duration-200"
              />
            </div>
          </div>
        </div>

        {/* Reset Button */}
        <div className="flex justify-end mt-4">
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset Filters
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Showing <span className="font-semibold">{filteredStockList.length}</span> of{" "}
          <span className="font-semibold">{openingStockList.length}</span> items
        </div>
        {userInfo?.isAdmin && (
          <div className="text-sm text-gray-600">
            <span className="text-yellow-600 font-medium">Tip:</span> Click on stock quantity to edit
          </div>
        )}
      </div>

      {/* Opening Stock Table */}
      <div className="rounded-xl shadow-lg p-6 border border-gray-200 w-full overflow-hidden bg-white">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="min-w-[1200px]">
            {/* Table Headers */}
            <div className="grid grid-cols-[0.5fr_1.5fr_1.5fr_2fr_1.5fr_1fr_1fr_1fr] gap-4 bg-gradient-to-r from-gray-50 to-gray-100 py-4 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200 rounded-t-lg">
              <div>Sr#</div>
              <div>Item Category</div>
              <div>Item Type</div>
              <div>Item Name</div>
              <div>Supplier</div>
              <div className="">Sales Price</div>
              <div className="">Purchase Price</div>
              <div className="">Stock Quantity</div>
            </div>

            {/* Table Rows */}
            <div className="flex flex-col">
              {filteredStockList.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p className="text-gray-500 text-lg">No items found</p>
                  <p className="text-gray-400 text-sm mt-2">Try adjusting your filters</p>
                </div>
              ) : (
                filteredStockList.map((item, index) => (
                  <div
                    key={item.id}
                    className={`grid grid-cols-[0.5fr_1.5fr_1.5fr_2fr_1.5fr_1fr_1fr_1fr] items-center gap-4 px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-all duration-200 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                    }`}
                  >
                    {/* Sr# */}
                    <div className="text-sm font-medium text-gray-600">
                      {item.srNo}
                    </div>

                    {/* Item Category */}
                    <div className="text-sm text-gray-900 font-medium truncate">
                      {capitalizeFirstLetter(item.itemCategory)}
                    </div>

                    {/* Item Type */}
                    <div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.itemType === "finished-goods" 
                          ? "bg-green-100 text-green-800"
                          : item.itemType === "raw-material"
                          ? "bg-blue-100 text-blue-800"
                          : item.itemType === "service"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {item.itemType.replace("-", " ").toUpperCase()}
                      </span>
                    </div>

                    {/* Item Name */}
                    <div className="text-sm text-gray-900 font-medium">
                      {item.itemName}
                    </div>

                    {/* Supplier */}
                    <div className="text-sm text-gray-600 truncate">
                      {item.supplier}
                    </div>

                    {/* Sales Price */}
                    <div className="">
                      <span className="text-sm font-semibold text-green-600">
                        {formatCurrency(item.salesPrice)}
                      </span>
                    </div>

                    {/* Purchase Price */}
                    <div className="">
                      <span className="text-sm font-semibold text-blue-600">
                        {formatCurrency(item.purchasePrice)}
                      </span>
                    </div>

                    {/* Stock Quantity */}
                    <div className="text-center">
                      {editingStockId === item.id && userInfo?.isAdmin ? (
                        <div className="flex items-center justify-end gap-2">
                          <div className="relative">
                            <input
                              type="number"
                              value={editingStockValue}
                              onChange={(e) => setEditingStockValue(e.target.value)}
                              onKeyDown={(e) => handleKeyPress(e, item.id)}
                              min="0"
                              className="w-20 px-3 py-1.5 border border-newPrimary rounded-lg focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary transition-all duration-200 text-right"
                              autoFocus
                            />
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleSaveStock(item.id)}
                              disabled={saving}
                              className="p-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Save"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                              title="Cancel"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div 
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-all duration-200 hover:shadow-sm ${userInfo?.isAdmin ? 'hover:scale-105' : ''} ${
                            item.stockQuantity > 50
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : item.stockQuantity > 10
                              ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                              : "bg-red-100 text-red-800 hover:bg-red-200"
                          }`}
                          onClick={() => handleStockClick(item)}
                        >
                          {item.stockQuantity}
                          {userInfo?.isAdmin && (
                            <svg className="w-3 h-3 ml-1 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Summary Footer */}
        {filteredStockList.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-sm text-gray-600">Total Items</div>
                <div className="text-2xl font-bold text-newPrimary">{filteredStockList.length}</div>
              </div>
              <div className="bg-green-50 rounded-xl p-4">
                <div className="text-sm text-green-600">Total Stock Value</div>
                <div className="text-2xl font-bold text-green-700">
                  {formatCurrency(
                    filteredStockList.reduce((sum, item) => 
                      sum + (item.purchasePrice * item.stockQuantity), 0
                    )
                  )}
                </div>
              </div>
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="text-sm text-blue-600">Total Sales Value</div>
                <div className="text-2xl font-bold text-blue-700">
                  {formatCurrency(
                    filteredStockList.reduce((sum, item) => 
                      sum + (item.salesPrice * item.stockQuantity), 0
                    )
                  )}
                </div>
              </div>
              <div className="bg-orange-50 rounded-xl p-4">
                <div className="text-sm text-orange-600">Total Units</div>
                <div className="text-2xl font-bold text-orange-700">
                  {filteredStockList.reduce((sum, item) => sum + item.stockQuantity, 0).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OpeningStock;