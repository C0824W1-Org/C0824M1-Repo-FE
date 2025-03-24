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
      roles: ["admin", "business"],
    },
    {
      name: "settings",
      path: "/admin/settings",
      icon: FaCog,
      label: "Settings",
      roles: ["admin", "stockkeeper", "sales", "business"],
    },
  ];

  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(userRole)
  );

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div
      className={`sidebar ${isSidebarOpen ? "open" : "closed"} shadow-lg`}
      style={{
        background: "linear-gradient(180deg, #2c3e50, #1a252f)",
        color: "white",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        transition: "width 0.3s ease",
        width: isSidebarOpen ? "250px" : "70px",
        overflowY: "auto",
        zIndex: 1001,
      }}
    >
      <div
        className="sidebar-header text-center py-4"
        style={{
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <h3 style={{ margin: 0, fontSize: isSidebarOpen ? "24px" : "18px" }}>
          {isSidebarOpen ? "Admin Panel" : "AP"}
        </h3>
      </div>
      <ul className="nav-list p-0 m-0">
        {filteredMenuItems.map((item) => (
          <li
            key={item.name}
            className={`nav-item d-flex align-items-center gap-3 py-3 px-4 ${
              location.pathname === item.path ? "active" : ""
            }`}
            onClick={() => handleNavigation(item.path)}
            style={{
              cursor: "pointer",
              transition: "background 0.3s ease",
              background:
                location.pathname === item.path
                  ? "linear-gradient(90deg, #6e8efb, #a777e3)"
                  : "transparent",
            }}
            onMouseEnter={(e) =>
              location.pathname !== item.path &&
              (e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)")
            }
            onMouseLeave={(e) =>
              location.pathname !== item.path &&
              (e.currentTarget.style.background = "transparent")
            }
          >
            <item.icon className="icon" style={{ fontSize: "20px" }} />
            {isSidebarOpen && (
              <span style={{ fontSize: "16px" }}>{item.label}</span>
            )}
          </li>
        ))}
        <li
          className="nav-item logout d-flex align-items-center gap-3 py-3 px-4"
          onClick={() => navigate("/login")}
          style={{
            cursor: "pointer",
            transition: "background 0.3s ease",
            position: "absolute",
            bottom: "20px",
            width: "calc(100% - 32px)",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
        >
          <FaSignOutAlt className="icon" style={{ fontSize: "20px" }} />
          {isSidebarOpen && <span style={{ fontSize: "16px" }}>Logout</span>}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
