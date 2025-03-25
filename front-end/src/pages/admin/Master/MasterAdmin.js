import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";
import DashboardContent from "../Body/DashboardContent";
import ViewsProfile from "../../../components/Profile/ViewsProfile/ViewsProfile";
import EditProfile from "../../../components/Profile/EditProfile/EditProfile";
import ListProducts from "../../../components/Products/ListProducts/ListProducts";
import AddProducts from "../../../components/Products/AddProducts/AddProducts";
import EditProducts from "../../../components/Products/EditProducts/EditProducts";
import ListSuppliers from "../../../components/Suppliers/ListSuppliers/ListSuppliers";
import AddSuppliers from "../../../components/Suppliers/AddSuppliers/AddSuppliers";
import EditSuppliers from "../../../components/Suppliers/EditSuppliers/EditSuppliers";
import SalesManagement from "../../../components/SalesManagement/SalesManagement";
import RevenueManagement from "../../../components/SalesManagement/RevenueManagement/RevenueManagement";
import EditSale from "../../../components/SalesManagement/EditSale/EditSale";
import ListMembers from "../../../components/Members/ListMembers/ListMembers";
import AddMembers from "../../../components/Members/AddMembers/AddMembers";
import EditMembers from "../../../components/Members/EditMembers/EditMembers";
import ListCustomers from "../../../components/Customers/ListCustomers/ListCustomers";
import AddCustomers from "../../../components/Customers/AddCustomers/AddCustomers";
import EditCustomers from "../../../components/Customers/EditCustomers/EditCustomers";
import "../../assets/css/MasterAdmin.css";
import Account from "../../../components/Settings/Account/Account";
import EditAccount from "../../../components/Settings/Account/EditAccount";

// Component bảo vệ route
const ProtectedRoute = ({ element: Component, allowedRoles, userRole }) => {
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  return <Component />;
};

const MasterAdmin = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const userRole = useSelector((state) => state.auth.userLogin.role);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="admin-dashboard d-flex">
      <Sidebar isSidebarOpen={isSidebarOpen} userRole={userRole} />
      <div
        className="main-content"
        style={{
          marginLeft: isSidebarOpen ? "250px" : "70px",
          transition: "margin-left 0.3s ease",
          width: "100%",
          backgroundColor: "#f5f7fa",
          minHeight: "100vh",
        }}
      >
        <Header toggleSidebar={toggleSidebar} />
        <div className="content">
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute
                  element={DashboardContent}
                  allowedRoles={["admin", "stockkeeper", "sales", "business"]}
                  userRole={userRole}
                />
              }
            />
            <Route
              path="dashboard"
              element={
                <ProtectedRoute
                  element={DashboardContent}
                  allowedRoles={["admin", "stockkeeper", "sales", "business"]}
                  userRole={userRole}
                />
              }
            />
            <Route
              path="views-profile"
              element={
                <ProtectedRoute
                  element={ViewsProfile}
                  allowedRoles={["admin", "stockkeeper", "sales", "business"]}
                  userRole={userRole}
                />
              }
            />
            <Route
              path="edit-profile"
              element={
                <ProtectedRoute
                  element={EditProfile}
                  allowedRoles={["admin", "stockkeeper", "sales", "business"]}
                  userRole={userRole}
                />
              }
            />
            <Route
              path="list-products"
              element={
                <ProtectedRoute
                  element={ListProducts}
                  allowedRoles={["admin", "business", "stockkeeper"]}
                  userRole={userRole}
                />
              }
            />
            <Route
              path="add-products"
              element={
                <ProtectedRoute
                  element={AddProducts}
                  allowedRoles={["admin", "business", "stockkeeper"]}
                  userRole={userRole}
                />
              }
            />
            <Route
              path="edit-products/:productId"
              element={
                <ProtectedRoute
                  element={EditProducts}
                  allowedRoles={["admin", "business", "stockkeeper"]}
                  userRole={userRole}
                />
              }
            />
            <Route
              path="list-suppliers"
              element={
                <ProtectedRoute
                  element={ListSuppliers}
                  allowedRoles={["admin", "stockkeeper"]}
                  userRole={userRole}
                />
              }
            />
            <Route
              path="add-suppliers"
              element={
                <ProtectedRoute
                  element={AddSuppliers}
                  allowedRoles={["admin", "stockkeeper"]}
                  userRole={userRole}
                />
              }
            />
            <Route
              path="edit-suppliers/:supplierId"
              element={
                <ProtectedRoute
                  element={EditSuppliers}
                  allowedRoles={["admin", "stockkeeper"]}
                  userRole={userRole}
                />
              }
            />
            <Route
              path="sales-management"
              element={
                <ProtectedRoute
                  element={SalesManagement}
                  allowedRoles={["admin", "sales", "business"]}
                  userRole={userRole}
                />
              }
            />
            <Route
              path="revenue-management"
              element={
                <ProtectedRoute
                  element={RevenueManagement}
                  allowedRoles={["admin", "business"]}
                  userRole={userRole}
                />
              }
            />
            <Route
              path="edit-sale/:saleId"
              element={
                <ProtectedRoute
                  element={EditSale}
                  allowedRoles={["admin", "sales", "business"]}
                  userRole={userRole}
                />
              }
            />
            <Route
              path="list-members"
              element={
                <ProtectedRoute
                  element={ListMembers}
                  allowedRoles={["admin"]}
                  userRole={userRole}
                />
              }
            />
            <Route
              path="add-members"
              element={
                <ProtectedRoute
                  element={AddMembers}
                  allowedRoles={["admin"]}
                  userRole={userRole}
                />
              }
            />
            <Route
              path="edit-members/:memberId"
              element={
                <ProtectedRoute
                  element={EditMembers}
                  allowedRoles={["admin"]}
                  userRole={userRole}
                />
              }
            />
            <Route
              path="list-customers"
              element={
                <ProtectedRoute
                  element={ListCustomers}
                  allowedRoles={["admin"]}
                  userRole={userRole}
                />
              }
            />
            <Route
              path="add-customers"
              element={
                <ProtectedRoute
                  element={AddCustomers}
                  allowedRoles={["admin"]}
                  userRole={userRole}
                />
              }
            />
            <Route
              path="edit-customers/:customerId"
              element={
                <ProtectedRoute
                  element={EditCustomers}
                  allowedRoles={["admin"]}
                  userRole={userRole}
                />
              }
            />
            <Route
              path="settings"
              element={
                <ProtectedRoute
                  element={Account}
                  allowedRoles={["admin", "stockkeeper", "sales", "business"]}
                  userRole={userRole}
                />
              }
            />
            <Route
              path="edit-account"
              element={
                <ProtectedRoute
                  element={EditAccount}
                  allowedRoles={["admin", "stockkeeper", "sales", "business"]}
                  userRole={userRole}
                />
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default MasterAdmin;
