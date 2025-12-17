import React, { useState } from "react";
import {
  FaShieldAlt,
  FaArrowLeft,
  FaSearch,
  FaLock,
  FaFilter,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { securityChildren } from "../../../utils/Security";

const SecurityPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const categories = [
    "All",
    ...new Set(securityChildren.map((item) => item.category)),
  ];
  const filteredItems = securityChildren.filter((item) => {
    const matchesSearch =
      item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30 p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-newPrimary to-green-500 rounded-xl blur-lg opacity-30"></div>
              <div className="relative bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                <FaLock className="w-7 h-7 text-newPrimary" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent">
                Security Module
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Centralized security management and access control
              </p>
            </div>
          </div>

          <NavLink
            to="/admin"
            className="group flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:border-newPrimary/30 hover:shadow-md transition-all duration-300"
          >
            <FaArrowLeft className="text-gray-500 group-hover:text-newPrimary transition-colors" />
            <span className="text-sm font-medium text-gray-700 group-hover:text-newPrimary transition-colors">
              Back to Dashboard
            </span>
          </NavLink>
        </div>

        {/* Stats & Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="col-span-2">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search security modules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-newPrimary/20 focus:border-newPrimary transition-all duration-300 placeholder-gray-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-newPrimary/20 focus:border-newPrimary appearance-none cursor-pointer transition-all duration-300"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="mb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-newPrimary/5 via-green-500/5 to-newPrimary/5"></div>
        <div className="relative bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-newPrimary to-green-500 p-3 rounded-xl shadow-lg">
                <FaShieldAlt className="text-2xl text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-1">
                  Security Dashboard Overview
                </h2>
                <p className="text-gray-600 text-sm">
                  Manage user permissions, access controls, and security
                  configurations across all system modules
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-800">
                  {securityChildren.length}
                </div>
                <div className="text-sm text-gray-500">Total Modules</div>
              </div>
              <div className="h-10 w-px bg-gray-300"></div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-800">
                  {filteredItems.length}
                </div>
                <div className="text-sm text-gray-500">Showing</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Modules Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className="group relative overflow-hidden bg-white border border-gray-200 rounded-2xl p-6 hover:no-underline transition-all duration-500 hover:shadow-xl hover:border-transparent"
          >
            {/* Background Gradient Effect */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
            ></div>

            {/* Hover Glow Effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-newPrimary/0 via-newPrimary/5 to-newPrimary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* Content */}
            <div className="relative z-10">
              {/* Category Badge */}
              <div className="mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                  {item.category}
                </span>
              </div>

              {/* Icon with Gradient Background */}
              <div
                className={`mb-5 relative inline-flex p-3 rounded-xl bg-gradient-to-br ${item.color} shadow-md group-hover:shadow-lg transition-shadow duration-300`}
              >
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-xl"></div>
                <div className="relative text-white">{item.icon}</div>
              </div>

              {/* Title and Description */}
              <h3 className="text-lg font-semibold text-gray-800 mb-3 group-hover:text-gray-900 transition-colors duration-300">
                {item.label}
              </h3>
              <p className="text-sm text-gray-500 mb-4 group-hover:text-gray-600 transition-colors duration-300">
                {item.description}
              </p>

              {/* Access Indicator */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Click to access</span>
                <div className="flex items-center gap-1 text-newPrimary opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                  <span className="text-xs font-medium">Access</span>
                </div>
              </div>
            </div>

            {/* Bottom Gradient Border */}
            <div
              className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${item.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}
            />
          </NavLink>
        ))}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-16">
          <div className="inline-flex p-4 rounded-full bg-gray-100 mb-4">
            <FaSearch className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            No modules found
          </h3>
          <p className="text-gray-500">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">
                {filteredItems.length} of {securityChildren.length} modules
                visible
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>Last updated: Just now</span>
            <div className="h-4 w-px bg-gray-300"></div>
            <span>System: Secure</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityPage;
