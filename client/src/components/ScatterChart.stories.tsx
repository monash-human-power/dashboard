import { BLUE, GREEN, GREY, PURPLE } from 'components/charts/colours';
import React from 'react';
import ScatterChart, { AxisProps, DataProps } from './ScatterChart';

export default {
    component: ScatterChart,
    title: 'ScatterChart'
};

interface ChartProps {
    title: string,
    xAxis: AxisProps,
    yAxis: AxisProps,
    dataColour: string,
    maxColour: string
}

interface DataArgs {
    data: DataProps[],
    max: number
}

type Template = ((a: DataArgs) => JSX.Element) & { args: DataArgs };

const createTemplate = (chartArgs: ChartProps): Template =>
    Object.assign(
        // Template function
        (a: DataArgs) => <ScatterChart {...{ ...chartArgs, ...a }} />,

        // This lets us use the args prop later on
        { args: {} as DataArgs }
    );

// This is used to create templates for each of the scatter based charts
const Templates = {
    VelocityDistance: createTemplate({
        title: "Velocity-Distance",
        xAxis: { label: 'Distance', unit: 'km' },
        yAxis: { label: 'Velocity', unit: 'km/hr' },
        dataColour: PURPLE,
        maxColour: GREY
    }),
    PowerDistance: createTemplate({
        title: "Power-Time",
        xAxis: { label: 'Distance', unit: 'km' },
        yAxis: { label: 'Power', unit: 'W' },
        dataColour: BLUE,
        maxColour: GREY
    }),
    CadenceDistance: createTemplate({
        title: "Cadence-Distance",
        xAxis: { label: 'Distance', unit: 'km' },
        yAxis: { label: 'Cadence', unit: 'RPM' },
        dataColour: GREEN,
        maxColour: GREY
    }),
};

type Point = { x: number, y: number }

// Quadratic scaled to a maximum value
const quad = (low: number, high: number, max: number) =>
    (x: number) => -((x - low) * (x - high)) * max / (1 / 4 * (low - high) * (low - high));

// Add random noise to a value
const perturb = (n: number) => Math.random() > 0.75
    ? n : Math.abs(n * (Math.random() / 10 + 0.95) + (Math.random() - 0.5) * 14);

// Create the data for the chart using a function
const createData = (
    dataGen: (n: number) => number,
    low: number, high: number,
    step: number,
    acc?: Point[]
): Point[] => {
    // Recursion entry point
    if (!acc) return createData(dataGen, low, high, step, []);

    return high - low < 0 ? acc  // Base case
        // low is used as the "count"
        : createData(dataGen, low + step, high, step, [...acc, {
            x: low,
            y: perturb(dataGen(low))
        }]);
};

// Helper function to reduce repetition in parameters
const data = (low: number, high: number, step: number, max: number) =>
    createData(quad(low, high, max), low, high, step);

/* ----------------------------------- Stories ----------------------------------- */

export const VelocityDistance = Templates.VelocityDistance.bind({});
VelocityDistance.args = {
    data: data(0, 50, 1, 90),
    max: 110
};

export const VelocityDistanceBlank = Templates.VelocityDistance.bind({});
VelocityDistanceBlank.args = {
    data: [],
    max: 110
};

export const PowerDistance = Templates.PowerDistance.bind({});
PowerDistance.args = {
    data: data(0, 50, 1, 2000),
    max: 2200
};

export const PowerDistanceBlank = Templates.PowerDistance.bind({});
PowerDistance.args = {
    data: [],
    max: 2200
};

export const CadenceDistance = Templates.CadenceDistance.bind({});
CadenceDistance.args = {
    data: data(0, 50, 1, 500),
    max: 550
};

export const CadenceDistanceBlank = Templates.CadenceDistance.bind({});
CadenceDistance.args = {
    data: [],
    max: 550
};
