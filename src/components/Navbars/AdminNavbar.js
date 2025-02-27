
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Navbar,
  Nav,
  Container,
  Media,
} from "reactstrap";
import { BASE_URL } from "constant";

const AdminNavbar = (props) => {
    const navigate = useNavigate();

    
    const handleLogout = async () => {
        try {
        // Retrieve refresh token from local storage
        const refreshToken = localStorage.getItem("refresh_token");

        if (!refreshToken) {
            throw new Error("No refresh token available");
        }
        // Call the logout API with the refresh token
        await axios.post(`${BASE_URL}/logout/`, { refresh: refreshToken },
            {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
            }
        );
        } catch (error) {
            console.error("Logout failed:", error.response?.data || error.message);
        } finally {
            // Clear local storage
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("email");
            localStorage.removeItem("first_name");
            localStorage.removeItem("last_name");

            // Redirect to login
            navigate("/");
        }
    };

    // Retrieve first name and last name from localStorage
    const firstName = localStorage.getItem("first_name");
    const lastName = localStorage.getItem("last_name");

  return (
    <>
      <Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
        <Container fluid>
          <Link
            className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block"
            to="/admin"
          >
            {props.brandText}
          </Link>
          <Nav className="align-items-center d-none d-md-flex" navbar>
            <UncontrolledDropdown nav>
              <DropdownToggle className="pr-0" nav>
                <Media className="align-items-center">
                  <span className="avatar avatar-sm rounded-circle">
                    <img
                      alt="..."
                      src={require("../../assets/img/brand/favicon.png")}
                    />
                  </span>
                  <Media className="ml-2 d-none d-lg-block">
                    {firstName && lastName ? (
                      <span className="mb-0 text-sm font-weight-bold">
                        {firstName} {lastName}
                      </span>
                    ) : (
                      <span className="mb-0 text-sm font-weight-bold">
                        Name Missing
                      </span>
                    )}
                  </Media>
                </Media>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-arrow" right>
                <DropdownItem className="noti-title" header tag="div">
                  <h6 className="text-overflow m-0">Welcome!</h6>
                </DropdownItem>

                <DropdownItem to="/admin/profile" tag={Link}>
                  <i className="ni ni-single-02" />
                  <span>My profile</span>
                </DropdownItem>

                <DropdownItem to="/admin/change-password" tag={Link}>
                  <i className="ni ni-key-25" />
                  <span>Password</span>
                </DropdownItem>

                <DropdownItem divider />

                {/* Add Logout handler */}
                {/* <DropdownItem onClick={(e) => {
                  e.preventDefault();
                  handleLogout();
                }}>
                  <i className="ni ni-user-run" />
                  <span>Logout</span>
                </DropdownItem> */}
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default AdminNavbar;
