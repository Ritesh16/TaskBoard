import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { NavLink } from "react-router-dom";

const NavBar = () => {
  return (
    <Navbar bg="primary" variant="dark" expand="lg" fixed="top" className="w-100">
      <Container fluid>
        <Navbar.Brand as={NavLink } to="/">Task Board</Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="me-auto">
            {/* <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#boards">Boards</Nav.Link>
            <NavDropdown title="More" id="nav-dropdown">
              <NavDropdown.Item href="#/action-1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#/action-2">Another action</NavDropdown.Item>
            </NavDropdown> */}
          </Nav>
          <Nav>
            <Nav.Link as={NavLink } to="/login">Login</Nav.Link>
            <Nav.Link as={NavLink } to="/register">Register</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;