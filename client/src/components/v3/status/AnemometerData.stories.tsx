import React from 'react';
import { addArgs, createStory } from 'utils/stories';
import AnemometerData, { WMStatusProps } from './AnemometerData';

export default {
  component: AnemometerData,
  title: 'components/v3/status/AnemometerData',
};

const Template = addArgs<WMStatusProps>((props) => (
  <AnemometerData {...props} />
));

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
