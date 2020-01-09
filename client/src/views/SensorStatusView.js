import React from 'react';
import { Container, ListGroup, Badge } from 'react-bootstrap';
import WidgetListItem from 'components/WidgetListItem';
import { useSensorStatus } from 'api/v2/sensorStatus';

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
    <WidgetListItem title={label} key={key}>
      <Badge pill variant={sensorStatus[key] ? 'success' : 'danger'}>
        {sensorStatus[key] ? 'ON' : 'OFF'}
      </Badge>
    </WidgetListItem>
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
