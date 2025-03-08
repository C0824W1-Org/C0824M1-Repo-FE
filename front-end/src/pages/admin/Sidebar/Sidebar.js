import React from "react";
import {
  FaHome,
  FaUsers,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

const Sidebar = ({ isSidebarOpen, onPageChange, currentPage }) => {
  const menuItems = [
    { name: "dashboard", icon: FaHome, label: "Dashboard" },
    { name: "users", icon: FaUsers, label: "Users" },
    { name: "analytics", icon: FaChartBar, label: "Analytics" },
    { name: "settings", icon: FaCog, label: "Settings" },
  ];

  return (
    <div className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
      <div className="sidebar-header">
        <h3>{isSidebarOpen ? "Admin Panel" : "AP"}</h3>
      </div>
      <ul className="nav-list">
        {menuItems.map((item) => (
          <li
            key={item.name}
            className={`nav-item ${currentPage === item.name ? "active" : ""}`}
            onClick={() => onPageChange(item.name)}
          >
            <item.icon className="icon" />
            {isSidebarOpen && <span>{item.label}</span>}
          </li>
        ))}
        <li className="nav-item logout" onClick={() => onPageChange("logout")}>
          <FaSignOutAlt className="icon" />
          {isSidebarOpen && <span>Logout</span>}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
