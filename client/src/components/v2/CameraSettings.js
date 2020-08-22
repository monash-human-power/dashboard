import React, { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { Card, InputGroup, FormControl, Button } from 'react-bootstrap';
import { useOverlays, getPrettyDeviceName, sendMessage } from 'api/v2/camera';
import RadioSelector from 'components/RadioSelector';

/**
 * @typedef {object} CameraSettingsProps
 * @property {'primary'|'secondary'} device Camera screen
 */

/**
 * Camera settings for a display
 *
 * @param {CameraSettingsProps} props Props
 * @returns {React.Component<CameraSettingsProps>} Component
 */
export default function CameraSettings({ device }) {
  const { overlays: controls, setActiveOverlay } = useOverlays(device);
  const [selectedOverlay, setSelectedOverlay] = useState(null);
  const name = getPrettyDeviceName(device);
  const message = useRef(null);

  // On overlay data load, set selected to existing value
  useEffect(() => {
    setSelectedOverlay(controls?.active);
  }, [controls]);

  const handleSave = useCallback(
    (event) => {
      event.preventDefault();
      if (selectedOverlay) {
        setActiveOverlay(selectedOverlay);
      }
    },
    [selectedOverlay, setActiveOverlay],
  );

  const handleMessageSubmit = useCallback(() => {
    sendMessage(message.current.value);
    message.current.value = '';
  }, []);

  return [
    <div>
      <Card>
        <Card.Body>
          <Card.Title>{`${name} display`}</Card.Title>
          {controls ? (
            <RadioSelector
              options={controls.overlays}
              value={selectedOverlay}
              onChange={setSelectedOverlay}
            />
          ) : (
            <Card.Subtitle>Waiting for response...</Card.Subtitle>
          )}
        </Card.Body>
        <Card.Footer>
          <Card.Link href="#" onClick={handleSave}>
            Save
          </Card.Link>
        </Card.Footer>
      </Card>
    </div>,
    <div>
      <Card>
        <Card.Body>
          <Card.Title>{`${name} Message`}</Card.Title>
          <InputGroup className="mt-3">
            <FormControl ref={message} placeholder="Type Message Here" />
            <InputGroup.Append>
              <Button variant="outline-secondary" onClick={handleMessageSubmit}>
                Send
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </Card.Body>
        <Card.Footer />
      </Card>
    </div>,
  ];
}

CameraSettings.propTypes = {
  device: PropTypes.string.isRequired,
};
