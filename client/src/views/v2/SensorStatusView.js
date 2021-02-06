import { useStatus } from 'api/v2/sensors';
import ContentPage from 'components/common/ContentPage';
import WidgetListGroupItem from 'components/common/WidgetListGroupItem';
import React from 'react';
import { Badge, ListGroup } from 'react-bootstrap';

/**
 * Sensor Status page component
 *
 * @returns {React.Component} Component
 */
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
    <ContentPage title="Sensor Status">
      <ListGroup>{sensorItems}</ListGroup>
    </ContentPage>
  );
}
