import { ChartOptions } from 'chart.js';
import AnnotationPlugin from 'chartjs-plugin-annotation';
import React from 'react';
import { Scatter } from 'react-chartjs-2';

/**
 * @property {string} label Axis label
 * @property {string} unit  Axis unit of measurement
 */
export interface AxisProps {
  label: string,
  unit: string
}

/**
 * @property {number} x X-Axis value
 * @property {number} y Y-Axis value
 */
export interface DataProps {
  x: number,
  y: number
}

/**
 * @property {string}     title       Chart title
 * @property {AxisProps}  xAxis       X-Axis config
 * @property {AxisProps}  yAxis       Y-Axis config
 * @property {DataProps[]}   data        Data values
 * @property {string}     dataColour  Data background colour
 * @property {number}     max         Max line value
 * @property {string}     maxColour   Max line colour
 */
export interface ScatterChartProps {
  title: string,
  xAxis: AxisProps,
  yAxis: AxisProps,
  data: DataProps[],
  dataColour: string,
  max: number,
  maxColour: string
}

/**
 * Scatter chart component
 *
 * @param {ScatterChartProps} props Props
 * @returns {React.Component<ScatterChartProps>} Component
 */
export default function ScatterChart({
  title,
  xAxis,
  yAxis,
  data,
  dataColour,
  max,
  maxColour,
}: ScatterChartProps): JSX.Element {
  console.log(title);
  console.log(JSON.stringify(data));
  console.log(JSON.stringify(max));
  const options: ChartOptions = {
    title: {
      display: true,
      text: title,
      fontSize: 14,
    },

    maintainAspectRatio: true,

    legend: {
      display: false,
    },
    scales: {
      xAxes: [
        {
          display: true,
          scaleLabel: {
            display: true,
            labelString: `${xAxis.label} (${xAxis.unit})`,
          },
        },
      ],
      yAxes: [
        {
          display: true,
          scaleLabel: {
            display: true,
            labelString: `${yAxis.label} (${yAxis.unit})`,
          },
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
    annotation: {
      drawTime: 'afterDraw',
      annotations: [
        {
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y-axis-1',
          value: max,
          borderColor: maxColour,
          borderDash: [10, 10],
          label: {
            enabled: true,
            content: `${Math.round(max * 100) / 100} ${yAxis.unit}`,
            yAdjust: 15,
          },
        },
      ],
    },
    plugins: [AnnotationPlugin],
  };

  const formattedData = {
    label: 'Scatter Dataset',
    datasets: [
      {
        data,
        backgroundColor: [dataColour],
        showLine: true,
      },
    ],
  };

  return <Scatter options={options} data={formattedData} />;
}
