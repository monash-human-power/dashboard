import React from 'react';

import { BLUE, GREEN, GREY, PURPLE } from 'components/common/charts/colours';
import ScatterChart, {
  AxisProps,
  DataProps,
} from 'components/common/charts/ScatterChart';
import { createStory, StoryTemplate } from 'utils/stories';

export default {
  component: ScatterChart,
  title: 'components/common/charts/ScatterChart',
};

interface ChartProps {
  title: string;
  xAxis: AxisProps;
  yAxis: AxisProps;
  dataColour: string;
  maxColour: string;
}

interface DataArgs {
  data: DataProps[];
  max: number;
}

const RAND_MULTIPLIER = 0x426687872;
const RAND_DIGITS = 10;

const createTemplate = (chartArgs: ChartProps): StoryTemplate<DataArgs> =>
  Object.assign(
    // Template function
    (a: DataArgs) => <ScatterChart {...{ ...chartArgs, ...a }} />,

    // This lets us use the args prop later on
    { args: {} as DataArgs },
  );

// This is used to create templates for each of the scatter based charts
const Templates = {
  VelocityDistance: createTemplate({
    title: 'Velocity-Distance',
    xAxis: { label: 'Distance', unit: 'm' },
    yAxis: { label: 'Velocity', unit: 'km/hr' },
    dataColour: PURPLE,
    maxColour: GREY,
  }),
  PowerDistance: createTemplate({
    title: 'Power-Time',
    xAxis: { label: 'Distance', unit: 'm' },
    yAxis: { label: 'Power', unit: 'W' },
    dataColour: BLUE,
    maxColour: GREY,
  }),
  CadenceDistance: createTemplate({
    title: 'Cadence-Distance',
    xAxis: { label: 'Distance', unit: 'm' },
    yAxis: { label: 'Cadence', unit: 'RPM' },
    dataColour: GREEN,
    maxColour: GREY,
  }),
};

type Point = { x: number; y: number };

// Quadratic scaled to a maximum value
const quad = (low: number, high: number, max: number) => (x: number) =>
  (-((x - low) * (x - high)) * max) / ((1 / 4) * (low - high) * (low - high));

// Add random noise to a value
const perturbFunc = (f: (n: number) => number) => (n: number) =>
  f(n) > 0.75 ? n : Math.abs(n * (f(n) / 10 + 0.95) + (f(n) - 0.5) * 14);

const perturb = perturbFunc(
  (n) => ((n * RAND_MULTIPLIER) % (10 ** RAND_DIGITS + 1)) / 10 ** RAND_DIGITS,
);

// Create the data for the chart using a function
const createData = (
  dataGen: (n: number) => number,
  low: number,
  high: number,
  step: number,
  acc?: Point[],
): Point[] => {
  // Recursion entry point
  if (!acc) return createData(dataGen, low, high, step, []);

  return high - low < 0
    ? acc // Base case
    : // low is used as the "count"
      createData(dataGen, low + step, high, step, [
        ...acc,
        {
          x: low,
          y: perturb(dataGen(low)),
        },
      ]);
};

/**
 * Helper function to reduce repetition in parameters.
 * Make sure the number of datapoints generated is not too big.
 *
 * @param low Lowest x value
 * @param high Highest x value
 * @param step Step in x value
 * @param max Highest y value
 * @returns Data points
 */
const data = (low: number, high: number, step: number, max: number) => {
  if (high / step > 10000)
    console.log('Generating too many data points, may cause errors.');
  return createData(quad(low, high, max), low, high, step);
};

/* ----------------------------------- Stories ----------------------------------- */

export const VelocityDistance = createStory<DataArgs>(
  Templates.VelocityDistance,
  {
    data: data(0, 50000, 1000, 90),
    max: 110,
  },
);

export const VelocityDistanceBlank = createStory<DataArgs>(
  Templates.VelocityDistance,
  {
    data: [],
    max: 110,
  },
);

export const PowerDistance = createStory<DataArgs>(Templates.PowerDistance, {
  data: data(0, 50000, 1000, 2000),
  max: 2200,
});

export const PowerDistanceBlank = createStory<DataArgs>(
  Templates.PowerDistance,
  {
    data: [],
    max: 2200,
  },
);

export const CadenceDistance = createStory<DataArgs>(
  Templates.CadenceDistance,
  {
    data: data(0, 50000, 1000, 500),
    max: 550,
  },
);

export const CadenceDistanceBlank = createStory<DataArgs>(
  Templates.CadenceDistance,
  {
    data: [],
    max: 550,
  },
);
