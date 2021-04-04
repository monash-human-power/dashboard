import React from 'react';
import { addArgs, createStory } from 'utils/stories';
import CameraStatusCol, { CameraStatusColProps } from './CameraStatusCol';

export default {
  component: CameraStatusCol,
  title: 'components/v3/status/CameraStatusCol',
};

const Template = addArgs<CameraStatusColProps>((props) => (
  <CameraStatusCol {...props} />
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
