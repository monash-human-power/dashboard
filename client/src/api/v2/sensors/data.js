import { useState, useCallback } from 'react';
import { useChannel } from '../socket';

/**
 * @typedef {Object} SensorData
 * @property {number} gps
 * @property {number} gps_lat
 * @property {number} gps_long
 * @property {number} gps_alt
 * @property {number} gps_course
 * @property {number} gps_speed
 * @property {number} gps_satellites
 * @property {number} aX
 * @property {number} aY
 * @property {number} aZ
 * @property {number} gX
 * @property {number} gY
 * @property {number} gZ
 * @property {number} thermoC
 * @property {number} thermoF
 * @property {number} pot
 * @property {number} reed_velocity
 * @property {number} reed_distance
 * @property {string} filename
 * @property {number} time
 * @property {number} power
 * @property {number} cadence
 */

/**
 * Use current sensor data
 * @returns {SensorData}
 */
export function useData() {
  const [data, setData] = useState(null);

  const handler = useCallback((newData) => {
    setData(newData);
  }, []);
  useChannel('data', handler);

  return data;
}
