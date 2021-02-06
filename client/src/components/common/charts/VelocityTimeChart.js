import React from 'react';
import PropTypes from 'prop-types';
import ScatterChart from 'components/v2/ScatterChart';
import { PURPLE, GREY } from 'components/common/charts/colours';

/**
 * @typedef {import('utils/timeSeries').TimeSeriesPoint} TimeSeriesPoint
 */

/**
 * @typedef {object} VelocityTimeChartProps
 * @property {TimeSeriesPoint[]} series Time series to render
 * @property {number} max The maximum value achieved
 */

/**
 * Velocity-Time chart component
 *
 * @param {VelocityTimeChartProps} props Props
 * @returns {React.Component<VelocityTimeChartProps>} Component
 */
export default function VelocityTimeChart({ series, max }) {
  const data = series.map((point) => ({
    x: point.time / 1000,
    y: point.value,
  }));
  return (
    <ScatterChart
      title="Velocity-Time"
      xAxis={{ label: 'Time', unit: 's' }}
      yAxis={{ label: 'Velocity', unit: 'km/h' }}
      data={data}
      dataColour={PURPLE}
      max={max}
      maxColour={GREY}
    />
  );
}

VelocityTimeChart.propTypes = {
  series: PropTypes.arrayOf(
    PropTypes.shape({
      time: PropTypes.number.isRequired,
      value: PropTypes.number.isRequired,
    }),
  ).isRequired,
  max: PropTypes.number.isRequired,
};
