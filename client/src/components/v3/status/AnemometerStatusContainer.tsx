import React from 'react';
import { Card, Row } from 'react-bootstrap';
import AnemometerStatus from 'components/v3/status/AnemometerStatus';
import { useModuleStatus } from 'api/common/data';

/**
 * Container for Anemometer Status
 *
 * @returns Component
 */
export default function AnemometerStatusContainer() {
  const anemometer = useModuleStatus(5, 'Anemometer');

  return (
    <Card>
      <Card.Body>
        <Card.Title>Anemometer</Card.Title>
        <Row>
          <AnemometerStatus {...anemometer} />
        </Row>
      </Card.Body>
    </Card>
  );
}
