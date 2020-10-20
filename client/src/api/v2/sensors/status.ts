import { useData } from './data';

export interface SensorStatus {
  /** Sensor name */
  name: string;
  /** Human readable sensor name */
  label: string;
  /** Whether sensor is on/off */
  state: boolean;
}

interface SensorStates {
  gps: boolean;
  power: boolean;
  cadence: boolean;
  reed: boolean;
  accelerometer: boolean;
  gyroscope: boolean;
  potentiometer: boolean;
  thermometer: boolean;
}

/**
 * Transform sensor data from an object to a list of sensors
 *
 * @param states Unformatted sensor status
 * @returns Sensor statuses
 */
function formatData(states: SensorStates) {
  const sensorLabels: {[name in keyof SensorStates]: string} = {
    'gps': 'GPS',
    'power': 'Power',
    'cadence': 'Cadence',
    'reed': 'Reed Switch',
    'accelerometer': 'Accelerometer',
    'gyroscope': 'Gyroscope',
    'potentiometer': 'Potentiometer',
    'thermometer': 'Thermometer',
  };

  return Object.entries(sensorLabels).map(([name, label]) => ({
    label,
    name,
    state: states[name as keyof SensorStates],
  } as SensorStatus));
}

/**
 * Use sensor statuses
 *
 * @returns Sensor statuses
 */
export function useStatus() {
  const data = useData();
  return formatData({
    gps: !!data.gps,
    power: !!data.power,
    cadence: !!data.cadence,
    reed: !!data.reed_velocity && !!data.reed_distance,
    accelerometer: !!data.aX || !!data.aY || !!data.aZ,
    gyroscope: !!data.gX || !!data.gY || !!data.gZ,
    potentiometer: !!data.pot,
    thermometer: !!data.thermoC,
  });
}
