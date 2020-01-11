import React from 'react';
import PropTypes from 'prop-types';
import { Scatter } from 'react-chartjs-2';
import AnnotationPlugin from 'chartjs-plugin-annotation';

/**
 * @typedef {object} AxisProps
 * @property {string} label Axis label
 * @property {string} unit  Axis unit of measurement
 */

/**
 * @typedef {object} ScatterChartProps
 * @property {string}     title       Chart title
 * @property {AxisProps}  xAxis       X-Axis config
 * @property {AxisProps}  yAxis       Y-Axis config
 * @property {number[]}   data        Data values
 * @property {string}     dataColour  Data background colour
 * @property {number}     max         Max line value
 * @property {string}     maxColour   Max line colour
 */

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
}) {
  const options = {
    title: {
      display: true,
      text: title,
      maintainAspectRatio: true,
      fontSize: 14,
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

  return (
    <Scatter
      options={options}
      data={formattedData}
    />
  );
}

ScatterChart.propTypes = {
  title: PropTypes.string.isRequired,
  xAxis: PropTypes.shape({
    label: PropTypes.string.isRequired,
    unit: PropTypes.string.isRequired,
  }).isRequired,
  yAxis: PropTypes.shape({
    label: PropTypes.string.isRequired,
    unit: PropTypes.string.isRequired,
  }).isRequired,
  data: PropTypes.arrayOf(PropTypes.number).isRequired,
  dataColour: PropTypes.string.isRequired,
  max: PropTypes.number.isRequired,
  maxColour: PropTypes.string.isRequired,
};
