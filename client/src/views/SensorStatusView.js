import React from 'react';
import { Container, ListGroup, Badge } from 'react-bootstrap';
import WidgetListGroupItem from 'components/WidgetListGroupItem';
import { useStatus } from 'api/v2/sensors';

export default function SensorStatusView() {
  const sensorStatus = useStatus();

  const sensorItems = sensorStatus.map(({ label, name, state }) => (
    <WidgetListGroupItem title={label} key={name}>
      <Badge pill variant={state ? 'success' : 'danger'}>
        {state ? 'ON' : 'OFF'}
      </Badge>
    </WidgetListGroupItem>
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
