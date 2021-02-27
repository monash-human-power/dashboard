import React from 'react';
import { ChartProps } from 'types/chart';
import { addArgs, createStory } from 'utils/stories';
import SpeedDistanceChart from './SpeedDistanceChart';

export default {
    component: SpeedDistanceChart,
    title: 'components/common/charts/SpeedDistanceChart',
};

const Template = addArgs((props: ChartProps) => <SpeedDistanceChart {...props} />);

/* ----------------------------------- Stories ----------------------------------- */

export const Blank = createStory(Template, {
    max: 100,
    data: []
});
