import { Sensor, useSensorData } from 'api/common/data';
import SpeedDistanceChart from 'components/common/charts/SpeedDistanceChart';
import React, { useEffect, useState } from 'react';
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
    )
      setData([...data, { x: distance, y: point }]);
    // Omit data in deps as otherwise there would be an infinite render loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [point, distance]);

  return (
    <SpeedDistanceChart
      // Maximum of data set
      max={data.reduce((acc, { y }) => Math.max(acc, y), -1)}
      data={data}
    />
  );
}
