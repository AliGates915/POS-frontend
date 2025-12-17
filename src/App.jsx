import React from "react";
import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/admin/Login";
import Signup from "./pages/admin/Signup";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ItemList from "./pages/admin/ItemList.jsx";
import CustomerData from "./pages/admin/CustomerData";
import { ToastContainer } from "react-toastify";
import ShelveLocation from "./pages/admin/ShelveLocation";
import "react-toastify/dist/ReactToastify.css";
import CategoryItem from "./pages/admin/CategoryItem";
import ProtectedRoute from "./components/ProtectedRoute";
import SupplierList from "./pages/admin/Supplier";
import Manufacture from "./pages/admin/Manufacture";
import ItemBarcode from "./pages/admin/ItemBarcode";
import ItemPurchase from "./pages/admin/ItemPurchase";
import SalesInvoice from "./pages/admin/SalesInvoice";
import ExpiryTags from "./pages/admin/ExpiryTags";
import BookingOrder from "./pages/admin/BookingOrder";
import ItemUnit from "./pages/admin/ItemUnit";
import Company from "./pages/admin/Security/Company.jsx";
import Users from "./pages/admin/Security/Users";
import GroupManagement from "./pages/admin/GroupManagement";
import UserModuleAccess from "./pages/admin/Security/UserModuleAccess.jsx";
import Modules from "./pages/admin/Security/Modules";
import ModulesFunctionalities from "./pages/admin/Security/ModulesFunctionalities.jsx";
import ExpenseHead from "./pages/admin/ExpenseHead.jsx";
import ExpenseVoucher from "./pages/admin/ExpenseVoucher.jsx";
import DayBook from "./pages/admin/DayBook.jsx";
import OpeningStock from "./pages/admin/OpeningStock.jsx";
import Employee from "./pages/admin/Security/Employee.jsx";
import SoftwareGroup from "./pages/admin/Security/SoftwareGroup.jsx";
import GroupUsers from "./pages/admin/Security/GroupUsers.jsx";
import SecurityLog from "./pages/admin/Security/SecurityLog.jsx";
import GroupRights from "./pages/admin/Security/GroupRights.jsx";
import SecurityPage from "./pages/admin/Security/SecurityPage.jsx";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AppContent() {
  return (
    <div className="max-h-screen flex flex-col bg-gray-50">
      <ScrollToTop />
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="item-details" element={<ItemList />} />
            <Route path="customers" element={<CustomerData />} />
            <Route path="shelve-location" element={<ShelveLocation />} />
            <Route path="category-item" element={<CategoryItem />} />
            <Route path="supplier" element={<SupplierList />} />
            <Route path="manufacture" element={<Manufacture />} />
            <Route path="item-barcode" element={<ItemBarcode />} />
            <Route path="sales-invoice" element={<SalesInvoice />} />
            <Route path="item-purchase" element={<ItemPurchase />} />
            <Route path="expiry-tags" element={<ExpiryTags />} />
            <Route path="item-unit" element={<ItemUnit />} />
            <Route path="customers-booking" element={<BookingOrder />} />
            <Route path="company" element={<Company />} />
            <Route path="users" element={<Users />} />
            <Route path="groups" element={<GroupManagement />} />
            <Route path="user-module-access" element={<UserModuleAccess />} />
            <Route path="modules" element={<Modules />} />
            <Route
              path="modules-functionalities"
              element={<ModulesFunctionalities />}
            />
            <Route path="expense-head" element={<ExpenseHead />} />
            <Route path="expense-voucher" element={<ExpenseVoucher />} />
            <Route path="day-book" element={<DayBook />} />
            <Route path="opening-stock" element={<OpeningStock />} />
            <Route path="employee" element={<Employee />} />
            <Route path="software-group" element={<SoftwareGroup />} />
            <Route path="group-users" element={<GroupUsers />} />
            <Route path="security-log" element={<SecurityLog />} />
            <Route path="group-rights" element={<GroupRights />} />

            {/* Security Page */}
            <Route path="security-module" element={<SecurityPage />} />
          </Route>
        </Routes>
      </main>
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}

function App() {
  return <AppContent />;
}

export default App;
