import { getPrettyDeviceName, useCameraStatus, CameraDevice } from 'api/v2/camera';
import PropTypes from 'prop-types';
import React from 'react';
import { Badge } from 'react-bootstrap';

/**
 * @typedef {object} CameraStatusProps
 * @property {CameraDevice} device Device name
 */

/**
 * Camera recording buttons for starting and stopping video recording.
 *
 * Starts/stops recording for both displays.
 *
 * This is a feature intended for V3 but is currently in V2 for testing.
 *
 * @param {CameraStatusProps} props Props
 * @returns {React.Component<CameraStatusProps>} Component
 */
export default function CameraStatus({ device }) {
  const status = useCameraStatus(device);

  return (
    <>
      <Badge pill variant={status.connected ? 'success' : 'danger'}>
        {status.connected ? 'Connected' : 'Disconnected'}
      </Badge>
      <br />
      <span>{`${getPrettyDeviceName(device)} Camera`}</span>
    </>
  );
}

CameraStatus.propTypes = {
  device: PropTypes.string.isRequired,
};
