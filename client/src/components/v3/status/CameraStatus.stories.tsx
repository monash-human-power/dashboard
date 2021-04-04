import React from 'react';
import { addArgs, createStory } from 'utils/stories';
import CameraStatus, { CameraStatusProps } from './CameraStatus';

export default {
  component: CameraStatus,
  title: 'components/v3/status/CameraStatus',
};

const Template = addArgs<CameraStatusProps>((props) => (
  <CameraStatus {...props} />
));

/* ----------------------------------- Stories ----------------------------------- */

export const Offline = createStory(Template, {
  cameraName: 'Secondary',
  isOnline: false,
});

export const Online = createStory(Template, {
  cameraName: 'Primary',
  isOnline: true,
  batteryVoltage: 3,
  ip: '192.168.123.2',
  videoFeedStatus: 'RECORDING',
});
