import React, { useEffect, useRef, useState } from 'react';

import { Sensor, useSensorData } from 'api/common/data';
import { useChannel } from 'api/common/socket';
import PowerSpeedTimeChart from 'components/common/charts/PowerSpeedTimeChart';
import { ChartPoint } from 'types/chart';
import { AntDistanceRT, AntSpeedRT, PowerRT } from 'types/data';

export const TrikePTChartKey = 'trike-dashboard-power-time-chart-data';
export const TrikeSTChartKey = 'trike-dashboard-speed-time-chart-data';

/**
 * Passes trike data to the power-speed time chart component
 *
 * @returns Component
 */
export function TrikePowerSpeedTimeChart() {
  const storedPTData = sessionStorage.getItem(TrikePTChartKey);
  const storedSTData = sessionStorage.getItem(TrikeSTChartKey);

  // Used to store the data points
  const [PTdata, setStatePTData] = useState<ChartPoint[]>(
    storedPTData ? JSON.parse(storedPTData) : [],
  );
  const [STdata, setStateSTData] = useState<ChartPoint[]>(
    storedSTData ? JSON.parse(storedSTData) : [],
  );

  // Extract maximum values of power and speed to plot on chart
  const maxSpeed = useRef(PTdata.reduce((acc, { y }) => Math.max(acc, y), 0));
  const maxPower = useRef(STdata.reduce((acc, { y }) => Math.max(acc, y), 0));

  // Store data for session
  const setPTData = (newData: ChartPoint[]) => {
    sessionStorage.setItem(TrikePTChartKey, JSON.stringify(newData));
    setStatePTData(newData);
  };
  const setSTData = (newData: ChartPoint[]) => {
    sessionStorage.setItem(TrikeSTChartKey, JSON.stringify(newData));
    setStateSTData(newData);
  };

  // Reset when start message received
  // Empties stored Power-Time and Speed-Time data
  // TODO: Need to change the reset topic
  const reset = () => {
    setPTData([]);
    setSTData([]);
  };
  useChannel('wireless_module-4-start', reset);

  // Get speed, power and time from sensor
  const speed = useSensorData(4, Sensor.AntSpeed, AntSpeedRT);
  const time = useSensorData(4, Sensor.AntDistance, AntDistanceRT); // TODO: Follow up on this
  const power = useSensorData(4, Sensor.Power, PowerRT);

  // TESTING: Get speed, time and power data from JSON file

  // END TESTING

  // Update data whenever the point is updated
  useEffect(() => {
    // Add new data point
    if (
      speed &&
      time && // Non null
      power &&
      // New distance measurement
      time !== STdata[STdata.length - 1]?.x
    ) {
      const speedKmh = speed * 3.6;
      maxSpeed.current = Math.max(maxSpeed.current, speedKmh);
      maxPower.current = Math.max(maxPower.current, power);
      setSTData([...STdata, { x: time, y: speedKmh }]);
      setPTData([...PTdata, { x: time, y: power }]);
    }
    // Omit data in deps as otherwise there would be an infinite render loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speed, power]);

  return (
    <PowerSpeedTimeChart
      // Maximum of data set
      data={PTdata}
      data2={STdata}
      max={maxPower.current}
      max2={maxSpeed.current}
    />
  );
}
