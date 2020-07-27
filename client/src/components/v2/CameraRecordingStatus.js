import React, { useCallback, useState } from 'react';
import { useChannel, emit } from 'api/v2/socket';
import formatBytes from 'utils/formatBytes';
import PropTypes from 'prop-types';

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
  /**
   * Format a camera recording status payload into JSX
   *
   * @param {string} payload Payload structure is defined in https://www.notion.so/V3-MQTT-Topics-66e6715d0e1941ffaa82020e5868fbae. See /v3/camera/recording/status/<primary/>secondary>
   * @returns {React.Component} Component
   */
  function formatPayload(payload) {
    const data = JSON.parse(payload);
    if (!data) return null;

    let info;
    let mins; // only used for status "recording"
    let secs; // only used for status "recording"
    switch (data.status) {
      case 'off':
        info = null;
        break;

      case 'recording':
        mins = Math.floor(data.recordingMinutes);
        secs = (data.recordingMinutes - mins) * 60;
        info = (
          <div>
            <p>{`File Name: ${data.recordingFile}`}</p>
            <p>{`Time: ${mins} minutes ${secs} seconds`}</p>
          </div>
        );
        break;

      case 'error':
        info = <p>{data.error}</p>;
        break;

      default:
        console.error(`Invalid recording status: ${data.status}`);
        break;
    }

    return (
      <div>
        <p>{`Status: ${data.status}`}</p>
        {info}
        <div>{`Disk Space Remaining: ${formatBytes(data.diskSpaceRemaining)}`}</div>
      </div>
    );
  }

  const lastPayload = sessionStorage.getItem(`camera-recording-last-payload-${device}`);
  const [status, setStatus] = useState((
    <div>
      {
        lastPayload ? formatPayload(lastPayload) : 'Waiting for status...'
      }
    </div>
  ));

  const updateStatus = useCallback((payload) => {
    // store payload for session
    sessionStorage.setItem(`camera-recording-last-payload-${device}`, payload);

    setStatus(formatPayload(payload));
  }, [device]);

  useChannel(`camera-recording-status-${device}`, updateStatus);

  emit('camera-recording-init');

  return (
    <div>{status}</div>
  );
}

CameraRecordingStatus.propTypes = {
  device: PropTypes.string.isRequired,
};
