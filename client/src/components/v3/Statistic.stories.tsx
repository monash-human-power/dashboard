import React from 'react';
import { addArgs, createStory } from 'utils/stories';
import Statistic, { StatisticProps } from 'components/v3/Statistic';

export default {
  title: 'components/v3/Statistic',
  component: Statistic,
};

const Template = addArgs<StatisticProps>((props) => <Statistic {...props} />);

/* ----------------------------------- Stories ----------------------------------- */

export const Null = createStory(Template, {
  value: null,
  unit: 'km/h',
  desc: 'Current speed',
});

export const Speed = createStory(Template, {
  value: '81.4',
  unit: 'km/h',
  desc: 'Current speed',
});
