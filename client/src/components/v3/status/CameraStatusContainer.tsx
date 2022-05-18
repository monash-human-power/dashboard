/* eslint-disable indent */
import React, { useEffect } from 'react';
import { Card, Row } from 'react-bootstrap';

import CameraStatus, {
  CameraStatusProps,
} from 'components/v3/status/CameraStatus';
import {
  useCameraBattery,
  useCameraStatus,
  useVideoFeedStatus,
} from 'api/common/camera';
import { emit } from 'api/common/socket';
import { getPrettyDeviceName } from 'utils/string';

/**
 * Container for CameraStatus
 *
 * @returns Component
 */
export default function CameraStatusContainer(): JSX.Element {
  const primaryProps: CameraStatusProps = {
    cameraName: getPrettyDeviceName('primary'),
    online: useCameraStatus('primary')?.connected ?? false,
    ip: useCameraStatus('primary')?.ipAddress ?? 'Error no IP',
    battery: useCameraBattery('primary')?.voltage ?? null,
    videoFeedEnabled: useVideoFeedStatus('primary')?.online ?? null,
  };

  const secondaryProps: CameraStatusProps = {
    cameraName: getPrettyDeviceName('secondary'),
    online: useCameraStatus('secondary')?.connected ?? false,
    ip: useCameraStatus('primary')?.ipAddress ?? 'Error no IP',
    battery: useCameraBattery('secondary')?.voltage ?? null,
    videoFeedEnabled: useVideoFeedStatus('secondary')?.online ?? null,
  };

  useEffect(() => {
    emit('get-payload', ['status', `camera`, `primary`, 'battery']);
    emit('get-payload', ['status', `camera`, `secondary`, 'battery']);
  }, []);

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
