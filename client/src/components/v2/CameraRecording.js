import React, { useCallback } from 'react';
import { Card } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { emit, useChannel } from 'api/v2/socket';

/**
 * Camera recording buttons for starting and stopping video recording.
 *
 * Starts/stops recording for both displays.
 *
 * This is a feature intended for V3 but is current in V2 for testing.
 *
 * @returns {React.Component} Component
 */
export default function CameraRecording() {
  // const [status, setStatus] = useState('Waiting for status...');

  const startRecording = () => {
    emit('start-camera-recording');
  };

  const stopRecording = () => {
    emit('stop-camera-recording');
  };

  const updateStatus = useCallback(() => {
    console.log('status');
  }, []);

  useChannel('camera-recording-status', updateStatus);

  return (
    <Card>
      <Card.Body>
        <Card.Title>Recording Controls</Card.Title>
        <Card.Subtitle>status</Card.Subtitle>
      </Card.Body>
      <Card.Footer>
        <Button variant="outline-success" onClick={startRecording}>Start</Button>
        {' '}
        <Button variant="outline-danger" onClick={stopRecording}>Stop</Button>
      </Card.Footer>
    </Card>
  );
}
