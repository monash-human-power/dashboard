import React from 'react';
import PropTypes from 'prop-types';
import ScatterChart from 'components/ScatterChart';
import { useSensorTimeSeries } from 'api/v2/sensors';
import { PURPLE, GREY } from './colours';


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
  interval: PropTypes.number.isRequired,
};
