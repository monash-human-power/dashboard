import {
  getPrettyDeviceName,
  startRecording,
  stopRecording,
  useVideoFeedStatus
} from 'api/v2/camera';
import PropTypes from 'prop-types';
import React from 'react';
import { Badge, Button, Card, Col, Row } from 'react-bootstrap';
import styles from './CameraRecording.module.css';
import CameraRecordingStatus from './CameraRecordingStatus';

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
  const status = useVideoFeedStatus();

  // Check if at least one camera's video feed is online
  const canRecord = Object.keys(status).find((device) => status[device]?.online);

  return (
    <Card>
      <Card.Body>
        <Card.Title>Recording Controls</Card.Title>
        <Row className={styles.row}>
          {devices.map((device) => (
            <Col className={styles.col} key={device} sm={6}>
              <Card.Subtitle>
                <Badge pill variant={status[device]?.online ? 'success' : 'danger'}>
                  {status[device]?.online ? 'ON' : 'OFF'}
                </Badge>
                <span className={styles.deviceName}>
                  {`${getPrettyDeviceName(device)} Camera`}
                </span>
              </Card.Subtitle>
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
          disabled={!canRecord}
        >
          Start
        </Button>
        <Button
          className={styles.button}
          variant="outline-danger"
          onClick={stopRecording}
          disabled={!canRecord}
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
