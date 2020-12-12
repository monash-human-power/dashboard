import React from 'react';
import { Badge, Card, Col, Row } from 'react-bootstrap';

export interface CameraStatusProps {
  /** Status of primary device */
  primaryStatus: boolean
  /** Status of secondary device */
  secondaryStatus: boolean
}

/**
 * Camera recording buttons for starting and stopping video recording.
 *
 * Starts/stops recording for both displays.
 *
 * This is a feature intended for V3 but is currently in V2 for testing.
 *
 * @param props Props
 * @returns Component
 */
export default function CameraStatus({ primaryStatus, secondaryStatus }: CameraStatusProps) {
  return (
    <Card>
      <Card.Body>
        <Card.Title>Camera Status</Card.Title>
        <Card.Subtitle>
          <Row>
            <Col>
              <Badge pill variant={primaryStatus ? 'success' : 'danger'}>
                {primaryStatus ? 'Connected' : 'Disconnected'}
              </Badge>
              <br />
              <span>Primary Camera</span>
            </Col>
            <Col>
              <Badge pill variant={secondaryStatus ? 'success' : 'danger'}>
                {secondaryStatus ? 'Connected' : 'Disconnected'}
              </Badge>
              <br />
              <span>Secondary Camera</span>
            </Col>
          </Row>
        </Card.Subtitle>
      </Card.Body>
    </Card>
  );
}
