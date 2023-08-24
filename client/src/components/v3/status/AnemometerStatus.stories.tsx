import React from 'react';
import { addArgs, createStory } from 'utils/stories';
import { SensorDataT, SensorsT } from 'types/data';
import AnemometerStatus, { WMStatusProps } from './AnemometerStatus';

export default {
  component: AnemometerStatus,
  title: 'components/v3/status/AnemometerStatus',
};

const Template = addArgs<WMStatusProps>((props) => (
  <AnemometerStatus {...props} />
));

const sensorData = (type: string, value: SensorsT): SensorDataT => ({
  type,
  value,
});

/* ----------------------------------- Stories ----------------------------------- */

export const Offline = createStory(Template, {
  moduleName: 'Anemometer',
  online: false,
});

export const Online = createStory(Template, {
  moduleName: 'Anemometer',
  online: true,
  batteryVoltage: 3.123,
  data: [],
});

export const Data = createStory(Template, {
  moduleName: 'Anemometer',
  online: true,
  batteryVoltage: 3.123,
  data: [sensorData('windDirection', 10), sensorData('windSpeed', 20)],
});
