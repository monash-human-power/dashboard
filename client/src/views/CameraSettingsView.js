import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  Col,
  Container,
  Row,
} from 'react-bootstrap';
import RadioSelector from 'components/RadioSelector';
import { useOverlays } from 'api/v2/camera';

export default function CameraSettingsView() {
  const [primaryOverlays, setPrimaryActive] = useOverlays('primary');
  const [secondaryOverlays, setSecondaryActive] = useOverlays('secondary');
  const [primarySelected, setPrimarySelected] = useState(null);
  const [secondarySelected, setSecondarySelected] = useState(null);

  // On overlay data load, set selected to exising value
  useEffect(() => {
    setPrimarySelected(primaryOverlays?.active);
  }, [primaryOverlays]);
  useEffect(() => {
    setSecondarySelected(secondaryOverlays?.active);
  }, [secondaryOverlays]);

  const handleSave = useCallback((event) => {
    event.preventDefault();
    if (primarySelected) {
      setPrimaryActive(primarySelected);
    }
    if (secondarySelected) {
      setSecondaryActive(secondarySelected);
    }
  }, [primarySelected, secondarySelected, setPrimaryActive, setSecondaryActive]);

  // Only render controls when overlay data is available
  const primary = primaryOverlays ? (
    <div>
      Primary display
      <RadioSelector
        options={primaryOverlays.overlays}
        value={primarySelected}
        onChange={setPrimarySelected}
      />
    </div>
  ) : null;

  const secondary = secondaryOverlays ? (
    <div>
      Secondary display
      <RadioSelector
        options={secondaryOverlays.overlays}
        value={secondarySelected}
        onChange={setSecondarySelected}
      />
    </div>
  ) : null;

  return (
    <Container>
      <h1>Camera Settings</h1>
      <Card>
        <Card.Body>
          <Card.Title>Camera Overlay</Card.Title>
          {!primaryOverlays && !secondaryOverlays ? (
            <Card.Subtitle>Waiting for response...</Card.Subtitle>
          ) : null}
          <Row>
            <Col>
              {primary}
            </Col>
            <Col>
              {secondary}
            </Col>
          </Row>
        </Card.Body>
        <Card.Footer>
          <Card.Link href="" onClick={handleSave}>Save</Card.Link>
        </Card.Footer>
      </Card>
    </Container>
  );
}
