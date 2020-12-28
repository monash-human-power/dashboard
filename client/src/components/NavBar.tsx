import { ReactComponent as Logo } from 'assets/MHPLogo.svg';
import React from 'react';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { VersionInfo } from '../router';
import styles from './NavBar.module.css';

/**
 * @property {VersionInfo} bikeVersion Version info for bike
 * @property {VersionInfo[]} bikeVersions Version info for all bikes
 */
export interface NavBarProps {
  /** Version info for bike */
  bikeVersion: VersionInfo | null,
  /** Version info for all bikes */
  bikeVersions: VersionInfo[]
}

/**
 * Navigation bar component
 *
 * @param props Props
 * @returns Component
 */
export default function NavBar({ bikeVersion, bikeVersions }: NavBarProps): JSX.Element {
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
    <NavDropdown.Item as={NavLink} to={rootPath} activeClassName="">
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
        <Nav className="ml-auto">{linkItems}</Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
