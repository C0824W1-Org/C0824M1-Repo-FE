import React from "react";
import { FaBars } from "react-icons/fa";

const Header = ({ toggleSidebar }) => {
  return (
    <header className="header">
      <button className="toggle-btn" onClick={toggleSidebar}>
        <FaBars className="toggle-icon" />
      </button>
      <div className="user-info">
        <span>Welcome, Admin</span>
        <img
          src="https://via.placeholder.com/40"
          alt="User"
          className="user-avatar"
        />
      </div>
    </header>
  );
};

export default Header;
