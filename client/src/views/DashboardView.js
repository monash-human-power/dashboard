import React, { useState, useCallback } from 'react';
import {
  Col,
  Container,
  FormCheck,
  Row,
} from 'react-bootstrap';
import VelocityTimeChart from 'components/v2/charts/VelocityTimeChart';
import PowerTimeChart from 'components/v2/charts/PowerTimeChart';
import CadenceTimeChart from 'components/v2/charts/CadenceTimeChart';
import { useData } from 'api/v2/sensors';

/**
 * Dashboard page component
 *
 * @returns {React.Component} Component
 */
export default function DashboardView() {
  const [textMode, setTextMode] = useState(false);
  const data = useData();
  const updateInterval = 1000;

  const handleTextMode = useCallback((event) => {
    setTextMode(event.currentTarget.checked);
  }, []);

  return (
    <Container fluid>
      <Row>
        <Col sm={8}>
          <h5 style={{ visibility: !data ? 'hidden' : 'visible' }}>
            {`Current Filename: ${data?.filename}`}
          </h5>
        </Col>
        <Col sm={4}>
          <FormCheck
            type="switch"
            label="Text mode"
            id="text-mode-switch"
            className="float-right"
            value={textMode}
            onChange={handleTextMode}
          />
        </Col>
      </Row>
      {!textMode ? (
        <div>
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
        </div>
      ) : null}
    </Container>
  );
}
