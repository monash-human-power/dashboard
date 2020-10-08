import { useCallback, useEffect, useState } from 'react';
import formatBytes from 'utils/formatBytes';
import { camelCaseToStartCase, capitalise } from 'utils/string';
import { emit, useChannel } from './socket';

enum CameraDevice {
  Primary = 'primary',
  Secondary = 'secondary',
}

interface CameraOverlayStatus {
  /** List of available overlays */
  overlays: string[];
  /** Name of currently active overlay */
  active: string;
}

/**
 * Use a list of camera overlays
 *
 * @param device Camera screen
 * @returns Status of overlays and function to set active overlay.
 */
export function useOverlays(device: CameraDevice) {
  const [overlays, setOverlays] = useState<CameraOverlayStatus | null>(null);

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
      emit('set-overlays', {
        [device]: activeOverlay,
      });
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

enum CameraRecordingStatus {
  Off = 'off',
  Recording = 'recording',
  Error = 'error',
}

interface CameraRecordingStatusPayload {
  /** Status of the camera's recording */
  status: CameraRecordingStatus;
  /** Current duration of recording in minutes, if recording */
  recordingMinutes?: number;
  /** Filename of recording, if recording */
  recordingFile?: string;
  /** Remaining disk space available for recording, in bytes */
  diskSpaceRemaining: number;
  /** Description of any error that has occurred */
  error?: string;
  /** Catch-all for any extra data */
  [propName: string]: any;
}

interface CameraRecordingStatusFormatted {
  /** Status of the camera's recording */
  status?: string;
  /** Current duration of recording in mm:ss, if recording */
  recordingMinutes?: string;
  /** Filename of recording, if recording */
  recordingFile?: string;
  /** Remaining disk space available for recording */
  diskSpaceRemaining?: string;
  /** Description of any error that has occurred */
  error?: string;
  /** Catch-all for any extra data */
  [propName: string]: any;
}

/**
 * Parse the recording payload into an object and format the values
 *
 * Payload structure is defined in the 'V3 MQTT Topics' page on Notion.
 * Topic is /v3/camera/recording/status/<primary/>secondary>.
 *
 * @param data Payload from MQTT message, parsed
 * @returns Formatted payload
 */
function parseRecordingPayloadData(data: CameraRecordingStatusPayload) {
  if (!data) return null;

  const formattedData: CameraRecordingStatusFormatted = {};

  Object.keys(data).forEach((field) => {
    let name = camelCaseToStartCase(field);
    let value = '';

    // format field value
    switch (field) {
      case 'status':
        value = capitalise(data.status);
        break;

      case 'diskSpaceRemaining':
        value = formatBytes(data.diskSpaceRemaining);
        break;

      case 'recordingMinutes':
        {
          const totalMinutes = data.recordingMinutes as number;
          const mins = Math.floor(totalMinutes);
          const secs = Math.floor((totalMinutes - mins) * 60);
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
 * @param subComponent The sub component to init for (e.g. recording, video feed)
 * @param device Device
 */
function initStatus(subComponent: string, device?: CameraDevice) {
  const deviceAsArr = device ? [device] : []; // only add device path if specified
  const path = ['camera', subComponent].concat(deviceAsArr);
  emit(`get-status-payload`, path);
}

/**
 * Makes the device name pretty.
 *
 * Hardcoded for efficiency. If you don't like it, complain to Angus Trau :).
 *
 * @param device Device
 * @returns  Prettied device name
 */
export function getPrettyDeviceName(device: CameraDevice) {
  return device === CameraDevice.Primary ? 'Primary' : 'Secondary';
}

interface StatusPayloadOptions<T> {
  /** Initial value for the payload */
  initValue?: T;
  /** Handler for updating payload */
  payloadHandler?: (
    setter: (p?: T) => void,
    newPayload: T,
    device: CameraDevice,
  ) => T | void;
  /** Handler for return value */
  returnHandler?: (payload?: T, device?: CameraDevice) => T | null | undefined;
}

/**
 * Create hooks for getting payloads
 *
 * @param sub Subcomponent
 * @param opts Options
 * @returns Hook for getting a payload
 */
function createStatusPayloadHook<T>(
  sub: string,
  {
    initValue = undefined,
    payloadHandler = (setter: (payload?: T) => void, newPayload: T) =>
      setter(newPayload ?? initValue),
    returnHandler = (payload?: T) => payload,
  }: StatusPayloadOptions<T>,
) {
  return function _hook(device: CameraDevice) {
    // Only run init once per render
    useEffect(() => {
      initStatus(sub, device);
    }, [device]);

    const [payload, setPayload] = useState(initValue);
    useChannel(`status-camera-${sub}`, (newPayload: T) =>
      payloadHandler(setPayload, newPayload, device),
    );

    return returnHandler(payload, device);
  };
}

/**
 * Returns the last status payload published
 *
 * @param device Device
 * @returns Formatted recording status
 */
export const useCameraRecordingStatus = createStatusPayloadHook<
         CameraRecordingStatusFormatted
       >('recording', {
         returnHandler: (payload, device) =>
           parseRecordingPayloadData(payload?.[device as CameraDevice]),
       });

interface VideoFeedStatus {
  /** Whether video feed is on/off */
  online: boolean;
}
/**
 * Returns the last received status of the video feeds from `/v3/camera/video-feed/status/<primary/secondary>`
 *
 * @returns A VideoFeedStatus for each device
 */
export const useVideoFeedStatus = createStatusPayloadHook<{
  [CameraDevice.Primary]?: VideoFeedStatus;
  [CameraDevice.Secondary]?: VideoFeedStatus;
}>('video-feed', {
  initValue: {},
});

interface CameraStatus {
  /** Whether camera is connected / not connected */
  connected: boolean;
}
/**
 * Returns the last received connection status of the camera client to the mqtt broker
 *
 * @param device Device
 * @returns Camera status
 */
export const useCameraStatus = (device: CameraDevice) =>
  createStatusPayloadHook<CameraStatus>(device, {
    initValue: { connected: false },
    payloadHandler: (setState, newPayload) =>
      setState({ connected: newPayload?.connected ?? false }),
  })(device);
