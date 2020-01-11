import React from 'react';
import PropTypes from 'prop-types';
import { Scatter } from 'react-chartjs-2';
import AnnotationPlugin from 'chartjs-plugin-annotation';
import { useSensorTimeSeries } from 'api/v2/sensors';

/**
 * @typedef {object} VelocityTimeChartProps
 * @property {number} interval Time between updates in ms
 */

/**
 * Velocity-Time chart component
 *
 * @param {VelocityTimeChartProps} props Props
 * @returns {React.Component<VelocityTimeChartProps>} Component
 */
export default function VelocityTimeChart({ interval }) {
  const { series, max } = useSensorTimeSeries('gps_speed', interval);

  const options = {
    title: {
      display: true,
      text: 'Velocity-Time',
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
            labelString: 'Time (s)',
          },
        },
      ],
      yAxes: [
        {
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Velocity (km/h)',
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
          borderColor: '#57606f',
          borderDash: [10, 10],
          label: {
            enabled: true,
            content: `${max} km/h`,
            yAdjust: 15,
          },
        },
      ],
    },
    plugins: [AnnotationPlugin],
  };

  const data = {
    label: 'Scatter Dataset',
    datasets: [
      {
        data: series.map((point) => ({
          x: point.time / 1000,
          y: point.value,
        })),
        backgroundColor: ['rgba(165, 105, 189, 0.6)'],
        showLine: true,
      },
    ],
  };

  return (
    <Scatter
      options={options}
      data={data}
    />
  );
}

VelocityTimeChart.propTypes = {
  interval: PropTypes.number.isRequired,
};
