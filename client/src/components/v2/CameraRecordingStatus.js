import React from 'react';
import PropTypes from 'prop-types';
import { useCameraRecordingStatus } from 'api/v2/camera';

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
  const payload = useCameraRecordingStatus(device);

  return (
    <div>
      {
        payload
          ? Object.keys(payload)
            .map((field) => (
              <p key={field}>{`${field}: ${payload[field]}`}</p>
            ))
          : <p>{`Status: ${defaultStatus}`}</p>
      }
    </div>
  );
}

CameraRecordingStatus.propTypes = {
  device: PropTypes.string.isRequired,
};
