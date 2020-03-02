import React, { useState, useCallback } from 'react';
import {
  Col,
  Container,
  FormCheck,
  Row,
} from 'react-bootstrap';
import V2VelocityTimeChart from 'components/v2/charts/V2VelocityTimeChart';
import V2PowerTimeChart from 'components/v2/charts/V2PowerTimeChart';
import V2CadenceTimeChart from 'components/v2/charts/V2CadenceTimeChart';
import LocationTimeChart from 'components/v2/charts/V2LocationTimeChart';
import V2TextModeChart from 'components/v2/charts/V2TextModeChart';
import { useSensorData } from 'api/v2/sensors';

/**
 * Dashboard page component
 *
 * @returns {React.Component} Component
 */
export default function DashboardView() {
  const [textMode, setTextMode] = useState(false);
  const { data: filename } = useSensorData('filename');
  const updateInterval = 1000;

  const handleTextMode = useCallback((event) => {
    setTextMode(event.currentTarget.checked);
  }, []);

  /**
   * Render dashboard with graphs
   *
   * @returns {React.Component} Component
   * */
  function renderGraphicalDashboard() {
    return (
      <div>
        <Row>
          <Col lg={6}>
            <V2VelocityTimeChart interval={updateInterval} />
          </Col>
          <Col lg={6}>
            <V2PowerTimeChart interval={updateInterval} />
          </Col>
        </Row>
        <Row>
          <Col lg={6}>
            <V2CadenceTimeChart interval={updateInterval} />
          </Col>
          <Col lg={6}>
            <LocationTimeChart interval={updateInterval} />
          </Col>
        </Row>
      </div>
    );
  }

  /**
   * Render the text-mode dashboard
   *
   * @returns {React.Component} Component
   * */
  function renderTextDashboard() {
    return (
      <Container>
        <V2TextModeChart />
      </Container>
    );
  }

  return (
    <Container fluid>
      <Row className="align-items-center">
        <Col sm={8}>
          <h5 style={{ visibility: filename === null ? 'hidden' : 'visible' }}>
            {`Current Filename: ${filename}`}
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
      {textMode ? renderTextDashboard() : renderGraphicalDashboard()}
    </Container>
  );
}
