import React from 'react';
import { Row, Col } from 'react-bootstrap';
import ContentPage from 'components/common/ContentPage';
import CameraStatusContainer from 'components/v3/status/CameraStatusContainer';
import WMStatusContainer from 'components/v3/status/WMStatusContainer';
import AnemometerDataContainer from 'components/v3/status/AnemometerDataContainer';

/**
 * Status View component
 *
 * @returns Component
 */
export default function StatusView(): JSX.Element {
  return (
    <ContentPage title="System Status">
      <Row>
        {/* Camera Status */}
        <Col xl className="mb-2">
          <CameraStatusContainer />
        </Col>

        {/* Wireless Module Status */}
        <Col xl className="mb-2">
          <WMStatusContainer />
        </Col>
      </Row>

      <Row>
        {/* Anemometer Data */}
        <Col xl="6" className="mb-2">
          <AnemometerDataContainer />
        </Col>
      </Row>
    </ContentPage>
  );
}
