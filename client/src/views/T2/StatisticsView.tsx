import React from 'react';

import { Col, Row } from 'react-bootstrap';

import RiderRanker from 'components/T2/statistics/RiderRanker';

import styles from './StatisticsView.module.css';

export default function StatisticsView(): JSX.Element {
  return (
    <Row className={styles.contentContainer}>
      <Col
        xs={{ span: 12, order: 1 }}
        lg={{ span: 6, order: 1 }}
        className={styles.statContainer}
      >
        <RiderRanker />
      </Col>
    </Row>
  );
}
