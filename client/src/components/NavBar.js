import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';

export default function NavBar() {
  const links = [
    ['Dashboard', '/'],
    ['Files', '/download-files'],
    ['Sensors', '/status'],
    ['Power Model', '/power-model'],
    ['Power Map', '/power-zone'],
    ['Power Model Calibration', '/power-calibration'],
    ['Camera', '/camera'],
    ['Options', '/options'],
  ];

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Navbar.Brand>MHP DAShboard</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          {links.map(([label, link]) => <Nav.Link as={Link} to={link}>{label}</Nav.Link>)}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
