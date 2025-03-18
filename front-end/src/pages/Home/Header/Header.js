import React, { useState } from "react";
import { Container, Navbar, Nav, Form, FormControl } from "react-bootstrap";
import { Link } from "react-router-dom"; // Sửa lỗi cú pháp: react-router-dom
import logo from "../../assets/img/logo.svg";
import "../../assets/css/Header.css";
import PhonesService from "../../../services/Phones.service.js"; // Import PhonesService

function Header() {
  const [expanded, setExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // State cho từ khóa tìm kiếm
  const [searchResults, setSearchResults] = useState([]); // State cho kết quả tìm kiếm

  // Xử lý tìm kiếm sản phẩm
  const handleSearch = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.trim() === "") {
      setSearchResults([]); // Xóa kết quả nếu ô tìm kiếm rỗng
      return;
    }

    try {
      const response = await PhonesService.getAllPhones();
      const phones = Array.isArray(response) ? response : [];
      const filteredPhones = phones.filter((phone) =>
        phone.name.toLowerCase().includes(term.toLowerCase())
      );
      setSearchResults(filteredPhones.slice(0, 5)); // Giới hạn 5 kết quả gợi ý
    } catch (error) {
      console.error("Lỗi khi tìm kiếm sản phẩm:", error);
      setSearchResults([]);
    }
  };

  return (
    <Navbar
      sticky="top"
      expand="lg"
      className="nav py-2"
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
    >
      <Container>
        <Navbar.Brand href="/" className="">
          <img src={logo} alt="Logo" height="40" className="d-inline-block" />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" />

        <Navbar.Collapse id="navbar-nav">
          <Form className="d-flex mx-3 my-2 my-lg-0 position-relative">
            <FormControl
              type="search"
              placeholder="Bạn cần tìm gì?"
              className="me-2"
              aria-label="Search"
              value={searchTerm}
              onChange={handleSearch}
              style={{
                borderRadius: "20px",
                width: "100%",
                maxWidth: "500px", // Tăng chiều rộng tối đa trên desktop
              }}
            />
            {/* Hiển thị gợi ý tìm kiếm */}
            {searchResults.length > 0 && (
              <ul
                className="search-results position-absolute bg-white shadow-sm border rounded mt-5 w-100"
                style={{ zIndex: 1000 }}
              >
                {searchResults.map((phone) => (
                  <li key={phone.id} className="p-2">
                    <a
                      href={`#/phones/${phone.id}`}
                      className="text-dark text-decoration-none"
                      onClick={() => {
                        setSearchTerm("");
                        setSearchResults([]);
                        setExpanded(false);
                      }}
                    >
                      {phone.name}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </Form>

          <Nav className="ms-auto flex-column flex-lg-row">
            <Nav.Link
              href="tel:18002097"
              className="text-dark d-flex align-items-center my-1 my-lg-0 me-lg-3"
              onClick={() => setExpanded(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="white"
                className="bi bi-telephone me-2"
                viewBox="0 0 16 16"
              >
                <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z" />
              </svg>
              <span className="color-white">Liên hệ</span>
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/store"
              className="text-dark d-flex align-items-center my-1 my-lg-0 me-lg-3"
              onClick={() => setExpanded(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="white"
                className="bi bi-geo-alt me-2"
                viewBox="0 0 16 16"
              >
                <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10" />
                <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
              </svg>
              <span className="color-white">Cửa hàng</span>
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/login"
              className="text-dark d-flex align-items-center my-1 my-lg-0 me-lg-3"
              onClick={() => setExpanded(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="white"
                className="bi bi-person me-2"
                viewBox="0 0 16 16"
              >
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
              </svg>
              <span className="color-white">Đăng nhập</span>
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/cart"
              className="text-dark d-flex align-items-center my-1 my-lg-0 me-lg-3"
              onClick={() => setExpanded(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="white"
                className="bi bi-cart me-2"
                viewBox="0 0 16 16"
              >
                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
              </svg>
              <span className="color-white">Giỏ hàng</span>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
