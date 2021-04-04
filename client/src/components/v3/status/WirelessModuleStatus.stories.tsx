import React from 'react';
import { addArgs, createStory } from 'utils/stories';
import WirelessModuleStatus, {
  WirelessModuleStatusProps,
} from './WirelessModuleStatus';

export default {
  component: WirelessModuleStatus,
  title: 'components/v3/status/WirelessModuleStatus',
};

const Template = addArgs<WirelessModuleStatusProps>((props) => (
  <WirelessModuleStatus {...props} />
));

/* ----------------------------------- Stories ----------------------------------- */

export const Disconnected = createStory(Template, {
  moduleName: 'Front WM',
  isOnline: null,
  data: [],
});

export const Offline = createStory(Template, {
  moduleName: 'Front WM',
  isOnline: false,
  data: [],
});

export const Online = createStory(Template, {
  moduleName: 'Front WM',
  isOnline: true,
  batteryVoltage: 3.1,
  mqttAddress: '/v3/wireless_module/1/data',
  data: [],
});
