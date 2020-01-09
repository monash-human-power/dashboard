import { useState, useCallback } from 'react';
import { useChannel } from './socket';

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

export function useSensorStatus() {
  const [sensors, setSensors] = useState({
    gps: false,
    power: false,
    cadence: false,
    reed: false,
    accelerometer: false,
    gyroscope: false,
    potentiometer: false,
    thermometer: false,
  });

  const handleData = useCallback((data) => {
    setSensors({
      gps: !!data.gps,
      power: !!data.power,
      cadence: !!data.cadence,
      reed: !!data.reed_velocity && !!data.reed_distance,
      accelerometer: !!data.aX || !!data.aY || !!data.aZ,
      gyroscope: !!data.gX || !!data.gY || !!data.gZ,
      potentiometer: !!data.pot,
      thermometer: !!data.thermoC,
    });
  }, []);
  useChannel('data', handleData);

  return formatData(sensors);
}
