import { useCallback, useEffect, useState } from 'react';
import { Array, Literal, Record, Static, String, Union } from 'runtypes';
import formatBytes from 'utils/formatBytes';
import { camelCaseToStartCase, capitalise } from 'utils/string';
import { emit, useChannel } from './socket';

const CameraDevice = Union(Literal('primary'), Literal('secondary'));
type CameraDevice = Static<typeof CameraDevice>;

const CameraConfig = Record({
  /** Device that the camera has been configured to be */
  device: CameraDevice,
  /** Bike that the camera is configured to be on */
  bike: String,
  /** List of available overlays */
  overlays: Array(String),
  /** Name of currently active overlay */
  activeOverlay: String,
});
type CameraConfig = Static<typeof CameraConfig>;

/**
 * Use a list of camera overlays
 *
 * @param device Camera screen
 * @returns Status of overlays and function to set active overlay.
 */
export function useCameraConfig(device: CameraDevice) {
  const [config, setConfig] = useState<CameraConfig | null>(null);

  const handleData = useCallback(
    (data) => {
      const newConfig = CameraConfig.check(JSON.parse(data));
      // Received config is not necessarily for the requested device
      if (newConfig.device === device) {
        setConfig(newConfig);
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

  return { config, setActiveOverlay };
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
}

interface CameraRecordingStatusItem {
  /** Display name of the status item e.g. "Disk Space Remaining" */
  name: string;
  /** Value of the status item e.g. "1.2 GiB" */
  value: string;
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
export function parseRecordingPayloadData(data: CameraRecordingStatusPayload) {
  if (!data) return null;

  const formattedData: CameraRecordingStatusItem[] = [];

  Object.keys(data).forEach((field) => {
    const item = {
      name: camelCaseToStartCase(field),
      value: '',
    };

    // format field value
    switch (field) {
      case 'status':
        item.value = capitalise(data.status);
        break;

      case 'diskSpaceRemaining':
        item.value = formatBytes(data.diskSpaceRemaining);
        break;

      case 'recordingMinutes':
        {
          const totalMinutes = data.recordingMinutes as number;
          const mins = Math.floor(totalMinutes);
          const secs = Math.floor((totalMinutes - mins) * 60);
          item.value = `${mins}m ${secs}s`;
          item.name = 'Recording Time';
        }
        break;

      case 'recordingFile':
        item.value = data.recordingFile as string;
        break;

      case 'error':
        item.value = data.error as string;
        break;

      default:
        // Unexpected data
        break;
    }

    formattedData.push(item);
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
  return device === 'primary' ? 'Primary' : 'Secondary';
}

interface StatusPayloadOptions<T> {
  /** Initial value for the payload */
  initValue: T | null;
  /** Handler for updating payload */
  payloadHandler?: (
    setter: (p: T | null) => void,
    newPayload: T | null,
    device: CameraDevice,
  ) => T | void;
  /** Handler for return value */
  returnHandler?: (payload: T | null, device?: CameraDevice) => T | null;
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
    initValue = null,
    payloadHandler = (
      setter: (payload: T | null) => void,
      newPayload: T | null,
    ) => setter(newPayload ?? initValue),
    returnHandler = (payload: T | null) => payload,
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
export const useCameraRecordingStatus = createStatusPayloadHook<{
         ['primary']?: CameraRecordingStatusPayload;
         ['secondary']?: CameraRecordingStatusPayload;
       }>('recording', {
         initValue: {},
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
         ['primary']?: VideoFeedStatus;
         ['secondary']?: VideoFeedStatus;
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
