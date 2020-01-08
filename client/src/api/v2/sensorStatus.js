import { useChannel } from './socket';

export function useSensorStatus() {
  const data = useChannel('data');

  if (!data) {
    return {
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

  return {
    gps: !!data.gps,
    power: !!data.power,
    cadence: !!data.cadence,
    reed: !!data.reed_velocity && !!data.reed_distance,
    accelerometer: !!data.aX || !!data.aY || !!data.aZ,
    gyroscope: !!data.gX || !!data.gY || !!data.gZ,
    potentiometer: !!data.pot,
    thermometer: !!data.thermoC,
  };
}
