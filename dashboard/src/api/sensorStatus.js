import socket from './socket';
import store from '@/store';

function update(sensor, state) {
  store.dispatch('sensorStatus/setSensorStatus', {
    sensor,
    sensorState: state,
  });
}

socket.on('data', (data) => {
  update('gps', data.gps !== 0);
  update('power', data.power !== 0);
  update('cadence', data.cadence !== 0);
  update('reed', data.reed_velocity !== 0 && data.reed_distance !== 0);
  update('accelerometer', data.aX !== 0 || data.aY !== 0 || data.aZ !== 0);
  update('gyroscope', data.gX !== 0 || data.gY !== 0 || data.gZ !== 0);
  update('potentiometer', data.pot !== 0);
  update('thermometer', data.thermoC !== 0);
});
