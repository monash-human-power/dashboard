import { action } from '@storybook/addon-actions';
import React from 'react';
import { addArgs, createStory } from '../../../utils/stories';
import CameraRecording, { CameraRecordingPropT } from './CameraRecording';

export default {
    component: CameraRecording,
    title: 'CameraRecording'
};

type DeviceInfo = {
    primary: CameraRecordingPropT
    secondary: CameraRecordingPropT
}

const Template = addArgs<DeviceInfo>((props) => <CameraRecording startRecording={action('Start Recording')} stopRecording={action('Stop Recording')} {...props} />);

const baseDeviceProps = {
    online: false,
    statusFormatted: null,
    ip: '192.168.100.97'
};

/* ----------------------------------- Stories ----------------------------------- */

export const Empty = createStory(Template, {
    primary: {} as CameraRecordingPropT,
    secondary: {} as CameraRecordingPropT,
});

export const NoneOn = createStory(Template, {
    primary: baseDeviceProps,
    secondary: baseDeviceProps,
});

export const OneON = createStory(Template, {
    primary: {
        ...baseDeviceProps,
        online: true
    },
    secondary: baseDeviceProps,
});

export const RecordingOff = createStory(Template, {
    primary: {
        ...baseDeviceProps,
        online: true,
        statusFormatted: [
            {
                name: "Recording",
                value: "Off"
            },
            {
                name: "Disk space remaining",
                value: "1.0 GB"
            }
        ]
    },
    secondary: baseDeviceProps,
});

export const RecordingOn = createStory(Template, {
    primary: {
        ...baseDeviceProps,
        online: true,
        statusFormatted: [
            {
                name: "Recording",
                value: "On"
            },
            {
                name: "Recording duration",
                value: "10 m"
            },
            {
                name: "Recording file",
                value: "recording.mp4"
            },
            {
                name: "Disk space remaining",
                value: "1.0 GB"
            }
        ]
    },
    secondary: baseDeviceProps,
});
