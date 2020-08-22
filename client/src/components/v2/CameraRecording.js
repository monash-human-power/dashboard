import React from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';
import {
  startRecording,
  stopRecording,
  getPrettyDeviceName,
} from 'api/v2/camera';
import CameraRecordingStatus from './CameraRecordingStatus';
import styles from './CameraRecording.module.css';

/**
 * @typedef {object} CameraRecordingProps
 * @property {string[]} devices Device names
 */

/**
 * Camera recording buttons for starting and stopping video recording.
 *
 * Starts/stops recording for both displays.
 *
 * This is a feature intended for V3 but is currently in V2 for testing.
 *
 * @param {CameraRecordingProps} props Props
 * @returns {React.Component<CameraRecordingProps>} Component
 */
export default function CameraRecording({ devices }) {
  return (
    <Card>
      <Card.Body>
        <Card.Title>Recording Controls</Card.Title>
        <Row className={styles.row}>
          {devices.map((device) => (
            <Col className={styles.col} key={device} sm={6}>
              <Card.Subtitle>{getPrettyDeviceName(device)}</Card.Subtitle>
              <CameraRecordingStatus device={device} />
            </Col>
          ))}
        </Row>
      </Card.Body>
      <Card.Footer>
        <Button
          className={styles.button}
          variant="outline-success"
          onClick={startRecording}
        >
          Start
        </Button>
        <Button
          className={styles.button}
          variant="outline-danger"
          onClick={stopRecording}
        >
          Stop
        </Button>
      </Card.Footer>
    </Card>
  );
}

CameraRecording.propTypes = {
  devices: PropTypes.arrayOf(String).isRequired,
};
