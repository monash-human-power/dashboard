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
 * Get the last MQTT payload for the status of a camera recording
 *
 * @param {string} device Camera
 * @returns {string} Payload
 */
export function getLastPayload(device) {
  return sessionStorage.getItem(`camera-recording-last-payload-${device}`);
}

/**
 * Store the last MQTT payload for the status of a camera recording
 *
 * @param {string} device Camera
 * @param {string} payloadString String representation of payload
 * @returns {string} Payload
 */
export function storeLastPayload(device, payloadString) {
  return sessionStorage.setItem(`camera-recording-last-payload-${device}`, payloadString);
}

/**
 * Format the payload information (fields other than status)
 *
 * Payload structure is defined in the 'V3 MQTT Topics' page on Notion.
 * Topic is /v3/camera/recording/status/<primary/>secondary>.
 *
 * @param {string | object} payload Payload
 * @returns {object} Formatted payload without status
 */
export function formatPayload(payload) {
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
 * Returns the last status payload published
 *
 * @param {string} device Device
 * @returns {string} Payload
 */
export function useCameraRecordingStatus(device) {
  const [lastPayload, setLastPayload] = useState(getLastPayload(device));

  const update = useCallback((newPayload) => {
    // update last payload
    storeLastPayload(device, newPayload);
    setLastPayload(newPayload);
  }, [device]);

  useChannel(`camera-recording-status-${device}`, update);

  return lastPayload;
}

/**
 * Initiate receiving camera recording statuses
 */
export function initCameraStatus() {
  emit('camera-recording-init');
}
