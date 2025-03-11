import React, { useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";
import DashboardContent from "../Body/DashboardContent";
import "../../assets/css/MasterAdmin.css";
import ViewsProfile from "../../../components/Profile/ViewsProfile/ViewsProfile";
import EditProfile from "../../../components/Profile/EditProfile/EditProfile";
import ListProducts from "../../../components/Products/ListProducts/ListProducts";
import AddProducts from "../../../components/Products/AddProducts/AddProducts"; // Import AddProducts
import EditProducts from "../../../components/Products/EditProducts/EditProducts"; // Import EditProducts
import ListSuppliers from "../../../components/Suppliers/ListSuppliers/ListSuppliers";
import SalesManagement from "../../../components/SalesManagement/SalesManagement";
import ListMembers from "../../../components/Members/ListMembers/ListMembers";
import AddMembers from "../../../components/Members/AddMembers/AddMembers";
import EditMembers from "../../../components/Members/EditMembers/EditMembers";
import { useSelector } from "react-redux";

const MasterAdmin = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [pageParams, setPageParams] = useState({});
  const userRole = useSelector((state) => state.auth.userLogin.role);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handlePageChange = (page, params = {}) => {
    if (page === "logout") {
      console.log("Logging out...");
    } else {
      setCurrentPage(page);
      setPageParams(params);
    }
  };

  const renderContent = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardContent />;
      case "ViewsProfile":
        return <ViewsProfile onPageChange={handlePageChange} />;
      case "editProfile":
        return <EditProfile onPageChange={handlePageChange} />;
      case "ListProducts":
        return <ListProducts onPageChange={handlePageChange} />;
      case "AddProducts":
        return <AddProducts onPageChange={handlePageChange} />;
      case "EditProducts":
        return (
          <EditProducts
            onPageChange={handlePageChange}
            productId={pageParams.productId}
          />
        );
      case "ListSuppliers":
        return <ListSuppliers />;
      case "SalesManagement":
        return <SalesManagement />;
      case "ListMembers":
        return <ListMembers onPageChange={handlePageChange} />;
      case "AddMembers":
        return <AddMembers onPageChange={handlePageChange} />;
      case "EditMembers":
        return (
          <EditMembers
            onPageChange={handlePageChange}
            memberId={pageParams.memberId}
          />
        );
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
        userRole={userRole}
      />
      <div className="main-content">
        <Header toggleSidebar={toggleSidebar} />
        {renderContent()}
      </div>
    </div>
  );
};

export default MasterAdmin;
