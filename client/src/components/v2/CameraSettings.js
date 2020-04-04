import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  InputGroup,
  FormControl,
  Button,
} from 'react-bootstrap';
import { useOverlays } from 'api/v2/camera';
import RadioSelector from 'components/RadioSelector';
import { sendMessage } from 'api/v2/powerModel';
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
  const name = device === 'primary' ? 'Primary' : 'Secondary';
  const message = useRef(null);

  // On overlay data load, set selected to existing value
  useEffect(() => {
    setSelectedOverlay(controls?.active);
  }, [controls]);

  const handleSave = useCallback((event) => {
    event.preventDefault();
    if (selectedOverlay) {
      setActiveOverlay(selectedOverlay);
    }
  }, [selectedOverlay, setActiveOverlay]);

  const handleMessageSubmit = useCallback(() => {
    sendMessage(message.current.value);
    message.current.value = '';
  }, []);

  return (
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
        <InputGroup className="mt-3">
          <FormControl
            ref={message}
            placeholder="Type Message Here"
          />
          <InputGroup.Append>
            <Button
              variant="outline-secondary"
              onClick={handleMessageSubmit}
            >
              Send
            </Button>
          </InputGroup.Append>
        </InputGroup>
      </Card.Body>
      <Card.Footer>
        <Card.Link href="#" onClick={handleSave}>Save</Card.Link>
      </Card.Footer>
    </Card>
  );
}

CameraSettings.propTypes = {
  device: PropTypes.string.isRequired,
};
