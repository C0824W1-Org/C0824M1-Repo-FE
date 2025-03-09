import React from "react";
import {
  FaHome,
  FaUsers,
  FaChartLine,
  FaCog,
  FaSignOutAlt,
  FaUser,
  FaBox,
  FaTruck,
  FaShoppingCart,
} from "react-icons/fa";

const Sidebar = ({ isSidebarOpen, onPageChange, currentPage, userRole }) => {
  // Danh sách menu dựa trên vai trò của người dùng
  const menuItems = [
    {
      name: "dashboard",
      icon: FaHome,
      label: "Dashboard",
      roles: ["admin", "stockkeeper", "sales", "business"],
    },
    {
      name: "ViewsProfile",
      icon: FaUser,
      label: "Thông tin cá nhân",
      roles: ["admin", "stockkeeper", "sales", "business"],
    },
    {
      name: "ListMembers",
      icon: FaUsers,
      label: "Danh sách nhân viên",
      roles: ["admin"],
    },
    {
      name: "ListProducts",
      icon: FaBox,
      label: "Danh sách hàng hóa",
      roles: ["admin", "business"],
    },
    {
      name: "ListSuppliers",
      icon: FaTruck,
      label: "Quản lý nhà cung cấp",
      roles: ["admin", "stockkeeper"],
    },
    {
      name: "SalesManagement",
      icon: FaShoppingCart,
      label: "Quản lý bán hàng",
      roles: ["admin", "sales", "business"],
    },
    { name: "settings", icon: FaCog, label: "Settings", roles: ["admin"] },
  ];

  // Lọc menu dựa trên vai trò của người dùng
  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(userRole)
  );

  return (
    <div className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
      <div className="sidebar-header">
        <h3>{isSidebarOpen ? "Admin Panel" : "AP"}</h3>
      </div>
      <ul className="nav-list">
        {filteredMenuItems.map((item) => (
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
