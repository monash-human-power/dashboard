import React, { useState, useEffect, useCallback } from 'react';
import { startCase } from 'lodash';
import formatBytes from 'utils/formatBytes';
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
 * Parse the payload to get the status
 *
 * @param {string} payload Payload
 * @returns {string} Status
 */
export function getStatusFromPayload(payload) {
  const data = JSON.parse(payload);
  if (!data) return null;
  return data.status;
}

/**
 * Parse the payload to get the information (fields other than status)
 *
 * Payload structure is defined in the 'V3 MQTT Topics' page on Notion.
 * Topic is /v3/camera/recording/status/<primary/>secondary>.
 *
 * @param {string} payload Payload
 * @returns {React.Component} Component
 */
export function getInfoFromPayload(payload) {
  const data = JSON.parse(payload);
  if (!data) return null;

  const format = (field) => {
    let name = startCase(field);
    let value = '';

    // format field value
    switch (field) {
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

    return `${name}: ${value}`;
  };

  return (
    <>
      {
        Object.keys(data)
          .filter((field) => field !== 'status')
          .map((field) => (
            <p key={field}>{format(field)}</p>
          ))
      }
    </>
  );
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
