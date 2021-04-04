import { CameraConfigT, getPrettyDeviceName } from 'api/common/camera';
import RadioSelector from 'components/v2/RadioSelector';
import React, { useCallback, useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';

export interface OverlaySelectionProps extends CameraConfigT {
  /** Camera screen */
  device: 'primary' | 'secondary';
}

/**
 * Camera settings for a display
 *
 * @param props Props
 * @returns Component
 */
export default function OverlaySelection({
  device,
  config,
  setActiveOverlay,
}: OverlaySelectionProps): JSX.Element {
  const [selectedOverlay, setSelectedOverlay] = useState<string | null>(null);
  const name = getPrettyDeviceName(device);

  // On overlay data load, set selected to existing value
  useEffect(() => {
    setSelectedOverlay(config?.activeOverlay ?? null);
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
