import React, { useState } from "react";
import {
  Nav,
  Navbar,
  NavbarToggler,
  Collapse,
  NavItem,
  NavLink,
  NavbarBrand,
  Container,
} from "reactstrap";
import { Link, useNavigate } from "react-router-dom"; // ✅ Add useNavigate

import { useDispatch, useSelector } from "react-redux";
import { Dropdown } from "react-bootstrap";
import { logoutUser } from "./actions/userAction";
import { toast } from "react-toastify";

function Header() {
  const { isAuthenticated, user } = useSelector((state) => state.authState);

  const [nav1, setNav] = useState(false);
  const Navtoggle = () => setNav(!nav1);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // ✅ Initialize navigate

  const logoutHandler = async () => {
    await dispatch(logoutUser());
    toast("Logged Out Successfully!", {
      type: "success",
      position: "bottom-center",
    });
    navigate("/"); // Redirect to homepage
  };

  return (
    <div>
      <Container fluid>
        <Navbar color="light" light expand="lg">
          <NavbarBrand>
            <Link style={{ textDecoration: "none", color: "black" }} to="/">
              Invoice Generator
            </Link>
          </NavbarBrand>
          <NavbarToggler onClick={Navtoggle} />
          <Collapse isOpen={nav1} navbar>
            <Nav className="navbar-nav" navbar></Nav>

            <Nav className="navbar-nav-right" navbar>
              <NavItem>
                <NavLink>
                  <Link to="/invoices" className="btn" id="login_btn">
                    invoices
                  </Link>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink>
                  {isAuthenticated && user ? (
                    <Dropdown className="d-inline">
                      <Dropdown.Toggle
                        variant="default text-black pr-5"
                        id="dropdown-basic"
                      >
                        <span>{user.name}</span>
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item
                          onClick={logoutHandler}
                          className="text-danger"
                        >
                          Logout
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  ) : (
                    <Link to="/login" className="btn" id="login_btn">
                      Login
                    </Link>
                  )}
                </NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
        <br />
      </Container>
    </div>
  );
}

export default Header;
