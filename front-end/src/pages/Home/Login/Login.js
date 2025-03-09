import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { login } from "../../../redux/features/authSlice";
import { toast } from "react-toastify";
import Header from "../Header/Header";
import PhonesService from "../../../services/Phones.service";

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
    <div>
      <Header />
      <Container className="mt-5">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Tài khoản</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nhập tài khoản"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Mật khẩu</Form.Label>
            <Form.Control
              type="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" disabled={isLoading}>
            {isLoading ? "Đang xử lý..." : "Đăng nhập"}
          </Button>
          <Button variant="link" href="#register" className="ms-2">
            Đăng ký
          </Button>
        </Form>
      </Container>
    </div>
  );
}

export default Login;
