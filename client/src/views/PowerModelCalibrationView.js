import React, { useState, useCallback, useRef } from 'react';
import {
  Alert,
  Button,
  Card,
  Form,
  InputGroup,
} from 'react-bootstrap';
import ContentPage from 'components/ContentPage';
import { setCalibration, resetCalibration } from 'api/v2/powerModel';

/**
 * Power Model Calibration page component
 *
 * @returns {React.Component} Component
 */
export default function PowerModelCalibrationView() {
  const distanceEl = useRef(null);
  const [distanceSet, setDistanceSet] = useState(false);

  const handleDistanceSubmit = useCallback((event) => {
    const { form } = event.currentTarget;
    if (form.checkValidity()) {
      setCalibration(distanceEl.current.value);
      setDistanceSet(true);
    }
  }, []);

  const handleResetDistance = useCallback(() => {
    resetCalibration();
    setDistanceSet(false);
  }, []);

  return (
    <ContentPage title="Power Model Calibration">
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Current Actual Distance</Card.Title>
          <Form validated>
            <InputGroup>
              <Form.Control
                ref={distanceEl}
                type="number"
                placeholder="Current distance"
                min="0"
                required
              />
              <InputGroup.Append>
                <Button
                  variant="outline-secondary"
                  onClick={handleDistanceSubmit}
                >
                  Submit
                </Button>
              </InputGroup.Append>
            </InputGroup>
          </Form>
          {!!distanceSet && (
            <Alert variant="success">Distance sent!</Alert>
          )}
        </Card.Body>
      </Card>
      <Card>
        <Card.Body>
          <Card.Title>Reset Distance</Card.Title>
          <Button variant="danger" onClick={handleResetDistance}>Reset Calibrated Distance</Button>
        </Card.Body>
      </Card>
    </ContentPage>
  );
}
