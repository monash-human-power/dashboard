import { Number, Record, Static, String, Union, Null } from 'runtypes';

/* ------------------------------------ RunTypes ------------------------------------ */

/** Value runtype of temperature sensor data */
export const MaxSpeedRT = Union(Number, Null);

/** Value runtype of temperature sensor data */
export const TemperatureRT = Number;

/** Value runtype of humidity sensor data */
export const HumidityRT = Number;

/** Value runtype of steeringAngle sensor data */
export const SteeringAngleRT = Number;

/** Value runtype of co2 sensor data */
export const CO2RT = Number;

/** Value runtype of accelerometer sensor data */
export const AccelerometerRT = Record({
  /** X value */
  x: Number,
  /** Y value */
  y: Number,
  /** Z value */
  z: Number,
});

/** Value runtype of gyroscope sensor data */
export const GyroscopeRT = Record({
  /** X value */
  x: Number,
  /** Y value */
  y: Number,
  /** Z value */
  z: Number,
});

/** Value runtype of reedVelocity sensor data */
export const ReedVelocityRT = Number;

/** Value runtype of reedDistance sensor data */
export const ReedDistanceRT = Number;

/** Value runtype of gps sensor data */
export const GPSRT = Record({
  /** Speed */
  speed: Number,
  /** Dilution of precision */
  pdop: Number,
  /** Latitude */
  latitude: Number,
  /** Longitude */
  longitude: Number,
  /** Altitude */
  altitude: Number,
  /** Course */
  course: Number,
  /** Datetime */
  datetime: String,
});

/** Value runtype of power sensor data */
export const PowerRT = Number;

/** Value runtype of cadence sensor data */
export const CadenceRT = Number;

/** Value runtype of heartRate sensor data */
export const HeartRateRT = Number;

/** Union type of all sensor value types */
export const SensorsRT = Union(
  TemperatureRT,
  HumidityRT,
  SteeringAngleRT,
  CO2RT,
  AccelerometerRT,
  GyroscopeRT,
  ReedVelocityRT,
  ReedDistanceRT,
  GPSRT,
  PowerRT,
  CadenceRT,
  HeartRateRT,
);

/** Sensor data as incoming from MQTT */
export const SensorDataRT = Record({
  type: String,
  value: SensorsRT,
});

/* ------------------------------------ Types ------------------------------------ */

/** Value type of temperature sensor data */
export type TemperatureT = Static<typeof TemperatureRT>;

/** Value type of humidity sensor data */
export type HumidityT = Static<typeof HumidityRT>;

/** Value type of steeringAngle sensor data */
export type SteeringAngleT = Static<typeof SteeringAngleRT>;

/** Value type of co2 sensor data */
export type CO2T = Static<typeof CO2RT>;

/** Value type of accelerometer sensor data */
export type AccelerometerT = Static<typeof AccelerometerRT>;

/** Value type of gyroscope sensor data */
export type GyroscopeT = Static<typeof GyroscopeRT>;

/** Value type of reedVelocity sensor data */
export type ReedVelocityT = Static<typeof ReedVelocityRT>;

/** Value type of reedDistance sensor data */
export type ReedDistanceT = Static<typeof ReedDistanceRT>;

/** Value type of gps sensor data */
export type GPST = Static<typeof GPSRT>;

/** Value type of power sensor data */
export type PowerT = Static<typeof PowerRT>;

/** Value type of cadence sensor data */
export type CadenceT = Static<typeof CadenceRT>;

/** Value type of heartRate sensor data */
export type HeartRateT = Static<typeof HeartRateRT>;

export type SensorsT = Static<typeof SensorsRT>;

export type SensorDataT = Static<typeof SensorDataRT>;

export interface WMStatusOnline {
  moduleName: string;
  online: true;
  data: SensorDataT[];
  batteryVoltage: number;
}

export interface WMStatusOffline {
  moduleName: string;
  online: false;
}

export type WMStatus = WMStatusOnline | WMStatusOffline;
