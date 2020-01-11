import React from 'react';
import PropTypes from 'prop-types';
import ScatterChart from 'components/ScatterChart';
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

  const data = series.map((point) => ({
    x: point.time / 1000,
    y: point.value,
  }));
  return (
    <ScatterChart
      title="Power-Time"
      xAxis={{ label: 'Time', unit: 's' }}
      yAxis={{ label: 'Power', unit: 'W' }}
      data={data}
      dataColour="rgba(93, 173, 226, 0.6)"
      max={max}
      maxColour="#57606f"
    />
  );
}

PowerTimeChart.propTypes = {
  interval: PropTypes.number.isRequired,
};
