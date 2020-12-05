import ContentPage from 'components/ContentPage';
import CameraRecording from 'components/v2/CameraRecording';
import CameraStatus from 'components/v2/CameraStatus';
import OverlayMessage from 'components/v2/OverlayMessage';
import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import OverlaySelectionContainer from '../../components/v2/OverlaySelectionContainer';

/**
 * Camera Settings page component
 *
 * @returns {React.Component} Component
 */
export default function CameraSettingsView() {
  const devices = ['primary', 'secondary'];

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
        <CameraRecording devices={devices} />
      </div>
      <div className="mb-4">
        <OverlayMessage />
      </div>
      <OverlaySelectionContainer />
    </ContentPage>
  );
}
