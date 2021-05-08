import React from 'react';
import { Badge, Card, Col, Row } from 'react-bootstrap';

export interface CameraStatusProps {
  /** Status of primary device */
  primaryStatus: boolean;
  /** Status of secondary device */
  secondaryStatus: boolean;
}

/**
 * Status of Cameras
 *
 * @param props Props
 * @returns Component
 */
export default function CameraStatus({
  primaryStatus,
  secondaryStatus,
}: CameraStatusProps) {
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
