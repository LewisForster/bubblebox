import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import "./Navbar.css";
import { useEffect, useState } from "react";
import axios from "axios";
axios.defaults.withCredentials = true;
import { useNavigate } from "react-router-dom";
import sleep from "../misc/sleep.jsx"



//navbar from https://react-bootstrap.netlify.app/docs/components/navbar - Edited to fit my uses

function NavbarComponent() {

  const navigate = useNavigate();  
  
  
  const [authenticated, setAuthenticated] = useState(null)
  useEffect(()=>{
  

    axios.get("http://localhost:4000/auth/auth",{credentials:"include"})
    .then(res=>{
      console.log("res", res.data);
      setAuthenticated(res.data.authenticated);
    })
    .catch((err)=>{
      console.log("err:", err);
      setAuthenticated(false);
    });
  
  });

  console.log(authenticated)

  



  return (
    <Navbar expand="xl" className="bg-body-tertiary nav-root">
      <Container>
        <Navbar.Brand href="/Home" className="nav-icon">
          <img
            src={"./src/assets/bubbleboxlogo.png"}
            width="50"
            height="50"
            className="d-inline-block align-top"
            alt="BubbleBox Logo"
          />
        </Navbar.Brand>
        <Navbar.Brand href="/Home" className="nav-title">
          BubbleBox
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto nav-link">
            <NavDropdown
              title="Features"
              id="basic-nav-dropdown"
              className="nav-dropdown"
            >
              <NavDropdown.Item href="#action/3.1">Temp</NavDropdown.Item>

              <NavDropdown.Item href="#action/3.2">Temp 2</NavDropdown.Item>

              <NavDropdown.Item href="#action/3.3">Temp 3</NavDropdown.Item>

              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">Temp 4</NavDropdown.Item>
            </NavDropdown>

            <Nav.Link href="#link" className="nav-link">
              About Us
            </Nav.Link>
          </Nav>
          {!authenticated &&(
          <Nav>
            <Nav.Link href="/login">Login</Nav.Link>
            <Nav.Link href="/register">Register</Nav.Link>
          </Nav>
          )}
          
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;
