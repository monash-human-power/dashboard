import React from 'react';
import { NavLink } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import { routes } from 'router';

/**
 * Navigation bar component
 *
 * @returns {React.Component} Component
 */
export default function NavBar() {
  const linkItems = routes.map(({ name, path, exact }) => (
    <Nav.Link
      as={NavLink}
      to={path}
      exact={exact}
      activeClassName="active"
      key={path}
    >
      {name}
    </Nav.Link>
  ));

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Navbar.Brand>MHP DAShboard</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          {linkItems}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
