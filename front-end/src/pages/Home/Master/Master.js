import { Outlet } from "react-router";
import { Container, Row } from "react-bootstrap";
import Body from "../Body/Body";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";

function Master() {
  return (
    <>
      {/* <Row>
      </Row> */}
      <Header />
      <Body />
      <Footer />
      <Outlet />
    </>
  );
}

export default Master;
