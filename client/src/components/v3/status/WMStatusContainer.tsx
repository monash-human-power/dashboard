import React, { useEffect } from 'react';
import { Card, Row } from 'react-bootstrap';

import WMStatus from 'components/v3/status/WMStatus';
import { useModuleStatus } from 'api/common/data';
import { emit } from 'api/common/socket';

const listOfWM = { '1': 'Front WM', '3': 'Back WM', '4': 'ANT WM' };

/**
 * Container for Wireless Module Statuses
 *
 * @returns Component
 */
export default function WMStatusContainer() {
  const front = useModuleStatus(1, 'Front WM');
  const back = useModuleStatus(3, 'Back WM');
  const ant = useModuleStatus(4, 'ANT/DAS WM');

  useEffect(() => {
    Object.keys(listOfWM).forEach((number) => {
      emit('get-payload', ['wireless_module', `${number}`, 'online']);
      emit('get-payload', ['wireless_module', `${number}`, 'battery']);
    });
  }, []);

  return (
    <Card>
      <Card.Body>
        <Card.Title>Wireless Modules</Card.Title>
        <Row>
          {/* Front WM Status */}
          <WMStatus {...front} />

          {/* Back WM Status */}
          <WMStatus {...back} />

          {/* ANT/DAS Status */}
          <WMStatus {...ant} />
        </Row>
      </Card.Body>
    </Card>
  );
}
