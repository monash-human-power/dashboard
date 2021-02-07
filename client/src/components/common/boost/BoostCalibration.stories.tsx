import React from 'react';
import { addArgs, createStory } from '../utils/stories';
import BoostCalibration, { BoostCalibrationProps } from './BoostCalibration';

export default {
    title: 'BoostCalibration',
    component: BoostCalibration,
  };

  const Template = addArgs<BoostCalibrationProps>((props) => (
    <BoostCalibration {...props} />
  ));

  export const Simple = createStory(Template, {});
