import { useData } from './data';

/**
 * @typedef {Object} SensorStatus
 * @property {string}   name  Sensor name
 * @property {string}   label Human readable sensor name
 * @property {boolean}  state Whether sensor is on/off
 */

/** Transform sensor data from an object to a list of sensors */
function formatData(data) {
  const sensors = [
    ['GPS', 'gps'],
    ['Power', 'power'],
    ['Cadence', 'cadence'],
    ['Reed Switch', 'reed'],
    ['Accelerometer', 'accelerometer'],
    ['Gyroscope', 'gyroscope'],
    ['Potentiometer', 'potentiometer'],
    ['Thermometer', 'thermometer'],
  ];

  return sensors.map(([label, name]) => ({
    label,
    name,
    state: data[name],
  }));
}

/**
 * Use sensor statuses
 * @returns {SensorStatus[]}
 */
export function useStatus() {
  const data = useData();
  let sensors;
  if (data) {
    sensors = {
      gps: !!data.gps,
      power: !!data.power,
      cadence: !!data.cadence,
      reed: !!data.reed_velocity && !!data.reed_distance,
      accelerometer: !!data.aX || !!data.aY || !!data.aZ,
      gyroscope: !!data.gX || !!data.gY || !!data.gZ,
      potentiometer: !!data.pot,
      thermometer: !!data.thermoC,
    };
  } else {
    sensors = {
      gps: false,
      power: false,
      cadence: false,
      reed: false,
      accelerometer: false,
      gyroscope: false,
      potentiometer: false,
      thermometer: false,
    };
  }

  return formatData(sensors);
}
