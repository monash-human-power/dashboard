import React from 'react';
import { addArgs, createStory } from '../../utils/stories';
import CameraRecording, { CameraRecordingProps, CameraRecordingPropT } from './CameraRecording';

export default {
    component: CameraRecording,
    title: 'CameraRecording'
};

const Template = addArgs<CameraRecordingProps>((props) => <CameraRecording {...props} />);

/* ----------------------------------- Stories ----------------------------------- */

export const Empty = createStory(Template, {
    primary: {} as CameraRecordingPropT,
    secondary: {} as CameraRecordingPropT,
});

export const NoneOn = createStory(Template, {
    primary: {
        online: false,
        statusFormatted: null
    },
    secondary: {
        online: false,
        statusFormatted: null
    },
});

export const OneON = createStory(Template, {
    primary: {
        online: true,
        statusFormatted: null
    },
    secondary: {
        online: false,
        statusFormatted: null
    },
});

export const RecordingOff = createStory(Template, {
    primary: {
        online: true,
        statusFormatted: [
            {
                name: "Recording",
                value: "Off"
            },
            {
                name: "Disk space remaining",
                value: "1.0 Gb"
            }
        ]
    },
    secondary: {
        online: false,
        statusFormatted: null
    },
});

export const RecordingOn = createStory(Template, {
    primary: {
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
                value: "1.0 Gb"
            }
        ]
    },
    secondary: {
        online: false,
        statusFormatted: null
    },
});
