import React from "react";

const Header = ({ toggleSidebar }) => {
  return (
    <header className="header">
      <button className="toggle-btn" onClick={toggleSidebar}>
        ☰
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
