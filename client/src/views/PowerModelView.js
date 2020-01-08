import React, { useState, useCallback } from 'react';
import {
  Alert,
  Button,
  Card,
  Container,
} from 'react-bootstrap';
import { usePowerModelState } from 'api/v2/powerModel';

export default function PowerModelView() {
  const [powerModelState, setPowerModelState] = usePowerModelState();
  const [successAlert, setSuccessAlert] = useState(null);

  const start = useCallback(() => {
    setPowerModelState(true);
    setSuccessAlert('Started power model!');
  }, [setPowerModelState]);

  const stop = useCallback(() => {
    setPowerModelState(false);
    setSuccessAlert('Stopping power model!');
  }, [setPowerModelState]);

  return (
    <Container>
      <h1>Power Model</h1>
      <Alert variant="warning">
        Make sure power model is not running before you start it!
      </Alert>
      {successAlert ? (
        <Alert variant="success">
          {successAlert}
        </Alert>
      ) : null}
      <Card>
        <Card.Body className="text-center">
          <Card.Title>Start Power Model</Card.Title>
          <Button variant="success" onClick={start} disabled={powerModelState}>Start</Button>
        </Card.Body>
      </Card>
      <Card>
        <Card.Body className="text-center">
          <Card.Title>Stop Power Model</Card.Title>
          <Button variant="danger" onClick={stop}>Stop</Button>
        </Card.Body>
      </Card>
    </Container>
  );
}
