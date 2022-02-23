import React from 'react';
import { addArgs, createStory } from 'utils/stories';
import { SensorDataT, SensorsT } from 'types/data';
import WMStatus, { WMStatusProps } from './WMStatus';

export default {
  component: WMStatus,
  title: 'components/v3/status/WirelessModuleStatus',
};

const Template = addArgs<WMStatusProps>((props) => <WMStatus {...props} />);

const sensorData = (type: string, value: SensorsT): SensorDataT => ({
  type,
  value,
});

/* ----------------------------------- Stories ----------------------------------- */

export const Offline = createStory(Template, {
  moduleName: 'Front WM',
  online: false,
});

export const Online = createStory(Template, {
  moduleName: 'Front WM',
  online: true,
  batteryVoltage: 3.123,
  data: [],
});

export const Data = createStory(Template, {
  moduleName: 'Front WM',
  online: true,
  batteryVoltage: 3.123,
  data: [
    sensorData('temperature', 26),
    sensorData('humidity', 62),
    sensorData('steering angle', 0.7),
  ],
});
