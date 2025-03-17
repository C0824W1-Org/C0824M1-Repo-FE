import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { login } from "../../../redux/features/authSlice";
import { toast } from "react-toastify";
import Header from "../Header/Header";
import PhonesService from "../../../services/Phones.service";
import { FcGoogle } from "react-icons/fc";
import { SiZalo } from "react-icons/si";
import { Card } from "react-bootstrap";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Gọi API đăng nhập
      const user = await PhonesService.login(username, password);

      if (user) {
        dispatch(login(user));
        toast.success("Đăng nhập thành công!");

        // Chuyển hướng theo role
        if (user.role === "customer") {
          navigate("/");
        } else {
          navigate("/admin");
        }
      } else {
        toast.error("Tài khoản hoặc mật khẩu không đúng!");
      }
    } catch (error) {
      toast.error(error.message || "Đăng nhập thất bại!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "calc(100vh - 80px)" }} // Trừ đi chiều cao của Header (giả sử Header cao 80px)
      >
        <Card
          className="p-4 shadow-lg border-0"
          style={{ width: "400px", borderRadius: "12px" }}
        >
          <Card.Body className="text-center">
            <img
              src="https://static-account.cellphones.com.vn/_nuxt/img/Shipper_CPS3.77d4065.png"
              alt="Logo"
              width={80}
              className="mb-3"
            />
            <h4 className="fw-bold">Đăng nhập với</h4>
            <div className="d-flex justify-content-center gap-3 my-3">
              <Button
                variant="outline-secondary"
                className="d-flex align-items-center gap-2 px-4"
              >
                <FcGoogle size={20} /> Google
              </Button>
              <Button
                variant="outline-primary"
                className="d-flex align-items-center gap-2 px-4"
              >
                <SiZalo size={20} color="#157efb" /> Zalo
              </Button>
            </div>
            <div className="d-flex align-items-center my-3">
              <hr className="flex-grow-1" />
              <span className="mx-2">hoặc</span>
              <hr className="flex-grow-1" />
            </div>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Control
                  type="text"
                  placeholder="Nhập số điện thoại"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="p-3"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Control
                  type="password"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="p-3"
                />
                <div className="text-end mt-1">
                  <a
                    href="#forgot"
                    className="text-muted"
                    style={{ fontSize: "14px" }}
                  >
                    Quên mật khẩu?
                  </a>
                </div>
              </Form.Group>

              <Button
                variant="danger"
                type="submit"
                className="w-100 p-3 fw-bold"
                disabled={isLoading}
              >
                {isLoading ? "Đang xử lý..." : "Đăng nhập"}
              </Button>
            </Form>
            <div className="mt-3" style={{ fontSize: "14px" }}>
              Bạn chưa có tài khoản?{" "}
              <a href="#register" className="fw-bold text-danger">
                Đăng ký ngay
              </a>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}

export default Login;
