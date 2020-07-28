import React from 'react';
import PropTypes from 'prop-types';
import {
  useCameraRecordingStatus, initCameraStatus, formatPayload,
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
  initCameraStatus();

  const fPayload = formatPayload(useCameraRecordingStatus(device));

  console.log(fPayload);

  return (
    <div>
      {
        fPayload
          ? Object.keys(fPayload)
            .map((field) => (
              <p key={field}>{`${field}: ${fPayload[field]}`}</p>
            ))
          : <p>{`Status: ${defaultStatus}`}</p>
      }
    </div>
  );
}

CameraRecordingStatus.propTypes = {
  device: PropTypes.string.isRequired,
};
