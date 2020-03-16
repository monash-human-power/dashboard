import React from 'react';
import { NavLink } from 'react-router-dom';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { useBikeVersion, bikeVersions } from 'router';
import { ReactComponent as Logo } from 'assets/MHPLogo.svg';
import styles from './NavBar.module.css';

/**
 * Navigation bar component
 *
 * @returns {React.Component} Component
 */
export default function NavBar() {
  const bikeVersion = useBikeVersion();
  const bikeName = bikeVersion?.name;
  const linkItems = bikeVersion?.routes.map(({ name, path, exact }) => (
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

  const versionDropdown = bikeVersions.map(({ name, rootPath }) => (
    <NavDropdown.Item
      as={NavLink}
      to={rootPath}
      activeClassName=""
    >
      {name}
    </NavDropdown.Item>
  ));

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Navbar.Brand as={NavLink} to="/">
        <div className="d-flex align-items-center">
          <div className={styles.logo}>
            <Logo />
          </div>
          <span>
            <b>das</b>
            hboard
          </span>
        </div>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav>
          <NavDropdown title={bikeName} id="version-selector">
            {versionDropdown}
          </NavDropdown>
        </Nav>
        <Nav className="ml-auto">
          {linkItems}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
