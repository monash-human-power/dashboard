import { useCallback, useEffect, useState } from 'react';
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
 * @typedef {object} CameraMessageHook
 * @property {string} message The message currently entered by the user.
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

  const sendMessage = () => {
    if (!message) return;

    emit('send-message', message);
    setMessage('');
  };

  return { message, setMessage, sendMessage };
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
 * @param {string?} device Device (primary or secondary)
 */
function initStatus(subComponent, device) {
  const deviceAsArr = device ? [device] : []; // only add device path if specified
  const path = ['camera', subComponent].concat(deviceAsArr);
  emit(`get-status-payload`, path);
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
 * @typedef {object} StatusPayloadOptions
 *
 * @property {any?} initValue Initial value for the payload
 * @property {(setter: (p: any) => void, newPayload: any, device: string?) => any?} payloadHandler Handler for updating payload
 * @property {(payload: any?, device: string?) => any?} returnHandler Handler for return value
 */
/**
 * Create hooks for getting payloads
 *
 * @param {string} sub Subcomponent
 * @param {StatusPayloadOptions} opts Options
 * @returns {(device: string?) => any} Hook for getting a payload
 */
function createStatusPayloadHook(
  sub,
  {
    initValue = null,
    payloadHandler = (s, p) => s(p ?? initValue),
    returnHandler = (p) => p,
  },
) {
  return function _hook(device) {
    // Only run init once per render
    useEffect(() => {
      initStatus(sub);
    }, []);

    const [payload, setPayload] = useState(initValue);
    useChannel(`status-camera-${sub}`, (newPayload) =>
      payloadHandler(setPayload, newPayload, device),
    );

    return returnHandler(payload, device);
  };
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
 * Returns the last status payload published
 *
 * @param {string} device Device
 * @returns {CameraRecordingStatusPayload} Payload
 */
export const useCameraRecordingStatus = createStatusPayloadHook('recording', {
  returnHandler: (payload, device) =>
    parseRecordingPayloadData(payload?.[device]),
});

/**
 * @typedef {object} VideoFeedStatus
 * @property {boolean}  online Whether video feed is on/off
 */
/**
 * Returns the last received status of the video feeds from `/v3/camera/video-feed/status/<primary/secondary>`
 *
 * @returns {object.<string, VideoFeedStatus>} A VideoFeedStatus for each device
 */
export const useVideoFeedStatus = createStatusPayloadHook('video-feed', {
  initValue: {},
});

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
export const useCameraStatus = (device) =>
  createStatusPayloadHook(device, {
    initValue: false,
    payloadHandler: (setState, newPayload) =>
      setState(newPayload?.connected ?? false),
  })(device);
