import { VideoFeedStatus } from 'api/v2/camera';
import React from 'react';
import { Badge, Button, Card, Col, Row } from 'react-bootstrap';
import { capitalise } from '../../utils/string';
import styles from './CameraRecording.module.css';
import CameraRecordingStatus, { CameraRecordingStatusProps } from './CameraRecordingStatus';

export type CameraRecordingPropT = VideoFeedStatus & CameraRecordingStatusProps & { ip: string };

export interface CameraRecordingProps {
  /** Information for primary device */
  primary: CameraRecordingPropT
  /** Information for secondary device */
  secondary: CameraRecordingPropT
  /** Handler for starting recording */
  startRecording: () => void
  /** Handler for stopping recording */
  stopRecording: () => void
}

/**
 * Camera recording buttons for starting and stopping video recording.
 *
 * Starts/stops recording for both displays.
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
          {/* Device recording controls UI for device */}
          {
            [{
              device: primary,
              deviceName: 'primary'
            }, {
              device: secondary,
              deviceName: 'secondary'
            }].map(({ device, deviceName }) =>
              <Col className={styles.col} key={deviceName} sm={6}>
                <Card.Subtitle className={styles.subtitle}>
                  {/* Name */}
                  <span className={styles.deviceName}>
                    {capitalise(deviceName)}
                  </span>
                  {/* Online status */}
                  <Badge className={styles.indicator} pill variant={device.online ? 'success' : 'danger'}>
                    {device.online ? 'Online' : 'Offline'}
                  </Badge>
                  {/* IP */}
                  <div className={styles.push}>{device.ip}</div>
                </Card.Subtitle>
                {/* Fields */}
                <CameraRecordingStatus statusFormatted={device?.statusFormatted} />
              </Col>
            )
          }
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
