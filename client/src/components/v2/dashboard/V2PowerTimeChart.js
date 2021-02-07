import React from 'react';
import PropTypes from 'prop-types';
import { useSensorTimeSeries } from 'api/v2/sensors';
import PowerTimeChart from 'components/common/charts/PowerTimeChart';

/**
 * @typedef {object} V2PowerTimeChartProps
 * @property {number} interval Time between updates in ms
 */

/**
 * Power-Time chart component
 *
 * @param {V2PowerTimeChartProps} props Props
 * @returns {React.Component<V2PowerTimeChartProps>} Component
 */
export default function V2PowerTimeChart({ interval }) {
  const { series, max } = useSensorTimeSeries('power', interval);
  return <PowerTimeChart series={series} max={max} />;
}

V2PowerTimeChart.propTypes = {
  interval: PropTypes.number.isRequired,
};
