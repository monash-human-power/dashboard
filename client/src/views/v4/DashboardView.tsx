import React from 'react';

import V4LocationMap from 'components/v4/dashboard/V4LocationMap';
import { V4SpeedDistanceChart } from 'components/v4/dashboard/V4SpeedDistanceChart';
import DASRecording from 'components/v4/DASRecording';
import StatisticRow from 'components/v4/StatisticRow';
import { Col, Row } from 'react-bootstrap';
import styles from './DashboardView.module.css';

/**
 * Dashboard View component
 *
 * @returns Component
 */
export default function DashboardView(): JSX.Element {
  return (
    <Row className={styles.contentContainer}>
      <Col lg={6} className={styles.content}>
        <DASRecording />
        <StatisticRow />
        <div className={styles.graph}>
          <V4SpeedDistanceChart />
        </div>
      </Col>
      <Col lg={6} className={styles.content}>
        <div className={styles.bigGraph}>
          <V4LocationMap />
        </div>
      </Col>
    </Row>
  );
}
