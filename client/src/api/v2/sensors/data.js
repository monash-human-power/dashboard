import { useState, useCallback } from 'react';
import { useChannel } from '../socket';

/**
 * @typedef {object} SensorData
 * @property {?number} gps             GPS sensor on
 * @property {?number} gps_lat         GPS lattitude
 * @property {?number} gps_long        GPS longitude
 * @property {?number} gps_alt         GPS altitude
 * @property {?number} gps_course      GPS course
 * @property {?number} gps_speed       GPS speed
 * @property {?number} gps_satellites  Number of GPS satellites
 * @property {?number} aX              Acceleration X
 * @property {?number} aY              Acceleration Y
 * @property {?number} aZ              Acceleration Z
 * @property {?number} gX              Gyroscope X
 * @property {?number} gY              Gyroscope Y
 * @property {?number} gZ              Gyroscope Z
 * @property {?number} thermoC         Temperature (celsius)
 * @property {?number} thermoF         Temperature (farenheit)
 * @property {?number} pot             Potentiometer
 * @property {?number} reed_velocity   Reed switch velocity
 * @property {?number} reed_distance   Reed switch distance
 * @property {?string} filename        Log file name
 * @property {?number} time            Time
 * @property {?number} power           Power
 * @property {?number} cadence         Cadence
 */

/**
 * Use current sensor data
 *
 * @returns {SensorData} Sensor data
 */
export function useData() {
  const [data, setData] = useState({
    gps: null,
    gps_lat: null,
    gps_long: null,
    gps_alt: null,
    gps_speed: null,
    gps_course: null,
    gps_satellites: null,
    aX: null,
    aY: null,
    aZ: null,
    gX: null,
    gY: null,
    gZ: null,
    thermoC: null,
    thermoF: null,
    pot: null,
    reed_velocity: null,
    reed_distance: null,
    filename: null,
    time: null,
    power: null,
    cadence: null,
  });

  const handler = useCallback((newData) => {
    setData((prevState) => ({
      ...prevState,
      ...newData,
    }));
  }, []);
  useChannel('data', handler);

  return data;
}

/**
 * @typedef {object} SensorDataHook
 * @property {?object} data         Current sensor value. Null if none yet
 * @property {?object} initialData  First sensor reading. Null if none yet
 */

/**
 * Use data from a single sensor
 *
 * @param {string} sensor Sensor to watch
 * @returns {SensorDataHook} Initial sensor data
 */
export function useSensorData(sensor) {
  const [data, setData] = useState(null);
  const [initialData, setInitialData] = useState(null);

  const startHandler = useCallback(() => {
    setInitialData(null);
    setData(null);
  }, []);
  useChannel('start', startHandler);

  const handler = useCallback((newData) => {
    const value = newData?.[sensor];
    if (initialData === null && value !== null && value !== undefined) {
      setInitialData(value);
    }
    setData(value);
  }, [sensor, initialData]);
  useChannel('data', handler);

  return { data, initialData };
}
