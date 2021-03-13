import React from 'react';

import { GREY, PURPLE } from 'components/common/charts/colours';
import ScatterChart from 'components/common/charts/ScatterChart';
import { ChartProps } from 'types/chart';

/**
 * Speed-Distance chart component. Does not maintain aspect ratio.
 *
 * @param props Props
 * @returns Component
 */
export default function SpeedDistanceChart({
  data,
  max,
}: ChartProps): JSX.Element {
  return (
    <ScatterChart
      title="Speed-Distance"
      xAxis={{ label: 'Distance', unit: 'm' }}
      yAxis={{ label: 'Speed', unit: 'km/h' }}
      data={data}
      dataColour={PURPLE}
      max={max}
      maxColour={GREY}
      maintainAspectRatio={false}
    />
  );
}
