import { useState, useCallback } from 'react';
import { useChannel } from '../socket';

/**
 * @typedef {object} SensorData
 * @property {number} gps             GPS sensor on
 * @property {number} gps_lat         GPS lattitude
 * @property {number} gps_long        GPS longitude
 * @property {number} gps_alt         GPS altitude
 * @property {number} gps_course      GPS course
 * @property {number} gps_speed       GPS speed
 * @property {number} gps_satellites  Number of GPS satellites
 * @property {number} aX              Acceleration X
 * @property {number} aY              Acceleration Y
 * @property {number} aZ              Acceleration Z
 * @property {number} gX              Gyroscope X
 * @property {number} gY              Gyroscope Y
 * @property {number} gZ              Gyroscope Z
 * @property {number} thermoC         Temperature (celsius)
 * @property {number} thermoF         Temperature (farenheit)
 * @property {number} pot             Potentiometer
 * @property {number} reed_velocity   Reed switch velocity
 * @property {number} reed_distance   Reed switch distance
 * @property {string} filename        Log file name
 * @property {number} time            Time
 * @property {number} power           Power
 * @property {number} cadence         Cadence
 */

/**
 * Use current sensor data
 *
 * @returns {?SensorData} Sensor data
 */
export function useData() {
  const [data, setData] = useState(null);

  const handler = useCallback((newData) => {
    setData(newData);
  }, []);
  useChannel('data', handler);

  return data;
}

/**
 * Use only the first sensor reading
 *
 * @returns {?SensorData} Initial sensor data
 */
export function useInitialData() {
  const [data, setData] = useState(null);
  const [isInitial, setInitial] = useState(true);

  const startHandler = useCallback(() => {
    setInitial(true);
  }, []);
  useChannel('start', startHandler);

  const handler = useCallback((newData) => {
    if (isInitial) {
      setData(newData);
      setInitial(false);
    }
  }, [isInitial]);
  useChannel('data', handler);

  return data;
}
