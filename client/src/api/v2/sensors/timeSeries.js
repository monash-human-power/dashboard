import { useState, useCallback } from 'react';
import { useTimeSeries, TimeSeriesPoint } from 'utils/timeSeries';
import { useChannel } from '../socket';

/**
 * @typedef {object} SensorTimeSeriesHook
 * @property {TimeSeriesPoint[]}  series  Sensor time-series readings
 * @property {number}             max     Maximum recorded value
 */

/**
 * Use time-series averaged sensor data
 *
 * @param {string} sensor    Sensor to monitor
 * @param {number} interval  Time between data points
 * @returns {SensorTimeSeriesHook} Hook
 */
export function useSensorTimeSeries(sensor, interval) {
  const [running, setRunning] = useState(false);
  const {
    series,
    max,
    add,
    reset,
  } = useTimeSeries(interval, running);

  const handleData = useCallback((data) => {
    add(data[sensor]);
  }, [add, sensor]);
  useChannel('data', handleData);

  const handleStart = useCallback(() => {
    reset();
    setRunning(true);
  }, [reset]);
  useChannel('start', handleStart);

  const handleStop = useCallback(() => {
    setRunning(false);
  }, []);
  useChannel('stop', handleStop);

  return { series, max };
}
