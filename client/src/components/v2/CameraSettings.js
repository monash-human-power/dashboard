import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Card } from 'react-bootstrap';
import { useOverlays, getPrettyDeviceName, CameraDevice } from 'api/v2/camera';
import RadioSelector from 'components/RadioSelector';

/**
 * @typedef {object} CameraSettingsProps
 * @property {CameraDevice} device Camera screen
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
      </Card.Body>
      <Card.Footer>
        <Card.Link href="#" onClick={handleSave}>
          Save
        </Card.Link>
      </Card.Footer>
    </Card>
  );
}

CameraSettings.propTypes = {
  device: PropTypes.string.isRequired,
};
