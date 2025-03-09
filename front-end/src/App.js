import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Master from "./pages/Home/Master/Master";
import "./pages/assets/css/reset.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import MasterAdmin from "./pages/admin/Master/MasterAdmin";
import Login from "./pages/Home/Login/Login";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

function App() {
  const { isLoggedIn, userLogin } = useSelector((state) => state.auth);
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   // Giả sử bạn cần thời gian để kiểm tra trạng thái đăng nhập
  //   const timer = setTimeout(() => {
  //     setLoading(false);
  //   }, 1000); // Thời gian giả lập loading

  //   return () => clearTimeout(timer);
  // }, []);

  // if (loading) {
  //   return <div>Đang tải...</div>;
  // }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin/*"
          element={
            isLoggedIn && userLogin.role !== "customer" ? (
              <MasterAdmin />
            ) : (
              <Login />
            )
          }
        />
        <Route path="/*" element={isLoggedIn ? <Master /> : <Login />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
