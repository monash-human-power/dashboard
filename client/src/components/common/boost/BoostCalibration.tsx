import React, { useState, useCallback } from 'react';
import { Button, Card, Form, Col } from 'react-bootstrap';
import { roundNum } from 'utils/data';

export interface BoostCalibrationProps {
  onSet: (calibValue: number) => void;
  onReset: () => void;
  distTravelled: number;
  calibrationDiff: number | null;
}

/**
 * Boost calibration card, displays the calibrated distance and the
 * distance travelled by the bike while also allowing user to set the
 * calibrated distance
 *
 * @returns {React.Component} Component
 */
export default function BoostCalibration({
  onSet,
  onReset,
  distTravelled,
  calibrationDiff,
}: BoostCalibrationProps) {
  // Controls the feedback form
  const [validated, setValidated] = useState(false);
  const [calibValue, setCalibValue] = useState(0);

  const handleCalibrationChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setCalibValue(parseInt(event.target.value, 10));
    },
    [setCalibValue],
  );

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      const form = event.currentTarget;
      if (form.checkValidity() === false) {
        event.stopPropagation();
      } else {
        onSet(calibValue);
      }
      event.preventDefault();
      setValidated(true);
    },
    [calibValue, onSet, setValidated],
  );

  const displayCalibratedDistance = () => {
    if (calibrationDiff !== null) {
      return `${roundNum(distTravelled + calibrationDiff, 2)} m`;
    }
    return 'N/A';
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title>Calibration</Card.Title>
        <Card.Text>
          BOOST may use a distance different to the bike&apos;s travelled
          distance for the purposes of generating power plan data.
        </Card.Text>
        <div className="pb-3">
          <b>Distance travelled </b>
          <span className="float-right pr-4">
            {' '}
            {roundNum(distTravelled, 2)}
            {' m'}
          </span>
        </div>
        <div className="pb-3">
          <b>Calibrated distance </b>
          <span className="float-right pr-4">
            {displayCalibratedDistance()}
          </span>
        </div>
        <Form
          noValidate
          validated={validated}
          onSubmit={handleSubmit}
          onBlur={() => {
            setValidated(false);
          }}
        >
          <Form.Row>
            <Form.Group as={Col} md="4">
              <Form.Control
                type="number"
                placeholder="Calibrate distance..."
                onChange={handleCalibrationChange}
                required
              />

              <Form.Control.Feedback type="invalid">
                Please provide a valid calibration distance.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col}>
              <Button type="submit">Set</Button>
              <Button
                variant="outline-danger"
                className="float-right pr-3"
                onClick={onReset}
              >
                Reset
              </Button>
            </Form.Group>
          </Form.Row>
        </Form>
      </Card.Body>
    </Card>
  );
}
