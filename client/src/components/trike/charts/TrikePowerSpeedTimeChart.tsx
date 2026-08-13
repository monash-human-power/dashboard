import React, { useEffect, useMemo, useRef, useState } from 'react';

// import { Sensor, useSensorData } from 'api/common/data';
import { useChannel } from 'api/common/socket';
import PowerSpeedTimeChart from 'components/common/charts/PowerSpeedTimeChart';
import { ChartPoint } from 'types/chart';
import { useLapContext } from '../dashboard/LapContext';
// import { AntDistanceRT, AntSpeedRT, PowerRT } from 'types/data';

export const TrikePTChartKey = 'trike-dashboard-power-time-chart-data';
export const TrikeSTChartKey = 'trike-dashboard-speed-time-chart-data';

/**
 * Split a sorted array of chart points into segments at the given x boundaries.
 * Adjacent segments share the boundary point so the line is visually continuous.
 */
function buildSpeedSegments(
  data: ChartPoint[],
  boundaries: number[],
): ChartPoint[][] {
  if (boundaries.length === 0) return [data];

  const segments: ChartPoint[][] = [];
  let bIdx = 0;
  let segStart = 0;

  for (let i = 0; i < data.length; i++) {
    if (bIdx < boundaries.length && data[i].x >= boundaries[bIdx]) {
      // End of current segment — include this point as the last in the segment
      segments.push(data.slice(segStart, i + 1));
      // Next segment starts at this same point (overlap so line is continuous)
      segStart = i;
      bIdx++;
    }
  }
  // Remaining points form the current (in-progress) lap segment
  if (segStart < data.length) {
    segments.push(data.slice(segStart));
  }
  return segments;
}

/**
 * Passes trike data to the power-speed time chart component
 *
 * @returns Component
 */
export function TrikePowerSpeedTimeChart() {
  // const storedPTData = sessionStorage.getItem(TrikePTChartKey);
  // const storedSTData = sessionStorage.getItem(TrikeSTChartKey);
  const storedPTData = null;
  const storedSTData = null;

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

  // // Get speed, power and time from sensor
  // const speed = useSensorData(4, Sensor.AntSpeed, AntSpeedRT);
  // const time = useSensorData(4, Sensor.AntDistance, AntDistanceRT); // TODO: Follow up on this
  // const power = useSensorData(4, Sensor.Power, PowerRT);

  // TESTING: Get speed, time and power data from JSON file

  /* eslint-disable global-require */

  const powerData: number[] = require('../CaseyPowerData.json');
  const speedData: number[] = require('../CaseySpeeds.json');
  const timeData: number[] = require('../CaseyTimes.json');
  /* eslint-enable global-require */

  const { lapBoundaries, recordSample } = useLapContext();

  // Stateful currentIndex
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentIndex < powerData.length) {
        setCurrentIndex(currentIndex + 1); // next value
      }
    }, 50);

    // Get latest power, speed and time value from test data
    const power = powerData[currentIndex];
    const speed = speedData[currentIndex];
    const time = timeData[currentIndex];
    // Convert speed units
    const speedKmh = speed * 3.6;
    // Check if there is a new max speed/power
    maxSpeed.current = Math.max(maxSpeed.current, speedKmh);
    maxPower.current = Math.max(maxPower.current, power);

    // Feed sample into the lap accumulator
    recordSample(time, speedKmh, power);

    // Append latest power and speed values (no cap — we need full history for lap segments)
    setSTData([...STdata, { x: time, y: speedKmh }]);
    setPTData([...PTdata, { x: time, y: power }]);

    return () => clearInterval(interval);
  }, [currentIndex]);

  // Split speed data into per-lap segments for faded rendering
  const speedSegments = useMemo(
    () => buildSpeedSegments(STdata, lapBoundaries),
    [STdata, lapBoundaries],
  );

  return (
    <PowerSpeedTimeChart
      data={PTdata}
      data2={STdata}
      data2Segments={speedSegments}
      // Maximums of datasets
      max={maxPower.current}
      max2={maxSpeed.current}
    />
  );
}
