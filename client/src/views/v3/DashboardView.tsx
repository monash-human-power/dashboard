import React from 'react';

import V3LocationMap from 'components/v3/dashboard/V3LocationMap';
import { V3SpeedDistanceChart } from 'components/v3/dashboard/V3SpeedDistanceChart';
import DASRecording from 'components/v3/DASRecording';
import StatisticRow from 'components/v3/StatisticRow';
import CrashModal from 'components/v3/CrashModal';
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
        <CrashModal />
        <DASRecording />
        <StatisticRow />
        <div className={styles.graph}>
          <V3SpeedDistanceChart />
        </div>
      </Col>
      <Col lg={6} className={styles.content}>
        <div className={styles.bigGraph}>
          <V3LocationMap />
        </div>
      </Col>
    </Row>
  );
}
