import React from 'react';
import { Card } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { emit } from 'api/v2/socket';
import PropTypes from 'prop-types';
import { capitalize } from 'lodash';
import CameraRecordingStatus from './CameraRecordingStatus';

/**
 * @typedef {object} CameraRecordingProps
 * @property {Array} devices Array of strings of device names
 */

/**
 * Camera recording buttons for starting and stopping video recording.
 *
 * Starts/stops recording for both displays.
 *
 * This is a feature intended for V3 but is currently in V2 for testing.
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
          devices.map((device) => (
            <div style={{ marginBottom: '10px' }} key={device}>
              <Card.Subtitle>{capitalize(device)}</Card.Subtitle>
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
  devices: PropTypes.arrayOf(String).isRequired,
};
