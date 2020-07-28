import React from 'react';
import PropTypes from 'prop-types';
import { getInfoFromPayload, useCameraRecordingStatus, initCameraStatus } from 'api/v2/camera';

/**
 * @typedef {object} CameraRecordingStatusProps
 * @property {'primary'|'secondary'} device Camera screen
 */

/**
 *  Status of a camera
 *
 * @param {CameraRecordingStatusProps} props Props
 * @returns {React.Component<CameraRecordingStatusProps>} Component
 */
export default function CameraRecordingStatus({ device }) {
  const { status, lastPayload } = useCameraRecordingStatus(device);

  initCameraStatus();

  return (
    <div>
      <p>
        Status:
        {' '}
        {status}
      </p>
      {getInfoFromPayload(lastPayload)}
    </div>
  );
}

CameraRecordingStatus.propTypes = {
  device: PropTypes.string.isRequired,
};
