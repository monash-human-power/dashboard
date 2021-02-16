import React from 'react';
import { action } from '@storybook/addon-actions';
import { addArgs, createStory } from 'utils/stories';
import BoostCalibration, {BoostCalibrationProps} from 'components/common/boost/BoostCalibration';

export default {
    title: 'components/common/boost/BoostCalibration',
    component: BoostCalibration,
  };

  const Template = addArgs<BoostCalibrationProps>((props) => (
    <BoostCalibration {...props} />
  ));

const onSet = action('onSetCalibration');
const onReset= action('onResetCalibration');

const distTravelled = 50;
const calibratedDistance = 40;

export const Simple = createStory(Template, {onSet, onReset, distTravelled, calibratedDistance});
