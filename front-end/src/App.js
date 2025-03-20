import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Master from "./pages/Home/Master/Master";
import "./pages/assets/css/reset.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import MasterAdmin from "./pages/admin/Master/MasterAdmin";
import Login from "./pages/Home/Login/Login";
import { useSelector } from "react-redux";
// import "antd/dist/antd.css"; // Import CSS của Ant Design
import "antd/dist/reset.css"; // Dùng cho Ant Design v5
function App() {
  const { isLoggedIn, userLogin } = useSelector((state) => state.auth);

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
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/*" element={<Master />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
