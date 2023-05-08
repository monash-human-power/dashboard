import React from 'react';
import { Card, Row } from 'react-bootstrap';

import AnemometerStatus from 'components/v3/status/AnemometerStatus';
import { useModuleStatus } from 'api/common/data';

import WMStatus from 'components/v3/status/WMStatus';

/**
 * Container for Anemometer Statuses
 *
 * @returns Component
 */
export default function AnemometerStatusContainer() {
  const speed = useModuleStatus(1, 'Wind Speed');
  const direction = useModuleStatus(3, 'Wind Direction');

  return (
    <Card>
      <Card.Body>
        <Card.Title>Anemometer</Card.Title>
        <Row>
          {/* Front WM Status */}
          <AnemometerStatus {...speed} />

          {/* Back WM Status */}
          <AnemometerStatus {...direction} />
        </Row>
      </Card.Body>
    </Card>
  );
}
