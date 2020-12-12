import React from 'react';
import { startRecording, stopRecording, useCameraRecordingStatus, useVideoFeedStatus } from '../../api/v2/camera';
import CameraRecording from './CameraRecording';

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
            ...useVideoFeedStatus('primary'),
            ip: 'Error 501',
            statusFormatted: useCameraRecordingStatus('primary')
        },
        secondary: {
            ...useVideoFeedStatus('secondary'),
            ip: 'Error 501',
            statusFormatted: useCameraRecordingStatus('secondary')
        }
    };

    return (<CameraRecording {...props} />);
}
