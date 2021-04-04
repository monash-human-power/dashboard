import React from 'react';
import { useCameraStatus } from 'api/common/camera';
import CameraStatus from 'components/common/camera_settings/CameraStatus';

/**
 * Container for {@link CameraStatus}
 *
 * @returns Component
 */
export default function CameraStatusContainer(): JSX.Element {
  const primaryStatus = useCameraStatus('primary')?.connected ?? false;
  const secondaryStatus = useCameraStatus('secondary')?.connected ?? false;

  return (
    <CameraStatus
      primaryStatus={primaryStatus}
      secondaryStatus={secondaryStatus}
    />
  );
}
