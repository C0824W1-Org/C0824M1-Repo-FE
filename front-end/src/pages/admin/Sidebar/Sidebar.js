import React from "react";
import {
  FaHome,
  FaUsers,
  FaCog,
  FaSignOutAlt,
  FaUser,
  FaBox,
  FaTruck,
  FaShoppingCart,
  FaUserFriends,
  FaMoneyBillWave,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = ({ isSidebarOpen, userRole }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      name: "dashboard",
      path: "/admin/dashboard",
      icon: FaHome,
      label: "Dashboard",
      roles: ["admin", "stockkeeper", "sales", "business"],
    },
    {
      name: "ViewsProfile",
      path: "/admin/views-profile",
      icon: FaUser,
      label: "Thông tin cá nhân",
      roles: ["admin", "stockkeeper", "sales", "business"],
    },
    {
      name: "ListMembers",
      path: "/admin/list-members",
      icon: FaUsers,
      label: "Danh sách nhân viên",
      roles: ["admin"],
    },
    {
      name: "ListProducts",
      path: "/admin/list-products",
      icon: FaBox,
      label: "Danh sách hàng hóa",
      roles: ["admin", "business", "stockkeeper"],
    },
    {
      name: "ListSuppliers",
      path: "/admin/list-suppliers",
      icon: FaTruck,
      label: "Quản lý nhà cung cấp",
      roles: ["admin", "stockkeeper"],
    },
    {
      name: "SalesManagement",
      path: "/admin/sales-management",
      icon: FaShoppingCart,
      label: "Quản lý bán hàng",
      roles: ["admin", "sales", "business"],
    },
    {
      name: "ListCustomers",
      path: "/admin/list-customers",
      icon: FaUserFriends,
      label: "Quản lý khách hàng",
      roles: ["admin"],
    },
    {
      name: "RevenueManagement",
      path: "/admin/revenue-management",
      icon: FaMoneyBillWave,
      label: "Quản lý doanh thu",
      roles: ["admin"],
    },
    {
      name: "settings",
      path: "/admin/settings",
      icon: FaCog,
      label: "Settings",
      roles: ["admin"],
    },
  ];

  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(userRole)
  );

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
      <div className="sidebar-header">
        <h3>{isSidebarOpen ? "Admin Panel" : "AP"}</h3>
      </div>
      <ul className="nav-list">
        {filteredMenuItems.map((item) => (
          <li
            key={item.name}
            className={`nav-item ${
              location.pathname === item.path ? "active" : ""
            }`}
            onClick={() => handleNavigation(item.path)}
          >
            <item.icon className="icon" />
            {isSidebarOpen && <span>{item.label}</span>}
          </li>
        ))}
        <li className="nav-item logout" onClick={() => navigate("/login")}>
          <FaSignOutAlt className="icon" />
          {isSidebarOpen && <span>Logout</span>}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
