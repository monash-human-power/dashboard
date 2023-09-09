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
