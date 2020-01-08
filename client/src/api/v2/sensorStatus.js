import { useState, useCallback } from 'react';
import { useChannel } from './socket';

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

  return sensors;
}
