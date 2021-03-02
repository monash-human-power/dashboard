import { ChartOptions } from 'chart.js';
import AnnotationPlugin from 'chartjs-plugin-annotation';
import React from 'react';
import { Scatter } from 'react-chartjs-2';

export interface AxisProps {
  /** Axis label */
  label: string,
  /** Axis unit of measurement */
  unit: string
}

export interface DataProps {
  /** X-Axis value */
  x: number,
  /** Y-Axis value */
  y: number
}

export interface ScatterChartProps {
  /** Chart title */
  title: string,
  /** X-Axis config */
  xAxis: AxisProps,
  /** Y-Axis config */
  yAxis: AxisProps,
  /** Data values */
  data: DataProps[],
  /** Data background colour */
  dataColour: string,
  /** Max line value */
  max: number,
  /** Max line colour */
  maxColour: string,
  /** Maintains aspect ratio. Turn off for manual resize */
  maintainAspectRatio?: boolean
}

/**
 * Scatter chart component
 *
 * @param props Props
 * @returns Component
 */
export default function ScatterChart({
  title,
  xAxis,
  yAxis,
  data,
  dataColour,
  max,
  maxColour,
  maintainAspectRatio = true
}: ScatterChartProps): JSX.Element {
  const options: ChartOptions = {
    title: {
      display: true,
      text: title,
      fontSize: 14,
    },

    maintainAspectRatio,

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
