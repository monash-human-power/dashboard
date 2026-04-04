import React, { useEffect, useRef, useState } from 'react';

import { Sensor, useSensorData } from 'api/common/data';
import { useChannel } from 'api/common/socket';
import SpeedDistanceChart from 'components/common/charts/SpeedDistanceChart';
import { ChartPoint } from 'types/chart';
import { AntDistanceRT, AntSpeedRT } from 'types/data';

export const V4SDChartKey = 'v4-dashboard-speed-distance-chart-data';

/**
 * Passes V4 data to the speed distance chart component
 *
 * @returns Component
 */
export function V4SpeedDistanceChart() {
  const storedData = sessionStorage.getItem(V4SDChartKey);

  // Used to store the data points
  const [data, setStateData] = useState<ChartPoint[]>(
    storedData ? JSON.parse(storedData) : [],
  );
  const maxSpeed = useRef(data.reduce((acc, { y }) => Math.max(acc, y), 0));

  // Store data for session
  const setData = (newData: ChartPoint[]) => {
    sessionStorage.setItem(V4SDChartKey, JSON.stringify(newData));
    setStateData(newData);
  };

  // Reset when start message received
  const reset = () => setData([]);
  useChannel('V4-start', reset);

  // Speed
  const speed = useSensorData(null, Sensor.AntSpeed, AntSpeedRT);
  const distance = useSensorData(null, Sensor.AntDistance, AntDistanceRT);

  // Update data whenever the point is updated
  useEffect(() => {
    // Add new data point
    if (
      speed &&
      distance && // Non null
      // New distance measurement
      distance !== data[data.length - 1]?.x
    ) {
      const speedKmh = speed * 3.6;
      maxSpeed.current = Math.max(maxSpeed.current, speedKmh);
      setData([...data, { x: distance, y: speedKmh }]);
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
