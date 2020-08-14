import { useStatus } from 'api/v2/sensors';
import ContentPage from 'components/ContentPage';
import OnlineIndicator from 'components/v2/OnlineIndicator';
import WidgetListGroupItem from 'components/WidgetListGroupItem';
import React from 'react';
import { ListGroup } from 'react-bootstrap';

/**
 * Sensor Status page component
 *
 * @returns {React.Component} Component
 */
export default function SensorStatusView() {
  const sensorStatus = useStatus();

  const sensorItems = sensorStatus.map(({ label, name, state }) => (
    <WidgetListGroupItem title={label} key={name}>
      <OnlineIndicator online={state} />
    </WidgetListGroupItem>
  ));

  return (
    <ContentPage title="Sensor Status">
      <ListGroup>{sensorItems}</ListGroup>
    </ContentPage>
  );
}
