import React from 'react';

import styles from './DashboardView.module.css';
import { Col, Row } from 'react-bootstrap';

import AnimatedLocationMap from 'components/T2/dashboard/AnimatedLocationMap';
import VideoFeed from 'components/T2/dashboard/VideoFeed';
import DataDisplay from 'components/T2/dashboard/DataDisplay';

export default function DashboardView(): JSX.Element {
  return (
    <Row className={styles.contentContainer}>
      <Col
        xs={{ span: 12, order: 1 }}
        lg={{ span: 6, order: 1 }}
        className={styles.statContainer}
      >
        <DataDisplay />
      </Col>
      <Col xs={{ span: 12, order: 2 }} lg={{ span: 6, order: 2 }}>
        <div className={styles.graph}>
          <VideoFeed />
        </div>
      </Col>
      <Col xs={{ span: 12, order: 4 }} lg={{ span: 6, order: 4 }}>
        <div className={styles.bigGraph}>
          <AnimatedLocationMap />
        </div>
      </Col>
    </Row>
  );
}
