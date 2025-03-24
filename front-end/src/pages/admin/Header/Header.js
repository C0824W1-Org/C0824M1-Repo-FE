import React from "react";
import { FaBars } from "react-icons/fa";
import { useSelector } from "react-redux";

const Header = ({ toggleSidebar }) => {
  const { userLogin } = useSelector((state) => state.auth);

  const getGreeting = () => {
    if (!userLogin) return "Welcome, Guest";
    const { role, personalInfo } = userLogin;
    if (role === "admin") {
      return "Xin chào, Admin";
    } else {
      return `Xin chào, ${personalInfo?.job || "User"}`;
    }
  };

  const avatarUrl =
    userLogin?.personalInfo?.avatar || "https://via.placeholder.com/40";

  return (
    <header
      className="header shadow-sm"
      style={{
        background: "linear-gradient(90deg, #6e8efb, #a777e3)",
        color: "white",
        padding: "15px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <button
        className="toggle-btn"
        onClick={toggleSidebar}
        style={{
          background: "none",
          border: "none",
          color: "white",
          fontSize: "24px",
          cursor: "pointer",
          transition: "transform 0.3s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        <FaBars className="toggle-icon" />
      </button>
      <div
        className="user-info d-flex align-items-center gap-3"
        style={{ fontSize: "18px", fontWeight: "500" }}
      >
        <span>{getGreeting()}</span>
        <img
          src={avatarUrl}
          alt="User Avatar"
          className="user-avatar avatar rounded-circle shadow-sm"
          style={{
            width: "40px",
            height: "40px",
            objectFit: "cover",
            border: "2px solid white",
            transition: "transform 0.3s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        />
      </div>
    </header>
  );
};

export default Header;
