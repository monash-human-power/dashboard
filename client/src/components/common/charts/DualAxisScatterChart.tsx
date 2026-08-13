import { ChartOptions } from 'chart.js';
import AnnotationPlugin from 'chartjs-plugin-annotation';
import React from 'react';
import { Scatter } from 'react-chartjs-2';
import { AxisProps, DataProps, ScatterChartProps } from './ScatterChart';

/**
 * Convert a hex colour like "#00008B" to an rgba string with the given alpha.
 */
function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Interface to define structure of input for dual axis scatter charts with shared X-Axis.
// Extends existing ScatterChartProps interface by adding a second set of
// Y-Axis data and associated attributes.
export interface DualAxisScatterChartProps extends ScatterChartProps {
  // Second Y-Axis label and units
  yAxis2: AxisProps;
  // Second Y-Axis data values
  data2: DataProps[];
  // Optional per-lap segments of data2 for faded past-lap rendering
  data2Segments?: DataProps[][];
  // Data2 background colour
  data2Colour: string;
  // Data2 Max value
  max2: number;
  // Data2 Max Line Colour
  max2Colour: string;
}

/**
 * Dual Axis Scatter Chart Component
 *
 * Takes various chart parameters (e.g. title, axis labels/units, max value)
 * and returns a JSX Component for a dual-axis scatter chart.
 *
 * @param props Props
 * @returns Component
 */
export default function DualAxisScatterChart({
  title,
  xAxis,
  yAxis,
  data,
  dataColour,
  max,
  maxColour,
  yAxis2,
  data2,
  data2Segments,
  data2Colour,
  max2,
  max2Colour,
  maintainAspectRatio = true,
}: DualAxisScatterChartProps): JSX.Element {
  const xmin = data[0] && Number(data[0].x) > 5 ? Number(data[0].x) : 0;
  const doRedraw = data[0] ? Number(data[0].x) % 50 === 0 : false;

  const options: ChartOptions = {
    title: {
      display: true,
      text: title,
      fontSize: 14,
    },
    maintainAspectRatio,
    animation: {
      duration: 0,
    },
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
          ticks: {
            stepSize: 1,
            minRotation: 0,
            maxRotation: 0,
            min: xmin,
            autoSkip: false,
            callback: (val, index) => {
              return index % 20 === 0 || index % (2 * data.length - 1) === 0
                ? val
                : undefined;
            },
          },
        },
      ],
      yAxes: [
        {
          id: 'y-axis-1',
          display: true,
          scaleLabel: {
            display: true,
            labelString: `${yAxis.label} (${yAxis.unit})`,
            fontColor: dataColour,
          },
          stacked: false,
          ticks: {
            min: 0,
            max: Math.ceil((max + 1) / 100) * 100,
            fontColor: dataColour,
          },
          position: 'left',
        },
        {
          id: 'y-axis-2',
          display: true,
          scaleLabel: {
            display: true,
            labelString: `${yAxis2.label} (${yAxis2.unit})`,
            fontColor: data2Colour,
          },
          stacked: false,
          ticks: {
            min: 0,
            max: Math.ceil((max2 + 1) / 100) * 100,
            beginAtZero: true,
            fontColor: data2Colour,
          },
          position: 'right',
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
            xAdjust: -100,
          },
        },
        {
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y-axis-2',
          value: max2,
          borderColor: max2Colour,
          borderDash: [10, 10],
          label: {
            enabled: true,
            content: `${Math.round(max2 * 100) / 100} ${yAxis2.unit}`,
            yAdjust: 15,
            xAdjust: 100,
          },
        },
      ],
    },
    plugins: [AnnotationPlugin],
  };

  // Build speed datasets — one per lap segment if segments are provided,
  // otherwise fall back to the single data2 array for backwards compatibility.
  const PAST_LAP_ALPHA = 0.2;
  const segments =
    data2Segments && data2Segments.length > 0 ? data2Segments : null;

  const speedDatasets = segments
    ? segments.map((seg, i) => {
        const isCurrentLap = i === segments.length - 1;
        return {
          label: isCurrentLap ? 'Speed (current lap)' : `Speed (lap ${i + 1})`,
          data: seg,
          borderColor: isCurrentLap
            ? data2Colour
            : hexToRgba(data2Colour, PAST_LAP_ALPHA),
          pointRadius: 0,
          showLine: true,
          yAxisID: 'y-axis-2',
          tension: 0,
        };
      })
    : [
        {
          label: 'Speed data',
          data: data2,
          borderColor: data2Colour,
          pointRadius: 0,
          showLine: true,
          yAxisID: 'y-axis-2',
          tension: 0,
        },
      ];

  const formattedData = {
    datasets: [
      {
        label: 'Power data',
        data,
        borderColor: dataColour,
        pointRadius: 0,
        showLine: true,
        yAxisID: 'y-axis-1',
        tension: 0,
      },
      ...speedDatasets,
    ],
  };
  // Redraws graph after large sequence has been drawn

  return <Scatter options={options} data={formattedData} redraw={doRedraw} />;
}
