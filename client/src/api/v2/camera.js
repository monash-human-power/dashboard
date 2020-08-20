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
 * Initiate receiving camera recording statuses
 */
function initCameraStatus() {
  emit('send-camera-recording-payloads');
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
    initCameraStatus();
  }, []);

  const [lastPayload, setLastPayload] = useState(null);

  const update = useCallback((newPayload) => {
    // Update last payload
    setLastPayload(newPayload);
  }, []);

  useChannel(`camera-recording-status-${device}`, update);

  return parseRecordingPayloadData(lastPayload);
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
 * Initiate receiving camera video feed statuses
 */
function initVideoFeedStatus() {
  emit('send-video-feed-payloads');
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
    initVideoFeedStatus();
  }, []);

  const [payloads, setPayloads] = useState({}); // Payloads is Object.<string, string payload>

  const handler = useCallback((newPayloads) => {
    setPayloads(newPayloads);
  }, []);

  useChannel(`camera-video-feed-status`, handler);

  return payloads;
}
