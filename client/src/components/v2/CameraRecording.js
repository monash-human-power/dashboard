import {
  getPrettyDeviceName, startRecording,
  stopRecording,
  useVideoFeedStatus
} from 'api/v2/camera';
import PropTypes from 'prop-types';
import React from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import styles from './CameraRecording.module.css';
import CameraRecordingStatus from './CameraRecordingStatus';
import OnlineIndicator from './OnlineIndicator';

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

  return (
    <Card>
      <Card.Body>
        <Card.Title>Recording Controls</Card.Title>
        <Row className={styles.row}>
          {devices.map((device) => {
            return (
              <Col className={styles.col} key={device} sm={6}>
                <Card.Subtitle>
                  <OnlineIndicator className={styles.indicator} online={!!status[device]?.online} />
                  <span>{`${getPrettyDeviceName(device)} Camera`}</span>
                </Card.Subtitle>
                <CameraRecordingStatus device={device} />
              </Col>
            );
          })}
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
