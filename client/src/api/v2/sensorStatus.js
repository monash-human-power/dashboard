import { useState, useEffect } from 'react';
import getSocket from './socket';

export function useSensorStatus() {
  const [sensorStatus, setSensorStatus] = useState({
    gps: false,
    power: false,
    cadence: false,
    reed: false,
    accelerometer: false,
    gyroscope: false,
    potentiometer: false,
    thermometer: false,
  });

  useEffect(() => {
    function dataHandler(data) {
      setSensorStatus({
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

    const socket = getSocket();
    socket.on('data', dataHandler);

    return () => {
      socket.off('data', dataHandler);
    };
  }, []);

  return sensorStatus;
}
