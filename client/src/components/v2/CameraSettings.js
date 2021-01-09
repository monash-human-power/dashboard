import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Card } from 'react-bootstrap';
import { useCameraConfig, getPrettyDeviceName } from 'api/v2/camera';
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
  const { config, setActiveOverlay } = useCameraConfig(device);
  const [selectedOverlay, setSelectedOverlay] = useState(null);
  const name = getPrettyDeviceName(device);

  // On overlay data load, set selected to existing value
  useEffect(() => {
    setSelectedOverlay(config?.activeOverlay);
  }, [config]);

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
        {config ? (
          <RadioSelector
            options={config.overlays}
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
