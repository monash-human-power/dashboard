import { startRecording, stopRecording, useCameraRecordingStatus, useVideoFeedStatus } from 'api/v2/camera';
import React from 'react';
import CameraRecording from 'components/common/camera_settings/CameraRecording';

/**
 * Container for {@link CameraRecording}.
 *
 * @returns Component
 */
export default function CameraRecordingContainer(): JSX.Element {
    const props = {
        startRecording,
        stopRecording,
        primary: {
            online: useVideoFeedStatus('primary')?.online ?? false,
            ip: 'Error 501',
            statusFormatted: useCameraRecordingStatus('primary')
        },
        secondary: {
            online: useVideoFeedStatus('secondary')?.online ?? false,
            ip: 'Error 501',
            statusFormatted: useCameraRecordingStatus('secondary')
        }
    };

    return (<CameraRecording {...props} />);
}
