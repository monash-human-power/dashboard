import React from 'react';
import PropTypes from 'prop-types';
import ScatterChart from 'components/ScatterChart';
import { useSensorTimeSeries } from 'api/v2/sensors';
import { GREEN, GREY } from './colours';

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
      dataColour={GREEN}
      max={max}
      maxColour={GREY}
    />
  );
}

CadenceTimeChart.propTypes = {
  interval: PropTypes.number.isRequired,
};
