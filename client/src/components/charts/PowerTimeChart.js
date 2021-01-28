import React from 'react';
import PropTypes from 'prop-types';
import ScatterChart from 'components/v2/ScatterChart';
import { BLUE, GREY } from 'components/charts/colours';

/**
 * @typedef {import('utils/timeSeries').TimeSeriesPoint} TimeSeriesPoint
 */

/**
 * @typedef {object} PowerTimeChartProps
 * @property {TimeSeriesPoint[]} series Time series to render
 * @property {number} max The maximum value achieved
 */

/**
 * Power-Time chart component
 *
 * @param {PowerTimeChartProps} props Props
 * @returns {React.Component<PowerTimeChartProps>} Component
 */
export default function PowerTimeChart({ series, max }) {
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
      dataColour={BLUE}
      max={max}
      maxColour={GREY}
    />
  );
}

PowerTimeChart.propTypes = {
  series: PropTypes.arrayOf(
    PropTypes.shape({
      time: PropTypes.number.isRequired,
      value: PropTypes.number.isRequired,
    }),
  ).isRequired,
  max: PropTypes.number.isRequired,
};
