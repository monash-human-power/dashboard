import React from 'react';

import styles from './DashboardView.module.css';
import { Container, Row } from 'react-bootstrap';
import AnimatedLocationMap from 'components/T2/dashboard/AnimatedLocationMap';

export default function DashboardView(): JSX.Element {
  return (
    <Row className={styles.contentContainer}>
      <header> Hello world </header>
      <div className={styles.bigGraph}>
        <AnimatedLocationMap />
      </div>
    </Row>
  );
}
