import React, { useCallback, useState } from 'react';
import { useChannel, emit } from 'api/v2/socket';
import PropTypes from 'prop-types';
import {
  getLastPayload, storeLastPayload, getStatusFromPayload, getInfoFromPayload,
} from 'api/v2/camera';

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
  const [lastPayload, setLastPayload] = useState(getLastPayload(device));
  const [status, setStatus] = useState(getStatusFromPayload(lastPayload) || 'Waiting for status...');

  const update = useCallback((payload) => {
    // update last payload
    storeLastPayload(device, payload);
    setLastPayload(payload);

    // update status
    setStatus(getStatusFromPayload(payload));
  }, [device]);

  useChannel(`camera-recording-status-${device}`, update);

  emit('camera-recording-init');

  return (
    <div>
      <p>
        Status:
        {' '}
        {status}
      </p>
      <div>
        <p>{getInfoFromPayload(lastPayload)}</p>
      </div>
    </div>
  );
}

CameraRecordingStatus.propTypes = {
  device: PropTypes.string.isRequired,
};
