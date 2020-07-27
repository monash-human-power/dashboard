import React from 'react';
import { Card } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

/**
 * Camera recording buttons for starting and stopping video recording.
 *
 * Starts/stops recording for both displays.
 *
 * @returns {React.Component} Component
 */
export default function CameraRecording() {
  const startRecording = () => {

  };

  const stopRecording = () => {

  };

  return (
    <Card>
      <Card.Body>
        <Card.Title>Recording Controls</Card.Title>
        <Card.Subtitle>Recording status goes here</Card.Subtitle>
      </Card.Body>
      <Card.Footer>
        <Button variant="outline-success" onClick={startRecording}>Start</Button>
        {' '}
        <Button variant="outline-danger" onClick={stopRecording}>Stop</Button>
      </Card.Footer>
    </Card>
  );
}
