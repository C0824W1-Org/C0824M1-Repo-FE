import { Outlet } from "react-router-dom"; // Sửa import
import { Container, Row } from "react-bootstrap";
import Body from "../Body/Body";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";

function Master() {
  return (
    <>
      <Header />
      <Body />
      <Footer />
      <Outlet />
    </>
  );
}

export default Master;
