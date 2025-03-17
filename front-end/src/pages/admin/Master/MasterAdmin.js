import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
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

const MasterAdmin = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const userRole = useSelector((state) => state.auth.userLogin.role);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="admin-dashboard">
      <Sidebar isSidebarOpen={isSidebarOpen} userRole={userRole} />
      <div className="main-content">
        <Header toggleSidebar={toggleSidebar} />
        <Routes>
          <Route path="/" element={<DashboardContent />} />
          <Route path="dashboard" element={<DashboardContent />} />
          <Route path="views-profile" element={<ViewsProfile />} />
          <Route path="edit-profile" element={<EditProfile />} />
          <Route path="list-products" element={<ListProducts />} />
          <Route path="add-products" element={<AddProducts />} />
          <Route path="edit-products/:productId" element={<EditProducts />} />
          <Route path="list-suppliers" element={<ListSuppliers />} />
          <Route path="add-suppliers" element={<AddSuppliers />} />
          <Route
            path="edit-suppliers/:supplierId"
            element={<EditSuppliers />}
          />
          <Route path="sales-management" element={<SalesManagement />} />
          <Route path="revenue-management" element={<RevenueManagement />} />
          <Route path="edit-sale/:saleId" element={<EditSale />} />
          <Route path="list-members" element={<ListMembers />} />
          <Route path="add-members" element={<AddMembers />} />
          <Route path="edit-members/:memberId" element={<EditMembers />} />
          <Route path="list-customers" element={<ListCustomers />} />
          <Route path="add-customers" element={<AddCustomers />} />
          <Route
            path="edit-customers/:customerId"
            element={<EditCustomers />}
          />
        </Routes>
      </div>
    </div>
  );
};

export default MasterAdmin;
