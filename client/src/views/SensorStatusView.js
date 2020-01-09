import React from 'react';
import { Container, ListGroup, Badge } from 'react-bootstrap';
import WidgetListItem from 'components/WidgetListItem';
import { useSensorStatus } from 'api/v2/sensorStatus';

export default function SensorStatusView() {
  const sensorStatus = useSensorStatus();

  const sensorItems = sensorStatus.map(({ label, name, status }) => (
    <WidgetListItem title={label} key={name}>
      <Badge pill variant={status ? 'success' : 'danger'}>
        {status ? 'ON' : 'OFF'}
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
