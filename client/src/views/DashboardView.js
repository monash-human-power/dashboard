import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import VelocityTimeChart from 'components/v2/charts/VelocityTimeChart';
import PowerTimeChart from 'components/v2/charts/PowerTimeChart';
import CadenceTimeChart from 'components/v2/charts/CadenceTimeChart';

/**
 * Dashboard page component
 *
 * @returns {React.Component} Component
 */
export default function DashboardView() {
  const updateInterval = 1000;

  return (
    <Container fluid>
      <Row>
        <Col lg={6}>
          <VelocityTimeChart interval={updateInterval} />
        </Col>
        <Col lg={6}>
          <PowerTimeChart interval={updateInterval} />
        </Col>
      </Row>
      <Row>
        <Col lg={6}>
          <CadenceTimeChart interval={updateInterval} />
        </Col>
      </Row>
    </Container>
  );
}
