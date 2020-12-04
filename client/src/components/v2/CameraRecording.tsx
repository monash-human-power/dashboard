import {
  getPrettyDeviceName,
  startRecording,
  stopRecording
} from 'api/v2/camera';
import React from 'react';
import { Badge, Button, Card, Col, Row } from 'react-bootstrap';
import styles from './CameraRecording.module.css';
import CameraRecordingStatus, { CameraRecordingStatusProps } from './CameraRecordingStatus';

// ! Remove this before merging and instead import from camera
interface VideoFeedStatus {
  online: boolean
}

export type CameraRecordingPropT = VideoFeedStatus & CameraRecordingStatusProps & {ip: string};

export interface CameraRecordingProps {
  /* Information for each device */
  [device: string]: CameraRecordingPropT
}

/**
 * Camera recording buttons for starting and stopping video recording.
 *
 * Starts/stops recording for both displays.
 *
 * This is a feature intended for V3 but is currently in V2 for testing.
 *
 * @param props Props
 * @returns Component
 */
export default function CameraRecording(props: CameraRecordingProps) {
  // Check if at least one camera's video feed is online
  const canRecord = Object.keys(props).find((device) => props[device]?.online);

  return (
    <Card>
      <Card.Body>
        <Card.Title>Recording Controls</Card.Title>
        <Row className={styles.row}>
          {Object.entries(props).map(([device, { online }]) => (
            /* Device recording controls UI */
            <Col className={styles.col} key={device} sm={6}>
              <Card.Subtitle className={styles.subtitle}>
                {/* Name */}
                <span className={styles.deviceName}>
                  {`${getPrettyDeviceName(device as "primary" | "secondary")}`}
                </span>
                {/* Online status */}
                <Badge className={styles.indicator} pill variant={online ? 'success' : 'danger'}>
                  {online ? 'Online' : 'Offline'}
                </Badge>
                {/* IP */}
                <div className={styles.push}>{props[device].ip}</div>
              </Card.Subtitle>
              {/* Fields */}
              <CameraRecordingStatus statusFormatted={props[device]?.statusFormatted} />
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
