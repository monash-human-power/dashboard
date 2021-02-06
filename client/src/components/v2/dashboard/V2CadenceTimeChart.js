import React from 'react';
import PropTypes from 'prop-types';
import { useSensorTimeSeries } from 'api/v2/sensors';
import CadenceTimeChart from 'components/common/charts/CadenceTimeChart';

/**
 * @typedef {object} V2CadenceTimeChartProps
 * @property {number} interval Time between updates in ms
 */

/**
 * Cadence-Time chart component
 *
 * @param {V2CadenceTimeChartProps} props Props
 * @returns {React.Component<V2CadenceTimeChartProps>} Component
 */
export default function V2CadenceTimeChart({ interval }) {
  const { series, max } = useSensorTimeSeries('cadence', interval);
  return <CadenceTimeChart series={series} max={max} />;
}

V2CadenceTimeChart.propTypes = {
  interval: PropTypes.number.isRequired,
};
