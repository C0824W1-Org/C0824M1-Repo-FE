import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import Master from "./pages/Home/Master/Master";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Master />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
