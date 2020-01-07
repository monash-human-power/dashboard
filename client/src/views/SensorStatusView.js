import React from 'react';
import { Container, ListGroup, Badge } from 'react-bootstrap';
import { useSensorStatus } from 'api/v2/sensorStatus';
import styles from './SensorStatusView.module.css';

export default function SensorStatusView() {
  const sensorStatus = useSensorStatus();

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

  const sensorItems = sensors.map(([label, key]) => (
    <ListGroup.Item className={styles.sensor} key={key}>
      {label}
      <Badge pill variant={sensorStatus[key] ? 'success' : 'danger'}>
        {sensorStatus[key] ? 'ON' : 'OFF'}
      </Badge>
    </ListGroup.Item>
  ));

  return (
    <Container>
      <h1>Sensor Status</h1>
      <ListGroup>
        {sensorItems}
      </ListGroup>
    </Container>
  );
}
