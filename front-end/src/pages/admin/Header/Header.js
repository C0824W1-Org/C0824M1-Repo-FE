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
    <header className="header">
      <button className="toggle-btn" onClick={toggleSidebar}>
        <FaBars className="toggle-icon" />
      </button>
      <div className="user-info">
        <span>{getGreeting()}</span>
        <img src={avatarUrl} alt="User Avatar" className="user-avatar avatar" />
      </div>
    </header>
  );
};

export default Header;
