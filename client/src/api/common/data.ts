import { useState } from 'react';
import {
  Array,
  Null,
  Record,
  Runtype,
  Static,
  String,
  Union,
  Unknown,
} from 'runtypes';
import { SensorsT } from 'types/data';
import { emit, useChannelShaped } from './socket';

/** Enumerates the sensors available.
 *  Value should correspond to the sensor "type" attribute.
 */
export enum Sensor {
  Temperature = 'temperature',
  Humidity = 'humidity',
  SteeringAngle = 'steeringAngle',
  CO2 = 'co2',
  Accelerometer = 'accelerometer',
  Gyroscope = 'gyroscope',
  ReedVelocity = 'reedVelocity',
  ReedDistance = 'reedDistance',
  GPS = 'gps',
  Power = 'power',
  Cadence = 'cadence',
  HeartRate = 'heartRate',
}

const ModuleData = Record({
  /** Sensor data */
  sensors: Array(
    Record({
      /** Type of data */
      type: String,
      /** Value */
      value: Unknown,
    }),
  ),
});

type _ModuleData = Static<typeof ModuleData>;

export interface ModuleData extends _ModuleData {}

/**
 * Pass on incoming data from the wireless module channel
 *
 * @param id ID of module
 * @returns Data
 */
export function useModuleData(id: number): ModuleData {
  const [data, setData] = useState<ModuleData>({ sensors: [] });

  useChannelShaped(`wireless_module-${id}-data`, ModuleData, setData);

  return data;
}

/**
 * Extract sensor data from incoming module data
 *
 * @param id ID of module
 * @param sensor Sensor type
 * @param shape Shape of data value
 * @returns Value of sensor data
 */
export function useSensorData<T extends SensorsT>(
  id: number,
  sensor: Sensor,
  shape: Runtype<T>,
): T | null {
  const module = useModuleData(id);

  // Find data from sensor, defaulting to null
  const data = module.sensors.find((s) => s.type === sensor)?.value ?? null;

  return Union(shape, Null).check(data);
}

/**
 * Starts DAS log recording
 */
export function startLogging() {
  emit('start-das-recording');
}

/**
 * Stops DAS log recording
 */
export function stopLogging() {
  emit('stop-das-recording');
}
