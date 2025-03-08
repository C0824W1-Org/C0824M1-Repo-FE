import React, { useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";
import DashboardContent from "../Body/DashboardContent";
import "../../assets/css/MasterAdmin.css";
import ViewsProfile from "../../../components/Profile/ViewsProfile/ViewsProfile";
import EditProfile from "../../../components/Profile/EditProfile/EditProfile";
import ListMembers from "../../../components/Members/ListMembers/ListMembers";

const MasterAdmin = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState("dashboard");

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
      case "users":
        return <ViewsProfile />;
      case "analytics":
        return <EditProfile />;
      case "settings":
        return <ListMembers />;
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
      />
      <div className="main-content">
        <Header toggleSidebar={toggleSidebar} />
        {renderContent()}
      </div>
    </div>
  );
};

export default MasterAdmin;
