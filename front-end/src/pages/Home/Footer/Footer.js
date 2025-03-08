import React from "react";

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-3 fixed-bottom">
      <div className="container text-center">
        <div className="row">
          <div className="col-4">
            <a href="/" className="text-light text-decoration-none">
              <i className="bi bi-house-door-fill"></i>
              <p className="mb-0">Home</p>
            </a>
          </div>
          <div className="col-4">
            <a href="/" className="text-light text-decoration-none">
              <i className="bi bi-search"></i>
              <p className="mb-0">Search</p>
            </a>
          </div>
          <div className="col-4">
            <a href="/" className="text-light text-decoration-none">
              <i className="bi bi-person-fill"></i>
              <p className="mb-0">Profile</p>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;