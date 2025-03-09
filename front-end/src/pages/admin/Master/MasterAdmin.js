import React, { useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";
import DashboardContent from "../Body/DashboardContent";
import "../../assets/css/MasterAdmin.css";
import ViewsProfile from "../../../components/Profile/ViewsProfile/ViewsProfile";
import ListMembers from "../../../components/Members/ListMembers/ListMembers";
import ListProducts from "../../../components/Products/ListProducts/ListProducts";
import ListSuppliers from "../../../components/Suppliers/ListSuppliers/ListSuppliers";
import SalesManagement from "../../../components/SalesManagement/SalesManagement";
import { useSelector } from "react-redux";

const MasterAdmin = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const userRole = useSelector((state) => state.auth.userLogin.role); // Lấy role từ Redux

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handlePageChange = (page) => {
    if (page === "logout") {
      console.log("Logging out...");
    } else {
      setCurrentPage(page);
    }
  };

  const renderContent = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardContent />;
      case "ViewsProfile":
        return <ViewsProfile />;
      case "ListMembers":
        return <ListMembers />;
      case "ListProducts":
        return <ListProducts />;
      case "ListSuppliers":
        return <ListSuppliers />;
      case "SalesManagement":
        return <SalesManagement />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="admin-dashboard">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        onPageChange={handlePageChange}
        currentPage={currentPage}
        userRole={userRole} // Truyền userRole vào Sidebar
      />
      <div className="main-content">
        <Header toggleSidebar={toggleSidebar} />
        {renderContent()}
      </div>
    </div>
  );
};

export default MasterAdmin;
