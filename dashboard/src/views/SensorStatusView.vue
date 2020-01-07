<template>
  <b-container>
    <h1>Sensor Status</h1>
    <b-list-group>
      <b-list-group-item v-for="([label, key]) in sensors" :key="key" class="sensor">
        {{ label }}
        <b-badge v-if="sensorStatus[key]" variant="success" pill>ON</b-badge>
        <b-badge v-if="!sensorStatus[key]" variant="danger" pill>OFF</b-badge>
      </b-list-group-item>
    </b-list-group>
  </b-container>
</template>

<script>
import { mapState } from 'vuex';
import '@/api/sensorStatus';

export default {
  name: 'sensor-status-view',
  data() {
    return {
      sensors: [
        ['GPS', 'gps'],
        ['Power', 'power'],
        ['Cadence', 'cadence'],
        ['Reed Switch', 'reed'],
        ['Accelerometer', 'accelerometer'],
        ['Gyroscope', 'gyroscope'],
        ['Potentiometer', 'potentiometer'],
        ['Thermometer', 'thermometer'],
      ],
    };
  },
  computed: mapState(['sensorStatus']),
};
</script>

<style scoped>
.sensor {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
