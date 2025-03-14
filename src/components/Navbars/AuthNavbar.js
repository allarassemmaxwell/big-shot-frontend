
import { Link } from "react-router-dom";
// reactstrap components
import {
  UncontrolledCollapse,
  NavbarBrand,
  Navbar,
  Container,
  Row,
  Col,
} from "reactstrap";

const AdminNavbar = () => {
    return (
        <>
            <Navbar className="navbar-top navbar-horizontal navbar-dark" expand="md">
                <Container className="px-4">
                    <NavbarBrand to="/" tag={Link}>
                        <img
                        style={{ width: "100px", height: "auto" }}
                        alt="Big Shot Solutions"
                        src={require("../../assets/img/brand/logo.png")}
                        />
                    </NavbarBrand>
                    <button className="navbar-toggler" id="navbar-collapse-main">
                        <span className="navbar-toggler-icon" />
                    </button>
                    <UncontrolledCollapse navbar toggler="#navbar-collapse-main">
                        <div className="navbar-collapse-header d-md-none">
                            <Row>
                                <Col className="collapse-brand" xs="6">
                                    <Link to="/">
                                        <img style={{ width: "100px", height: "auto" }}
                                        alt="Big Shot Solutions"
                                        src={require("../../assets/img/brand/logo.png")}
                                        />
                                    </Link>
                                </Col>
                                <Col className="collapse-close" xs="6">
                                    <button className="navbar-toggler" id="navbar-collapse-main">
                                        <span />
                                        <span />
                                    </button>
                                </Col>
                            </Row>
                        </div>
                    </UncontrolledCollapse>
                </Container>
            </Navbar>
        </>
    );
};

export default AdminNavbar;
