import React, { useCallback, useState } from 'react';
import { Card } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { emit, useChannel } from 'api/v2/socket';
import formatBytes from 'utils/formatBytes';

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
  const [status, setStatus] = useState(<div>Waiting for status...</div>);

  const startRecording = () => {
    emit('start-camera-recording');
  };

  const stopRecording = () => {
    emit('stop-camera-recording');
  };

  const updateStatus = useCallback((payload) => {
    /*
      payload structure is defined in https://www.notion.so/V3-MQTT-Topics-66e6715d0e1941ffaa82020e5868fbae
      See /v3/camera/recording/status/<primary/>secondary>
    */
    const data = JSON.parse(payload);
    let info;
    let mins; // only used for status "recording"
    let secs; // only used for status "recording"
    switch (data.status) {
      case 'off':
        info = null;
        break;

      case 'recording':
        mins = Math.floor(data.recordingMinutes);
        secs = (data.recordingMinutes - mins) * 60;
        info = (
          <div>
            <p>{`File Name: ${data.recordingFile}`}</p>
            <p>{`Time: ${mins} minutes ${secs} seconds`}</p>
          </div>
        );
        break;

      case 'error':
        info = <p>{data.error}</p>;
        break;

      default:
        console.error(`Invalid recording status: ${data.status}`);
        break;
    }

    setStatus((
      <div>
        <p>{`Status: ${data.status}`}</p>
        {info}
        <div>{`Disk Space Remaining: ${formatBytes(data.diskSpaceRemaining)}`}</div>
      </div>
    ));
  }, []);

  useChannel('camera-recording-status', updateStatus);

  return (
    <Card>
      <Card.Body>
        <Card.Title>Recording Controls</Card.Title>
        <Card.Subtitle>{status}</Card.Subtitle>
      </Card.Body>
      <Card.Footer>
        <Button variant="outline-success" onClick={startRecording}>Start</Button>
        {' '}
        <Button variant="outline-danger" onClick={stopRecording}>Stop</Button>
      </Card.Footer>
    </Card>
  );
}
