import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import styles from './HomeView.module.css';

/**
 * Home view and version switcher component
 *
 * @returns {React.Component} Component
 */
export default function HomeView() {
  return (
    <div className={styles.home}>
      <Button
        size="lg"
        className="mb-2"
        as={Link}
        to="/v2"
      >
        Version 2 (Wombat)
      </Button>
      <Button
        size="lg"
        as={Link}
        to="/v3"
      >
        Version 3 (V3)
      </Button>
    </div>
  );
}
