import ContentPage from 'components/ContentPage';
import CameraRecordingContainer from 'components/v2/CameraRecordingContainer';
import CameraStatus from 'components/v2/CameraStatus';
import OverlayMessageContainer from 'components/v2/OverlayMessageContainer';
import OverlaySelectionContainer from 'components/v2/OverlaySelectionContainer';
import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';

/**
 * Camera Settings page component
 *
 * @returns {React.Component} Component
 */
export default function CameraSettingsView() {
  return (
    <ContentPage title="Camera Settings">
      <div className="mb-4">
        <Card>
          <Card.Body>
            <Card.Title>Camera Status</Card.Title>
            <Card.Subtitle>
              <Row>
                <Col>
                  <CameraStatus device="primary" />
                </Col>
                <Col>
                  <CameraStatus device="secondary" />
                </Col>
              </Row>
            </Card.Subtitle>
          </Card.Body>
        </Card>
      </div>
      <div className="mb-4">
        <CameraRecordingContainer />
      </div>
      <div className="mb-4">
        <OverlayMessageContainer />
      </div>
      <OverlaySelectionContainer />
    </ContentPage>
  );
}
