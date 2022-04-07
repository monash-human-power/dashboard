import { useEffect, useState } from 'react';
import {
  Array,
  Null,
  Record,
  Runtype,
  Static,
  Union,
  Number,
  Boolean,
} from 'runtypes';
import { SensorDataRT, SensorsT, WMStatus } from 'types/data';
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
  AntSpeed = 'antSpeed',
  AntDistance = 'antDistance',
  GPS = 'gps',
  Power = 'power',
  Cadence = 'cadence',
  HeartRate = 'heartRate',
}

const ModuleData = Record({
  /** Sensor data */
  sensors: Array(SensorDataRT),
});
const StartStopData = Record({});

export type ModuleData = Static<typeof ModuleData>;

/**
 * Call a function when a WM message is received
 *
 * @param id ID of module
 * @param type The type of message to react to
 * @param callback The function to be called
 */
function useModuleCallback<T>(
  id: number,
  type: 'start' | 'stop' | 'data',
  callback: (payload: T) => void,
) {
  const payloadShape: any = type === 'data' ? ModuleData : StartStopData;
  useChannelShaped(`wireless_module-${id}-${type}`, payloadShape, callback);
}

/**
 * Call a function when a WM start message is received
 *
 * @param id ID of module
 * @param callback The function to be called
 */
export function useModuleStartCallback(
  id: number,
  callback: (data: ModuleData) => void,
) {
  useModuleCallback(id, 'start', callback);
}

/**
 * Call a function when a WM stop message is received
 *
 * @param id ID of module
 * @param callback The function to be called
 */
export function useModuleStopCallback(
  id: number,
  callback: (data: ModuleData) => void,
) {
  useModuleCallback(id, 'stop', callback);
}

/**
 * Call a function when a WM data message is received
 *
 * @param id ID of module
 * @param callback The function to be called
 */
export function useModuleDataCallback(
  id: number,
  callback: (data: ModuleData) => void,
) {
  useModuleCallback(id, 'data', callback);
}

/**
 * Pass on incoming data from the wireless module channel
 *
 * @param id ID of module
 * @returns Data
 */
export function useModuleData(id: number): ModuleData {
  const [data, setData] = useState<ModuleData>({ sensors: [] });

  useModuleDataCallback(id, setData);

  return data;
}

const ModuleBattery = Record({
  /** Battery voltage */
  voltage: Number,
});

type _ModuleBattery = Static<typeof ModuleBattery>;

export interface ModuleBattery extends _ModuleBattery {}

/**
 * Get battery voltage for wireless module
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
  useChannelShaped(
    `wireless_module-${id}-online`,
    Boolean,
    (data: boolean | null) => setOnline(data ?? false),
  );

  const data = useModuleData(id).sensors;
  const batteryVoltage = useModuleBattery(id)?.voltage ?? -1;

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
    batteryVoltage,
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

/**
 * Start Boosting
 */
export function startBoost() {
  emit('start-boost');
}

/**
 * Stop Boosting
 */
export function stopBoost() {
  emit('stop-boost');
}
