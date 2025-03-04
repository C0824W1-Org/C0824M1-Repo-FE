import React from "react";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import banner1 from "../../assets/img/banner-1.jpg";
import banner2 from "../../assets/img/banner-2.png";
import banner3 from "../../assets/img/banner-3.png";
import banner4 from "../../assets/img/banner-4.jpg";
import { Container } from "react-bootstrap";

function Body() {
  const images = [banner1, banner2, banner3, banner4];

  // State để quản lý ảnh hiện tại và hiển thị banner
  const [currentImage, setCurrentImage] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Hàm chuyển sang ảnh tiếp theo
  const handleNext = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  // Hàm chuyển về ảnh trước đó
  const handlePrev = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  // Hàm đóng banner
  const handleClose = () => {
    setIsVisible(false);
  };
  return (
    <>
      <Container>
        {/* Banner (chỉ ẩn phần này khi bấm X) */}
        {isVisible && (
          <div className="position-relative mb-3 mt-4">
            {/* Banner chính */}
            <div className="d-flex align-items-center justify-content-center">
              {/* Nút mũi tên trái */}
              <button
                className="btn position-relative"
                onClick={handlePrev}
                style={{ zIndex: 1, top: 0, left: "40px" }}
              >
                <i class="bi bi-arrow-left-circle-fill"></i>
              </button>

              {/* Ảnh banner */}
              <img
                src={images[currentImage]}
                alt="Phone Sale Banner"
                className="img-fluid"
                style={{ maxHeight: "300px", width: "100%" }}
              />

              {/* Nút mũi tên phải */}
              <button
                className="btn position-relative"
                onClick={handleNext}
                style={{ zIndex: 1, top: 0, right: "40px" }}
              >
                <i class="bi bi-arrow-right-circle-fill"></i>
              </button>

              {/* Nút đóng (hình chữ X) */}
              <button
                className="btn position-absolute"
                style={{ top: "0", right: "40px" }}
                onClick={handleClose}
              >
                <i class="bi bi-x-circle-fill"></i>
              </button>
            </div>
          </div>
        )}
      </Container>
    </>
  );
}

export default Body;
