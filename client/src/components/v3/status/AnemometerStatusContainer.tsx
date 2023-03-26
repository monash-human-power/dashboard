import React from 'react';
import { Card, Row } from 'react-bootstrap';

import AnemometerStatus from 'components/v3/status/AnemometerStatus';
import { useModuleStatus } from 'api/common/data';

/**
 * Container for Wireless Module Statuses
 *
 * @returns Component
 */
export default function AnemometerStatusContainer() {
  const front = useModuleStatus(1, 'Wind Speed');
  const back = useModuleStatus(3, 'Wind Direction');

  return (
    <Card>
      <Card.Body>
        <Card.Title>Anemometer</Card.Title>
        <Row>
          {/* Front WM Status */}
          <AnemometerStatus {...front} />

          {/* Back WM Status */}
          <AnemometerStatus {...back} />
        </Row>
      </Card.Body>
    </Card>
  );
}
