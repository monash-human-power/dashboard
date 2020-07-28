import React from 'react';
import PropTypes from 'prop-types';
import {
  getInfoFromPayload, useCameraRecordingStatus, initCameraStatus, getStatusFromPayload,
} from 'api/v2/camera';

const defaultStatus = 'Waiting for status...';

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
  const lastPayload = useCameraRecordingStatus(device);

  initCameraStatus();

  return (
    <div>
      <p>{`Status: ${getStatusFromPayload(lastPayload) || defaultStatus}`}</p>
      {getInfoFromPayload(lastPayload)}
    </div>
  );
}

CameraRecordingStatus.propTypes = {
  device: PropTypes.string.isRequired,
};
