import { useCallback, useEffect, useState, useRef } from 'react';
import formatBytes from 'utils/formatBytes';
import { camelCaseToStartCase, capitalise } from 'utils/string';
import { emit, useChannel } from './socket';

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
  const [message, setMessage] = useState('');
  const [received, setReceived] = useState(false);
  const [sending, setSending] = useState(false);
  const receivedTimeout = useRef(null);

  const receivedCallback = useCallback(() => {
    clearTimeout(receivedTimeout.current);
    setMessage('');
    setReceived(true);
    setSending(false);

    // Remove the "received" status after 5 seconds
    receivedTimeout.current = setTimeout(() => {
      setReceived(false);
    }, 5000);
  }, []);

  useChannel('send-message-received', receivedCallback);

  return { message, received, sending, setMessage, setSending };
}

/**
 * Sends a message to be shown on the camera overlay.
 *
 * @param {string} message The message to be sent
 * @returns {boolean} True only if a message has been sent.
 */
export function sendMessage(message) {
  if (!message) return false;

  emit('send-message', message);
  return true;
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
 * Parse the recording payload into an object and format the values
 *
 * Payload structure is defined in the 'V3 MQTT Topics' page on Notion.
 * Topic is /v3/camera/recording/status/<primary/>secondary>.
 *
 * @param {string} data Payload in JSON form
 * @returns {CameraRecordingStatusPayload} Formatted payload without status
 */
function parseRecordingPayloadData(data) {
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
 * Initiate receiving status payloads
 *
 * @param {string} subComponent The sub component to init for (e.g. recording, video feed)
 */
function initStatus(subComponent) {
  emit(`status-camera-${subComponent}`);
}

/**
 * Returns the last status payload published
 *
 * @param {string} device Device
 * @returns {CameraRecordingStatusPayload} Payload
 */
export function useCameraRecordingStatus(device) {
  // Only run init once per render
  useEffect(() => {
    initStatus('recording');
  }, []);

  const [lastPayload, setLastPayload] = useState(null);

  const update = useCallback((newPayload) => {
    // Update last payload
    setLastPayload(newPayload);
  }, []);

  useChannel(`status-camera-recording`, update);

  return parseRecordingPayloadData(lastPayload && lastPayload[device]);
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

/**
 * @typedef {object} VideoFeedStatus
 * @property {boolean}  online Whether video feed is on/off
 */

/**
 * Returns the last received status of the video feeds from `/v3/camera/video-feed/status/<primary/secondary>`
 *
 * @returns {object.<string, VideoFeedStatus>} A VideoFeedStatus for each device
 */
export function useVideoFeedStatus() {
  // Only run init once per render
  useEffect(() => {
    initStatus('video-feed');
  }, []);

  const [payload, setPayloads] = useState({}); // Payloads is Object.<string, string payload>

  const handler = useCallback((newPayload) => {
    setPayloads(newPayload);
  }, []);

  useChannel(`status-camera-video-feed`, handler);

  return payload;
}

/**
 * @typedef {object} CameraStatus
 * @property {boolean}  online Whether camera is connected / not connected
 */
/**
 * Returns the last received connection status of the camera client to the mqtt broker
 *
 * @param {string} device Device
 * @returns {CameraStatus} Camera status
 */
export function useCameraStatus(device) {
  // Only run init once per render
  useEffect(() => {
    emit(`status-camera-${device}`);
  }, [device]);

  const [state, setState] = useState(false);

  const handler = useCallback((newPayload) => {
    setState(newPayload.connected);
  }, []);

  useChannel(`status-camera-${device}`, handler);

  return state;
}
