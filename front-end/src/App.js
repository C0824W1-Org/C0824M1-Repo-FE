import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import Master from "./pages/Home/Master/Master";
import "./pages/assets/css/reset.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import MasterAdmin from "./pages/admin/Master/MasterAdmin";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Master />} />
        <Route path="/admin" element={<MasterAdmin />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
