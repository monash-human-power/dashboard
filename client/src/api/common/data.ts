import { useEffect, useState } from 'react';
import { Array, Null, Number, Record, Runtype, Static, Union } from 'runtypes';

import { SensorDataRT, SensorsT, WMStatus } from 'types/data';

import { emit, useChannel, useChannelShaped } from './socket';

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
  sensors: Array(SensorDataRT),
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

const ModuleBattery = Record({
  /** Battery percentage */
  percentage: Number,
});

type _ModuleBattery = Static<typeof ModuleBattery>;

export interface ModuleBattery extends _ModuleBattery {}

/**
 * Get battery percentage for wireless module
 *
 * @param id ID of module
 * @returns Data
 */
export function useModuleBattery(id: number): ModuleBattery | null {
  const [battery, setBattery] = useState<ModuleBattery | null>(null);

  useChannelShaped(`wireless_module-${id}-battery`, ModuleBattery, setBattery);

  return battery;
}

/**
 * Get status for module
 *
 * @param id ID of module
 * @param name Name used for display
 * @returns Status
 */
export function useModuleStatus(id: number, name: string): WMStatus {
  // Check if module is online
  const [online, setOnline] = useState<boolean>(false);
  useEffect(() => {
    emit('get-payload', ['wireless_module', `${id}`, 'online']);
  }, [id]);
  useChannel(`wireless_module-${id}-online`, (data: boolean | null) =>
    setOnline(data ?? false),
  );

  const data = useModuleData(id).sensors;
  const batteryPercentage = useModuleBattery(id)?.percentage ?? -1;

  if (!online) {
    return {
      moduleName: name,
      online: false,
    };
  }

  return {
    moduleName: name,
    online: true,
    data,
    batteryPercentage,
    mqttAddress: '502',
  };
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
