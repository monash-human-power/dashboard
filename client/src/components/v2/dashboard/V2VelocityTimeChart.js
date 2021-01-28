import React from 'react';
import PropTypes from 'prop-types';
import { useSensorTimeSeries } from 'api/v2/sensors';
import VelocityTimeChart from 'components/common/charts/VelocityTimeChart';

/**
 * @typedef {object} V2VelocityTimeChartProps
 * @property {number} interval Time between updates in ms
 */

/**
 * Velocity-Time chart component
 *
 * @param {V2VelocityTimeChartProps} props Props
 * @returns {React.Component<V2VelocityTimeChartProps>} Component
 */
export default function V2VelocityTimeChart({ interval }) {
  const { series, max } = useSensorTimeSeries('gps_speed', interval);
  return <VelocityTimeChart series={series} max={max} />;
}

V2VelocityTimeChart.propTypes = {
  interval: PropTypes.number.isRequired,
};
