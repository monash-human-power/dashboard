import React from 'react';

import { TrikePowerSpeedTimeChart } from 'components/trike/charts/TrikePowerSpeedTimeChart';

import { Col, Row } from 'react-bootstrap';

import styles from './DashboardView.module.css';

/**
 * Dashboard view component
 *
 * @returns Component
 */
export default function ChartView(): JSX.Element {
  return (
    <Row className={styles.contentContainer}>
      <Col className={styles.content}>
        <div className={styles.bigGraph}>
          <TrikePowerSpeedTimeChart />
        </div>
      </Col>
    </Row>
  );
}
