import { useState, useEffect, useCallback } from 'react';
import formatBytes from 'utils/formatBytes';
import { camelCaseToStartCase, capitalise } from 'utils/string';
import { useChannel, emit } from './socket';

/**
 * @typedef {object} OverlaysHook
 * @property {?Array.<string>}  overlays          List of available overlays
 * @property {function(string)} setActiveOverlay  Set the active overlay
 */

/**
 * Use a list of camera overlays
 *
 * @param {'primary'|'secondary'} device Camera screen
 * @returns {OverlaysHook} Hook
 */
export function useOverlays(device) {
  const [overlays, setOverlays] = useState(null);

  const handleData = useCallback((data) => {
    const json = JSON.parse(data);
    if (json.device === device) {
      setOverlays({
        active: json.activeOverlay,
        overlays: json.overlays,
      });
    }
  }, [device]);
  useChannel('push-overlays', handleData);

  useEffect(() => {
    emit('get-overlays');
  }, [device]);

  const setActiveOverlay = useCallback((activeOverlay) => {
    emit('set-overlays', JSON.stringify({
      [device]: activeOverlay,
    }));
  }, [device]);

  return { overlays, setActiveOverlay };
}

/**
 * Send a message to server to start recording video
 */
export function startRecording() {
  emit('start-camera-recording');
}

/**
 * Send a message to server to stop recording video
 */
export function stopRecording() {
  emit('stop-camera-recording');
}

/**
 * @typedef {object} CameraRecordingStatusPayload
 * @property {string} status Status of recording
 * @property {?string} recordingMinutes Length of recording
 * @property {?string} recordingFile File name of recording
 * @property {?string} diskSpaceRemaining Remaining space on disk
 * @property {?string} error Error message from camera
 */

/**
 * Parse the payload into an object and format the values
 *
 * Payload structure is defined in the 'V3 MQTT Topics' page on Notion.
 * Topic is /v3/camera/recording/status/<primary/>secondary>.
 *
 * @param {string} payload Payload
 * @returns {CameraRecordingStatusPayload} Formatted payload without status
 */
function parsePayload(payload) {
  const data = typeof payload === 'string' ? JSON.parse(payload) : payload;
  if (!data) return null;

  return Object.keys(data)
    .reduce((acc, field) => {
      let name = camelCaseToStartCase(field);
      let value = '';

      // format field value
      switch (field) {
        case 'status':
          value = capitalise(data[field]);
          break;

        case 'diskSpaceRemaining':
          value = formatBytes(data.diskSpaceRemaining);
          break;

        case 'recordingMinutes':
          {
            const mins = Math.floor(data.recordingMinutes);
            const secs = (data.recordingMinutes - mins) * 60;
            value = `${mins} minutes ${secs} seconds`;
            name = 'Recording Time';
          }
          break;

        default:
          value = data[field];
          break;
      }

      acc[name] = value;
      return acc;
    }, {});
}

/**
 * Initiate receiving camera recording statuses
 */
function initCameraStatus() {
  emit('send-last-received-camera-recording-payloads');
}

/**
 * Returns the last status payload published
 *
 * @param {string} device Device
 * @returns {CameraRecordingStatusPayload} Payload
 */
export function useCameraRecordingStatus(device) {
  // only run init once per render
  useEffect(() => {
    initCameraStatus();
    return () => {};
  }, []);

  const [lastPayload, setLastPayload] = useState(null);

  const update = useCallback((newPayload) => {
    // update last payload
    setLastPayload(newPayload);
  }, []);

  useChannel(`camera-recording-status-${device}`, update);

  return parsePayload(lastPayload);
}

/**
 * Makes the device name pretty.
 *
 * Hardcoded for efficiency. If you don't like it, complain to Angus Trau :).
 *
 * @param {'primary' | 'secondary'} device Device
 * @returns {'Primary' | 'Secondary'} Prettied device name
 */
export function getPrettyDeviceName(device) {
  return device === 'primary' ? 'Primary' : 'Secondary';
}
