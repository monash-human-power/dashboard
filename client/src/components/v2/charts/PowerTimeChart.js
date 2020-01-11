import React from 'react';
import PropTypes from 'prop-types';
import { Scatter } from 'react-chartjs-2';
import AnnotationPlugin from 'chartjs-plugin-annotation';
import { useSensorTimeSeries } from 'api/v2/sensors';

/**
 * @typedef {object} PowerTimeChartProps
 * @property {number} interval Time between updates in ms
 */

/**
 * Power-Time chart component
 *
 * @param {PowerTimeChartProps} props Props
 * @returns {React.Component<PowerTimeChartProps>} Component
 */
export default function PowerTimeChart({ interval }) {
  const { series, max } = useSensorTimeSeries('power', interval);

  const options = {
    title: {
      display: true,
      text: 'Power-Time',
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
            labelString: 'Power (W)',
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
            content: `${max.toFixed(2)} W`,
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
        backgroundColor: ['rgba(93, 173, 226, 0.6)'],
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

PowerTimeChart.propTypes = {
  interval: PropTypes.number.isRequired,
};
