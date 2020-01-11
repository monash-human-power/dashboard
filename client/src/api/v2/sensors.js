import { useState, useCallback } from 'react';
import { useChannel } from './socket';

export function useData() {
  const [data, setData] = useState(null);

  const handler = useCallback((newData) => {
    setData(newData);
  }, []);
  useChannel('data', handler);

  return data;
}

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
