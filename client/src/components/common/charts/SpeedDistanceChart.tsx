import { GREY, PURPLE } from 'components/common/charts/colours';
import ScatterChart from 'components/common/charts/ScatterChart';
import React from 'react';
import { ChartProps } from 'types/chart';

/**
 * Speed-Distance chart component
 *
 * @param props Props
 * @returns Component
 */
export default function SpeedDistanceChart({ series, max }: ChartProps): JSX.Element {
  const data = series.map((point) => ({
    x: point.time / 1000,
    y: point.value,
  }));
  return (
    <ScatterChart
      title="Speed-Distance"
      xAxis={{ label: 'Time', unit: 's' }}
      yAxis={{ label: 'Speed', unit: 'km/h' }}
      data={data}
      dataColour={PURPLE}
      max={max}
      maxColour={GREY}
    />
  );
}
