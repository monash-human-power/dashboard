import React from 'react';

import { DARKBLUE, DARKGREEN } from 'components/common/charts/colours';
import DualAxisScatterChart from 'components/common/charts/DualAxisScatterChart';
import { DualChartProps } from 'types/chart';

/**
 * Dual-axis Speed-Time and Power-Time chart component. Does not maintain aspect ratio.
 *
 * @param props Props
 * @returns Component
 */

export default function PowerSpeedTimeChart({
  data,
  data2,
  data2Segments,
  max,
  max2,
}: DualChartProps): JSX.Element {
  return (
    <DualAxisScatterChart
      title="Power and Speed vs Time"
      xAxis={{ label: 'Time', unit: 's' }}
      yAxis={{ label: 'Power', unit: 'W' }}
      yAxis2={{ label: 'Speed', unit: 'km/h' }}
      data={data}
      dataColour={DARKGREEN}
      data2={data2}
      data2Segments={data2Segments}
      data2Colour={DARKBLUE}
      max={max}
      maxColour={DARKGREEN}
      max2={max2}
      max2Colour={DARKBLUE}
      maintainAspectRatio={false}
    />
  );
}
