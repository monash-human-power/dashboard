import React, { useEffect, useRef, useState } from 'react';

import { Sensor, useSensorData } from 'api/common/data';
import { useChannel } from 'api/common/socket';
import SpeedDistanceChart from 'components/common/charts/SpeedDistanceChart';
import { ChartPoint } from 'types/chart';
import { GPSRT, ReedDistanceRT } from 'types/data';

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
  const maxSpeed = useRef(data.reduce((acc, { y }) => Math.max(acc, y), 0));

  // Store data for session
  const setData = (newData: ChartPoint[]) => {
    sessionStorage.setItem(V3SDChartKey, JSON.stringify(newData));
    setStateData(newData);
  };

  // Reset when start message received
  const reset = () => setData([]);
  useChannel('wireless_module-3-start', reset);

  // Speed
  const speed = useSensorData(3, Sensor.GPS, GPSRT)?.speed;
  const distance = useSensorData(3, Sensor.ReedDistance, ReedDistanceRT);

  // Update data whenever the point is updated
  useEffect(() => {
    // Add new data point
    if (
      speed &&
      distance && // Non null
      // New distance measurement
      distance !== data[data.length - 1]?.x
    ) {
      maxSpeed.current = Math.max(maxSpeed.current, speed);
      setData([...data, { x: distance, y: speed }]);
    }
    // Omit data in deps as otherwise there would be an infinite render loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speed]);

  return (
    <SpeedDistanceChart
      // Maximum of data set
      max={maxSpeed.current}
      data={data}
    />
  );
}
