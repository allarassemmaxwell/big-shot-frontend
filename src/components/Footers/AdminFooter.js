
// reactstrap components
import { Row, Col, Nav, NavItem, NavLink } from "reactstrap";

const Footer = () => {
    return (
        <footer className="footer">
            <Row className="align-items-center justify-content-xl-between">
                <Col xl="6">
                    <div className="copyright text-center text-xl-left text-muted">
                        © {new Date().getFullYear()}{" "}
                        <a
                        className="font-weight-bold ml-1"
                        rel="noopener noreferrer"
                        >
                        Big Shot Solutions
                        </a>
                    </div>
                </Col>

                <Col xl="6">
                    <Nav className="nav-footer justify-content-center justify-content-xl-end">
                        <NavItem>
                            <NavLink
                                rel="noopener noreferrer"
                            >
                                Developed By Nel Roy
                            </NavLink>
                        </NavItem>
                    </Nav>
                </Col>
            </Row>
        </footer>
    );
};

export default Footer;
