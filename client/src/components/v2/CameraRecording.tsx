import { VideoFeedStatus } from 'api/v2/camera';
import React from 'react';
import { Badge, Button, Card, Col, Row } from 'react-bootstrap';
import styles from './CameraRecording.module.css';
import CameraRecordingStatus, { CameraRecordingStatusProps } from './CameraRecordingStatus';

export type CameraRecordingPropT = VideoFeedStatus & CameraRecordingStatusProps & { ip: string };

export interface CameraRecordingProps {
  /** Information for primary device */
  primary: CameraRecordingPropT
  /** Information for secondary device */
  secondary: CameraRecordingPropT
  startRecording: () => void
  stopRecording: () => void
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
export default function CameraRecording({
  primary,
  secondary,
  startRecording,
  stopRecording
}: CameraRecordingProps): JSX.Element {
  // Check if at least one camera's video feed is online
  const canRecord = primary.online || secondary.online;

  return (
    <Card>
      <Card.Body>
        <Card.Title>Recording Controls</Card.Title>
        <Row className={styles.row}>
          {/* Device recording controls UI for primary device */}
          <Col className={styles.col} key='primary' sm={6}>
            <Card.Subtitle className={styles.subtitle}>
              {/* Name */}
              <span className={styles.deviceName}>
                Primary
                </span>
              {/* Online status */}
              <Badge className={styles.indicator} pill variant={primary.online ? 'success' : 'danger'}>
                {primary.online ? 'Online' : 'Offline'}
              </Badge>
              {/* IP */}
              <div className={styles.push}>{primary.ip}</div>
            </Card.Subtitle>
            {/* Fields */}
            <CameraRecordingStatus statusFormatted={primary?.statusFormatted} />
          </Col>
          {/* Device recording controls UI for secondary device */}
          <Col className={styles.col} key='secondary' sm={6}>
            <Card.Subtitle className={styles.subtitle}>
              {/* Name */}
              <span className={styles.deviceName}>
                Primary
                </span>
              {/* Online status */}
              <Badge className={styles.indicator} pill variant={secondary.online ? 'success' : 'danger'}>
                {secondary.online ? 'Online' : 'Offline'}
              </Badge>
              {/* IP */}
              <div className={styles.push}>{secondary.ip}</div>
            </Card.Subtitle>
            {/* Fields */}
            <CameraRecordingStatus statusFormatted={secondary?.statusFormatted} />
          </Col>
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
