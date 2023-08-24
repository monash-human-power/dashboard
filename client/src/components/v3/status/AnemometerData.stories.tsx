import React from 'react';
import { addArgs, createStory } from 'utils/stories';
import { SensorDataT, SensorsT } from 'types/data';
import AnemometerData, { WMStatusProps } from './AnemometerData';

export default {
  component: AnemometerData,
  title: 'components/v3/status/AnemometerData',
};

const Template = addArgs<WMStatusProps>((props) => (
  <AnemometerData {...props} />
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
