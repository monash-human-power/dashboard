import React, { useEffect, useRef, useState } from 'react';

import { Sensor, useSensorData } from 'api/common/data';
import { useChannel } from 'api/common/socket';
import SpeedDistanceChart from 'components/common/charts/SpeedDistanceChart';
import { ChartPoint } from 'types/chart';
import { ReedDistanceRT, ReedVelocityRT } from 'types/data';

export const V3SDChartKey = 'v3-dashboard-speed-distance-chart-data';

/**
 * Passes V3 data to the speed distance chart component
 *
 * @returns Component
 */
export function V3SpeedDistanceChart() {
  const storedData = sessionStorage.getItem(V3SDChartKey);

  // Used to store the data points
  const [data, setStateData] = useState<ChartPoint[]>(
    storedData ? JSON.parse(storedData) : [],
  );
  const maxPoint = useRef(-1);

  // Reset when start message received
  const reset = () => setStateData([]);
  useChannel('module-3-start', reset);

  // Store data for session
  const setData = (newData: ChartPoint[]) => {
    sessionStorage.setItem(V3SDChartKey, JSON.stringify(newData));
    setStateData(newData);
  };

  // Speed
  const point = useSensorData(3, Sensor.ReedVelocity, ReedVelocityRT);
  const distance = useSensorData(3, Sensor.ReedDistance, ReedDistanceRT);

  // Update data whenever the point is updated
  useEffect(() => {
    // Add new data point
    if (
      point &&
      distance && // Non null
      // New distance measurement
      distance !== data[data.length - 1]?.y
    ) {
      maxPoint.current = Math.max(maxPoint.current, point);
      setData([...data, { x: distance, y: point }]);
    }
    // Omit data in deps as otherwise there would be an infinite render loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [point]);

  return (
    <SpeedDistanceChart
      // Maximum of data set
      max={maxPoint.current}
      data={data}
    />
  );
}
