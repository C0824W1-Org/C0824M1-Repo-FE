import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import banner1 from "../../assets/img/banner-1.jpg";
import banner2 from "../../assets/img/banner-2.png";
import banner3 from "../../assets/img/banner-3.png";
import banner4 from "../../assets/img/banner-4.jpg";
import "../../assets/css/Body.css";
import PhonesService from "../../../services/Phones.service.js";

function Body() {
  const [phones, setPhones] = useState([]);
  const [sortBy, setSortBy] = useState("featured");
  const [currentImage, setCurrentImage] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [loading, setLoading] = useState(true);

  const images = [banner1, banner2, banner3, banner4];

  useEffect(() => {
    const fetchPhones = async () => {
      try {
        const response = await PhonesService.getAllPhones();
        setPhones(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu điện thoại:", error);
      } finally {
        setLoading(false); // Kết thúc loading
      }
    };
    fetchPhones();
  }, []);

  const sortPhones = (criteria) => {
    let sortedPhones = [...phones];
    switch (criteria) {
      case "priceAsc":
        sortedPhones.sort((a, b) => a.price - b.price);
        break;
      case "priceDesc":
        sortedPhones.sort((a, b) => b.price - a.price);
        break;
      default:
        sortedPhones.sort((a, b) => a.id - b.id);
        break;
    }
    setPhones(sortedPhones);
  };

  const handleSortChange = (criteria) => {
    setSortBy(criteria);
    sortPhones(criteria);
  };

  const handleNext = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  return (
    <>
      <Container>
        {isVisible && (
          <div className="position-relative mb-3 mt-4">
            <div className="d-flex align-items-center justify-content-center">
              <button
                className="btn position-relative"
                onClick={handlePrev}
                style={{ zIndex: 1, top: 0, left: "40px" }}
              >
                <i className="bi bi-arrow-left-circle-fill"></i>
              </button>
              <img
                src={images[currentImage]}
                alt="Phone Sale Banner"
                className="img-fluid"
                style={{ maxHeight: "300px", width: "100%" }}
              />
              <button
                className="btn position-relative"
                onClick={handleNext}
                style={{ zIndex: 1, top: 0, right: "40px" }}
              >
                <i className="bi bi-arrow-right-circle-fill"></i>
              </button>
              <button
                className="btn position-absolute"
                style={{ top: "0", right: "40px" }}
                onClick={handleClose}
              >
                <i className="bi bi-x-circle-fill"></i>
              </button>
            </div>
          </div>
        )}

        {/* Thanh sắp xếp */}
        <div className="border p-3 mt-4 mb-4 d-flex align-items-center">
          <span className="me-3">Sắp xếp theo:</span>
          <span
            className={`me-2 ${
              sortBy === "featured" ? "sort-active" : "sort-inactive"
            }`}
            onClick={() => handleSortChange("featured")}
            style={{ cursor: "pointer" }}
          >
            Nổi bật
          </span>
          <span
            className={`me-2 ${
              sortBy === "priceAsc" ? "sort-active" : "sort-inactive"
            }`}
            onClick={() => handleSortChange("priceAsc")}
            style={{ cursor: "pointer" }}
          >
            Giá tăng dần
          </span>
          <span
            className={`${
              sortBy === "priceDesc" ? "sort-active" : "sort-inactive"
            }`}
            onClick={() => handleSortChange("priceDesc")}
            style={{ cursor: "pointer" }}
          >
            Giá giảm dần
          </span>
        </div>

        <Row className="g-4 products">
          {phones.map((phone) => (
            <Col
              key={phone.id}
              xs={12}
              sm={6}
              md={4}
              lg={3}
              xl={12}
              className="custom-col-xl-5"
            >
              <a
                href={`#/phones/${phone.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Card className="products-card h-100">
                  <div className="card-img-container">
                    <Card.Img
                      variant="top"
                      src={phone.image}
                      alt={phone.name}
                      className="card-img"
                    />
                  </div>
                  <Card.Body>
                    <Card.Title className="product-title">
                      {phone.name}
                    </Card.Title>
                    <Card.Text className="product-price">
                      {phone.price.toLocaleString()} đ
                    </Card.Text>
                  </Card.Body>
                </Card>
              </a>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
}

export default Body;
