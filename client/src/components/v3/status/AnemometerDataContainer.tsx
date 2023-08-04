import React from 'react';
import { Card, Row } from 'react-bootstrap';
import AnemometerData from 'components/v3/status/AnemometerData';
import { useModuleStatus } from 'api/common/data';

/**
 * Container for Anemometer Data
 *
 * @returns Component
 */
export default function AnemometerDataContainer() {
  const anemometer = useModuleStatus(5, 'Anemometer');

  return (
    <Card>
      <Card.Body>
        <Card.Title>Anemometer Data</Card.Title>
        <Row>
          <AnemometerData {...anemometer} />
        </Row>
      </Card.Body>
    </Card>
  );
}
