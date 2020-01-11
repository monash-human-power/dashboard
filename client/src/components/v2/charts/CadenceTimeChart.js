import React from 'react';
import PropTypes from 'prop-types';
import ScatterChart from 'components/ScatterChart';
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

  const data = series.map((point) => ({
    x: point.time / 1000,
    y: point.value,
  }));
  return (
    <ScatterChart
      title="Cadence-Time"
      xAxis={{ label: 'Time', unit: 's' }}
      yAxis={{ label: 'Cadence', unit: 'RPM' }}
      data={data}
      dataColour="rgba(88, 214, 141, 0.6)"
      max={max}
      maxColour="#57606f"
    />
  );
}

CadenceTimeChart.propTypes = {
  interval: PropTypes.number.isRequired,
};
