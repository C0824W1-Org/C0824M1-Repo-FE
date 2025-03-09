import React, { useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";
import DashboardContent from "../Body/DashboardContent";
import "../../assets/css/MasterAdmin.css";
// import PersonalInfo from "../../../components/Profile/PersonalInfo/PersonalInfo";
// import EmployeeList from "../../../components/Employees/EmployeeList/EmployeeList";
// import ProductList from "../../../components/Products/ProductList/ProductList";
// import SupplierManagement from "../../../components/Suppliers/SupplierManagement/SupplierManagement";
// import SalesManagement from "../../../components/Sales/SalesManagement/SalesManagement";
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
      // case "personalInfo":
      //   return <PersonalInfo />;
      // case "employees":
      //   return <EmployeeList />;
      // case "products":
      //   return <ProductList />;
      // case "suppliers":
      //   return <SupplierManagement />;
      // case "sales":
      //   return <SalesManagement />;
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
