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

  const handleData = useCallback(
    (data) => {
      const json = JSON.parse(data);
      if (json.device === device) {
        setOverlays({
          active: json.activeOverlay,
          overlays: json.overlays,
        });
      }
    },
    [device],
  );
  useChannel('push-overlays', handleData);

  useEffect(() => {
    emit('get-overlays');
  }, [device]);

  const setActiveOverlay = useCallback(
    (activeOverlay) => {
      emit(
        'set-overlays',
        JSON.stringify({
          [device]: activeOverlay,
        }),
      );
    },
    [device],
  );

  return { overlays, setActiveOverlay };
}

/**
 * @typedef {object} CameraMessageState
 * @property {string} message The message currently entered by the user.
 * @property {boolean} received Specifies whether a sent message has been
 *                              acknowledged by the server in the last 5
 *                              seconds.
 * @property {boolean} sending Specifies whether we are waiting for an
 *                             acknowledgement for the most recent message.
 */

/**
 * @typedef {object} CameraMessageHook
 * @property {CameraMessageState} state Current state of the messages.
 * @property {function(string)} setMessage Set the message.
 * @property {function(void)} sendMessage Send the message to the rider.
 */

/**
 * Handle storing, sending and receiving acknowledgement of messages to the
 * camera overlay.
 *
 * @returns {CameraMessageHook} Hook
 */
export function useMessageState() {
  const [state, setState] = useState({
    message: '',
    received: false,
    sending: false,
  });
  let receivedTimeout;

  const receivedCallback = useCallback(() => {
    clearTimeout(receivedTimeout);
    setState({
      ...state,
      received: true,
      sending: false,
    });

    // Remove the "received" status after 5 seconds
    receivedTimeout = setTimeout(() => {
      setState({
        ...state,
        message: '',
        received: false,
      });
    }, 5000);
  }, []);

  useChannel('send-message-received', receivedCallback);

  const setMessage = useCallback(
    (message) => {
      setState({
        ...state,
        message,
      });
    },
    [state, setState],
  );

  const sendMessage = useCallback(() => {
    if (!state.message) return;

    emit('send-message', state.message);
    setState({
      ...state,
      sending: true,
    });
  }, [state, setState]);

  return { state, setMessage, sendMessage };
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
  const data = JSON.parse(payload);
  if (!data) return null;

  const formattedData = {};

  Object.keys(data).forEach((field) => {
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
          const secs = Math.floor((data.recordingMinutes - mins) * 60);
          value = `${mins}m ${secs}s`;
          name = 'Recording Time';
        }
        break;

      default:
        value = data[field];
        break;
    }

    formattedData[name] = value;
  });

  return formattedData;
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
 * @returns {string} Prettied device name
 */
export function getPrettyDeviceName(device) {
  return device === 'primary' ? 'Primary' : 'Secondary';
}
