import PropTypes from 'prop-types';
import React from 'react';

import { GREEN, GREY } from 'components/common/charts/colours';
import ScatterChart from 'components/common/charts/ScatterChart';

/**
 * @typedef {import('utils/timeSeries').TimeSeriesPoint} TimeSeriesPoint
 */

/**
 * @typedef {object} CadenceTimeChartProps
 * @property {TimeSeriesPoint[]} series Time series to render
 * @property {number} max The maximum value achieved
 */

/**
 * Cadence-Time chart component
 *
 * @param {CadenceTimeChartProps} props Props
 * @returns {React.Component<CadenceTimeChartProps>} Component
 */
export default function CadenceTimeChart({ series, max }) {
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
  series: PropTypes.arrayOf(
    PropTypes.shape({
      time: PropTypes.number.isRequired,
      value: PropTypes.number.isRequired,
    }),
  ).isRequired,
  max: PropTypes.number.isRequired,
};
