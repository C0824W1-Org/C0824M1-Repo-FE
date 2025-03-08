import React, { useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";
import DashboardContent from "../Body/DashboardContent";
import "../../assets/css/MasterAdmin.css";

const MasterAdmin = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="admin-dashboard">
      <Sidebar isSidebarOpen={isSidebarOpen} />
      <div className="main-content">
        <Header toggleSidebar={toggleSidebar} />
        <DashboardContent />
      </div>
    </div>
  );
};

export default MasterAdmin;
