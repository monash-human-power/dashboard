import { useState, useCallback } from 'react';
import zipObject from 'lodash/zipObject';
import { useTimeSeries, TimeSeriesPoint } from 'utils/timeSeries';
import { useChannel } from '../transport';

/**
 * @typedef {object} MultiSensorTimeSeriesHook
 * @property {object.<string, TimeSeriesPoint>[]} series Time-series readings for sensors
 * @property {object.<string, number>} max Maximum recorded values
 */

/**
 * Use time-series averaged sensor data
 *
 * @param {string[]} sensors   Sensor(s) to monitor
 * @param {number}          interval  Time between data points
 * @returns {MultiSensorTimeSeriesHook} Hook
 */
export function useMultiSensorTimeSeries(sensors, interval) {
  const [running, setRunning] = useState(false);
  const {
    series,
    max,
    add,
    reset,
  } = useTimeSeries(sensors.length, interval, running);

  const handleData = useCallback((data) => {
    setRunning(true);
    add(sensors.map((sensor) => data[sensor]));
  }, [add, sensors]);
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

  return {
    series: series.map((time) => zipObject(sensors, time)),
    max: zipObject(sensors, max),
  };
}

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
  const { series, max } = useMultiSensorTimeSeries([sensor], interval);
  return {
    series: series.map((time) => time[sensor]),
    max: max[sensor],
  };
}
