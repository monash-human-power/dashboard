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
import { usePayload } from './server';
import { emit } from './socket';

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

export type ModuleData = Static<typeof ModuleData>;

/**
 * Pass on incoming data from the wireless module channel
 *
 * @param id ID of module
 * @returns Data
 */
export function useModuleData(id: number): ModuleData {
  return usePayload(`module-${id}-data`, ModuleData) ?? { sensors: [] };
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
