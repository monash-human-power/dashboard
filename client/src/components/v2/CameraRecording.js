import React from 'react';
import { Card } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { emit } from 'api/v2/socket';
import PropTypes from 'prop-types';
import CameraRecordingStatus from './CameraRecordingStatus';

/**
 * @typedef {object} CameraRecordingProps
 * @property {string} devices Comma separated values of devices
 */

/**
 * Camera recording buttons for starting and stopping video recording.
 *
 * Starts/stops recording for both displays.
 *
 * This is a feature intended for V3 but is current in V2 for testing.
 *
 * @param {CameraRecordingProps} props Props
 * @returns {React.Component<CameraRecordingProps>} Component
 */
export default function CameraRecording({ devices }) {
  const startRecording = () => {
    emit('start-camera-recording');
  };

  const stopRecording = () => {
    emit('stop-camera-recording');
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title>Recording Controls</Card.Title>
        {
          devices.split(',').map((device) => (
            <div style={{ marginBottom: '10px' }} key={device}>
              <Card.Subtitle>{device[0].toUpperCase() + device.substring(1)}</Card.Subtitle>
              <CameraRecordingStatus device={device} />
            </div>
          ))
        }
      </Card.Body>
      <Card.Footer>
        <Button variant="outline-success" onClick={startRecording}>Start</Button>
        {' '}
        <Button variant="outline-danger" onClick={stopRecording}>Stop</Button>
      </Card.Footer>
    </Card>
  );
}

CameraRecording.propTypes = {
  devices: PropTypes.string.isRequired,
};
