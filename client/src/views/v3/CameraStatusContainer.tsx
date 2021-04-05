/* eslint-disable indent */
import React from 'react';
import { Card, Row } from 'react-bootstrap';

import CameraStatus, {
  CameraStatusProps,
} from 'components/v3/status/CameraStatus';
import {
  getPrettyDeviceName,
  useCameraBattery,
  useCameraStatus,
  useVideoFeedStatus,
} from 'api/common/camera';

/**
 * Container for CameraStatus
 *
 * @returns Component
 */
export default function CameraStatusContainer(): JSX.Element {
  const primaryProps: CameraStatusProps = {
    cameraName: getPrettyDeviceName('primary'),
    online: useCameraStatus('primary')?.connected ?? false,
    ip: '501 not implemented',
    battery: useCameraBattery('primary')?.percentage ?? null,
    videoFeedStatus: useVideoFeedStatus('primary')?.online ?? null,
  };

  const secondaryProps: CameraStatusProps = {
    cameraName: getPrettyDeviceName('secondary'),
    online: useCameraStatus('secondary')?.connected ?? false,
    ip: '501 not implemented',
    battery: useCameraBattery('secondary')?.percentage ?? null,
    videoFeedStatus: useVideoFeedStatus('secondary')?.online ?? null,
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title>Camera System</Card.Title>
        <Row>
          {/* Primary Camera Status */}
          <CameraStatus {...primaryProps} />

          {/* Secondary Camera Status */}
          <CameraStatus {...secondaryProps} />
        </Row>
      </Card.Body>
    </Card>
  );
}
