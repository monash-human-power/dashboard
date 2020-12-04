import { getPrettyDeviceName, OverlaysHook } from 'api/v2/camera';
import RadioSelector from 'components/RadioSelector';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';

export interface CameraSettingsProps {
  /** Camera screen */
  device: 'primary' | 'secondary'
  /** Overlay hook */
  overlays: OverlaysHook
}

/**
 * Camera settings for a display
 *
 * @param props Props
 * @returns Component
 */
export default function OverlaySelection({
  device,
  overlays: { overlays: controls, setActiveOverlay }
}: CameraSettingsProps) {
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

OverlaySelection.propTypes = {
  device: PropTypes.string.isRequired,
};
