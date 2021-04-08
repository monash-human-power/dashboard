import { useState, useCallback } from 'react';
import { useChannel } from 'api/common/socket';

/* eslint-disable camelcase */
export interface SensorData {
  /** GPS sensor on */
  gps?: number;
  /** GPS latitude */
  gps_lat?: number;
  /** GPS longitude */
  gps_long?: number;
  /** GPS altitude */
  gps_alt?: number;
  /** GPS course */
  gps_course?: number;
  /** GPS speed */
  gps_speed?: number;
  /** Number of GPS satellites */
  gps_satellites?: number;
  /** Acceleration X */
  aX?: number;
  /** Acceleration Y */
  aY?: number;
  /** Acceleration Z */
  aZ?: number;
  /** Gyroscope X */
  gX?: number;
  /** Gyroscope Y */
  gY?: number;
  /** Gyroscope Z */
  gZ?: number;
  /** Temperature (Celsius) */
  thermoC?: number;
  /** Temperature (Fahrenheit) */
  thermoF?: number;
  /** Potentiometer (steering angle) */
  pot?: number;
  /** Reed switch velocity */
  reed_velocity?: number;
  /** Reed switch distance */
  reed_distance?: number;
  /** Current log file name */
  filename?: string;
  /** Time since logging started */
  time?: number;
  /** Power */
  power?: number;
  /** Cadence */
  cadence?: number;
}
/* eslint-enable camelcase */

/**
 * Use current sensor data
 *
 * @returns Sensor data
 */
export function useData() {
  const [data, setData] = useState<SensorData>({});

  const handler = useCallback((newData: SensorData) => {
    setData((prevState) => ({
      ...prevState,
      ...newData,
    }));
  }, []);
  useChannel('data', handler);

  return data;
}

/**
 * Use data from a single sensor
 *
 * @param sensor Sensor to watch
 * @returns Current and initial sensor data. Undefined if not yet set.
 */
export function useSensorData(sensor: keyof SensorData) {
  const [data, setData] = useState<string | number | undefined>();
  const [initialData, setInitialData] = useState<string | number | undefined>();

  const startHandler = useCallback(() => {
    setInitialData(undefined);
    setData(undefined);
  }, []);
  useChannel('start', startHandler);

  const handler = useCallback(
    (newData: SensorData) => {
      const value = newData?.[sensor];
      if (initialData === null && value !== null && value !== undefined) {
        setInitialData(value);
      }
      setData(value);
    },
    [sensor, initialData],
  );
  useChannel('data', handler);

  return { data, initialData };
}
