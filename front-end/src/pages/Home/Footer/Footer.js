import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./Footer.css"; 
import logo from "../../assets/img/logo.svg";


const Footer = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <footer style={{ backgroundColor: '#2c3e50', color: '#ecf0f1' }}>
      <div className="container" data-aos="fade-up">
        <div className="row gy-4">

          <div className="col-md-3" data-aos="fade-right">
            <h5 className="fw-bold mb-3">HỆ THỐNG CỬA HÀNG</h5>

      <a href="/" className="d-inline-block mb-3">
        <img
          src={logo}
          alt="Logo"
          height="40"
          className="d-inline-block"
        />
      </a>


            <ul className="list-unstyled small">
              <li className="mb-2">Gọi tư vấn sửa chữa: <strong>1800.2025</strong></li>
              <li className="mb-2">Góp ý - khiếu nại: <strong>1800.2050</strong></li>
              <li className="mb-2">Email: <a href="mailto:cskh@modulars.com.vn" className="footer-link">cskh@modulars.com.vn</a></li>
              <li className="mb-2">Hoạt động: <strong>08:00 - 21:00</strong></li>
            </ul>
          </div>

          <div className="col-md-3" data-aos="fade-up">
            <h5 className="fw-bold mb-3">THÔNG TIN HỖ TRỢ</h5>
            <ul className="list-unstyled small">
              <li className="mb-2"><a href="/" className="footer-link">Ưu đãi thanh toán Kredivo</a></li>
              <li className="mb-2"><a href="/" className="footer-link">Ưu đãi trả sau qua ví Momo</a></li>
              <li className="mb-2"><a href="/" className="footer-link">Ưu đãi Mmember</a></li>
              <li className="mb-2"><a href="/" className="footer-link">Chính sách bảo hành</a></li>
              <li className="mb-2"><a href="/" className="footer-link">Chính sách bảo mật</a></li>
            </ul>
          </div>

          <div className="col-md-3" data-aos="fade-left">
            <h5 className="fw-bold mb-3">VỀ ĐIỆN THOẠI MODULARS</h5>
            <ul className="list-unstyled small">
              <li className="mb-2"><a href="/" className="footer-link">Khuyến mãi</a></li>
              <li className="mb-2"><a href="/" className="footer-link">Tuyển dụng</a></li>
              <li className="mb-2"><a href="/" className="footer-link">Dạy nghề sửa chữa</a></li>
            </ul>
          </div>

          <div className="col-md-3" data-aos="zoom-in">
            <h5 className="fw-bold mb-3">KẾT NỐI</h5>
            <div className="d-flex gap-3 mb-3">
              <a href="/"><img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="facebook" width="24" /></a>
              <a href="/"><img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="instagram" width="24" /></a>
            </div>
            <h6 className="fw-semibold mb-3">WEBSITE THÀNH VIÊN</h6>
            <ul className="list-unstyled small">
              <li className="mb-2"><a href="/" className="btn btn-outline-light btn-sm d-block">BestMoBPhone</a></li>
            </ul>
          </div>

        </div>

        <div className="text-center small text-light border-top pt-3 mt-4">
          <p className="mb-0" data-aos="fade-up">
          © 2025 MODULARS - All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
