import React from 'react';
import PropTypes from 'prop-types';
import { Scatter } from 'react-chartjs-2';
import AnnotationPlugin from 'chartjs-plugin-annotation';
import { useSensorTimeSeries } from 'api/v2/sensors';

/**
 * @typedef {object} CadenceTimeChartProps
 * @property {number} interval Time between updates in ms
 */

/**
 * Cadence-Time chart component
 *
 * @param {CadenceTimeChartProps} props Props
 * @returns {React.Component<CadenceTimeChartProps>} Component
 */
export default function CadenceTimeChart({ interval }) {
  const { series, max } = useSensorTimeSeries('cadence', interval);

  const options = {
    title: {
      display: true,
      text: 'Cadence-Time',
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
            labelString: 'Cadence',
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
            content: `${max.toFixed(2)} RPM`,
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
        backgroundColor: ['rgba(88, 214, 141, 0.6)'],
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

CadenceTimeChart.propTypes = {
  interval: PropTypes.number.isRequired,
};
