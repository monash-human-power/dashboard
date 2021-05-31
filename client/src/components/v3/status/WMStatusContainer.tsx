import React from 'react';
import { Card, Row } from 'react-bootstrap';

import WMStatus from 'components/v3/status/WMStatus';
import { useModuleStatus } from 'api/common/data';

/**
 * Container for Wireless Module Statuses
 *
 * @returns Component
 */
export default function WMStatusContainer() {
  const front = useModuleStatus(1, 'Front WM');
  const middle = useModuleStatus(2, 'Middle WM');
  const back = useModuleStatus(3, 'Back WM');
  const ant = useModuleStatus(4, 'ANT/DAS WM');

  return (
    <Card>
      <Card.Body>
        <Card.Title>Wireless Modules</Card.Title>
        <Row>
          {/* Front WM Status */}
          <WMStatus {...front} />

          {/* Middle WM Status */}
          <WMStatus {...middle} />

          {/* Back WM Status */}
          <WMStatus {...back} />

          {/* ANT/DAS Status */}
          <WMStatus {...ant} />
        </Row>
      </Card.Body>
    </Card>
  );
}
