import { emit, useChannelShaped } from 'api/common/socket';
import { useCallback, useEffect, useState } from 'react';
import {
  Array,
  Boolean,
  Literal,
  Number,
  Record,
  Static,
  String,
  Union,
  Unknown,
} from 'runtypes';
import { capitalise, formatBytes, formatMinutes } from 'utils/string';
import { Battery, Device } from 'types/camera';
import { usePayload } from './server';

export const devices: Device[] = ['primary', 'secondary'];

const CameraConfig = Record({
  /** Device that the camera has been configured to be */
  device: Device,
  /** Bike that the camera is configured to be on */
  bike: String,
  /** List of available overlays */
  overlays: Array(String),
  /** Name of currently active overlay */
  activeOverlay: String,
});
export type CameraConfig = Static<typeof CameraConfig>;

/**
 * Use a list of camera overlays
 *
 * @param device Camera screen
 * @returns Status of overlays and function to set active overlay.
 */
export function useCameraConfig(device: Device) {
  const [config, setConfig] = useState<CameraConfig | null>(null);

  const handleData = useCallback(
    (newConfig: CameraConfig) => {
      // Received config is not necessarily for the requested device
      if (newConfig.device === device) {
        setConfig(newConfig);
      }
    },
    [device],
  );
  useChannelShaped('push-overlays', CameraConfig, handleData);

  useEffect(() => {
    emit('get-overlays');
  }, [device]);

  const setActiveOverlay = useCallback(
    (activeOverlay: string) => {
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
 * Sends a message to the rider's camera overlay.
 *
 * @param message Message to send to rider
 */
export function sendMessage(message: string) {
  if (!message) return;

  emit('send-message', message);
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

const CameraRecordingOffPayload = Record({
  status: Literal('off'),
  /** Remaining disk space available for recording, in bytes */
  diskSpaceRemaining: Number,
});
const CameraRecordingOnPayload = Record({
  status: Literal('recording'),
  /** Current duration of recording in minutes */
  recordingMinutes: Number,
  /** Path to video file being recorded */
  recordingFile: String,
  diskSpaceRemaining: Number,
});
const CameraRecordingErrorPayload = Record({
  status: Literal('error'),
  diskSpaceRemaining: Number,
  /** Description of error that has occurred */
  error: String,
});
const CameraRecordingStatusPayload = Union(
  CameraRecordingOffPayload,
  CameraRecordingOnPayload,
  CameraRecordingErrorPayload,
);
type CameraRecordingStatusPayload = Static<typeof CameraRecordingStatusPayload>;

export interface CameraRecordingStatusItem {
  /** Display name of the status item e.g. "Disk Space Remaining" */
  name: string;
  /** Value of the status item e.g. "1.2 GiB" */
  value: string;
}

/**
 * Parse the recording payload into an object and format the values
 *
 * Payload structure is defined in the 'V3 MQTT Topics' page on Notion.
 *
 * @param payload Payload from MQTT message, parsed
 * @returns Formatted payload
 */
export function formatRecordingPayload(
  payload: CameraRecordingStatusPayload | null,
) {
  if (!payload) return null;

  // Format data always present regardless of status
  const commonData: CameraRecordingStatusItem[] = [
    { name: 'Status', value: capitalise(payload.status) },
    {
      name: 'Disk space remaining',
      value: formatBytes(payload.diskSpaceRemaining),
    },
  ];

  // Format data that is dependent on status
  const formatter = CameraRecordingStatusPayload.match(
    () => [],
    (onPayload) => [
      {
        name: 'Recording duration',
        value: formatMinutes(onPayload.recordingMinutes),
      },
      { name: 'Recording file', value: onPayload.recordingFile },
    ],
    (errorPayload) => [{ name: 'Error', value: errorPayload.error }],
  );

  return commonData.concat(formatter(payload));
}

/**
 * Returns the last status payload published
 *
 * @param device Device
 * @returns Recording status
 */
export function useCameraRecordingStatus(
  device: Device,
): CameraRecordingStatusItem[] | null {
  const payload = usePayload(
    `status-camera-recording-${device}`,
    CameraRecordingStatusPayload,
  );
  return formatRecordingPayload(payload);
}

const VideoFeedStatus = Record({
  /** Whether video feed is on/off */
  online: Boolean,
});
export type VideoFeedStatus = Static<typeof VideoFeedStatus>;
/**
 * Returns the last received status of the video feeds
 *
 * @param device Device
 * @returns A VideoFeedStatus for each device
 */
export function useVideoFeedStatus(device: Device): VideoFeedStatus | null {
  return usePayload(`status-camera-video_feed-${device}`, VideoFeedStatus);
}

const CameraStatus = Record({
  /** Whether camera is connected / not connected */
  connected: Boolean,
  ipAddress: String,
});
export type CameraStatus = Static<typeof CameraStatus>;

export const CameraBattery = Union(
  Record({
    /** Battery voltage */
    voltage: Battery,
  }),
  Record({
    /** Battery voltage */
    voltage: Battery,
    /** Indicates low battery */
    low: Unknown,
  }),
);

export type CameraBattery = Static<typeof CameraBattery>;

/**
 * Returns the last received battery voltage of the camera
 *
 * @param device Device
 * @returns Battery
 */
export function useCameraBattery(device: Device): CameraBattery | null {
  return usePayload(`camera-${device}-battery`, CameraBattery);
}

/**
 * Returns the last received connection status of the camera client to the mqtt broker
 *
 * @param device Device
 * @returns Camera status
 */
export function useCameraStatus(device: Device): CameraStatus | null {
  useEffect(() => {
    emit('get-payload', ['status', `camera`, `${device}`]);
  }, [device]);
  return usePayload(`status-camera-${device}`, CameraStatus);
}
