import React from 'react';
import { addArgs, createStory } from 'utils/stories';
import BoostCalibration from './BoostCalibration';

export default {
    title: 'BoostCalibration',
    component: BoostCalibration,
  };

  const Template = addArgs<any>((props) => (
    <BoostCalibration {...props} />
  ));

  export const Simple = createStory(Template, {});
