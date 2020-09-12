import ContentPage from 'components/ContentPage';
import CameraRecording from 'components/v2/CameraRecording';
import CameraSettings from 'components/v2/CameraSettings';
import CameraStatus from 'components/v2/CameraStatus';
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
                <Col><CameraStatus device="primary" /></Col>
                <Col><CameraStatus device="secondary" /></Col>
              </Row>
            </Card.Subtitle>
          </Card.Body>
        </Card>
      </div>
      <div className="mb-4">
        <CameraRecording devices={['primary', 'secondary']} />
      </div>
      <div className="mb-4">
        <CameraSettings device="primary" />
      </div>
      <div>
        <CameraSettings device="secondary" />
      </div>
    </ContentPage>
  );
}
