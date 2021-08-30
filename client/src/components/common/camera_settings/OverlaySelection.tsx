import { CameraConfig } from 'api/common/camera';
import { emit } from 'api/common/socket';
import RadioSelector from 'components/v2/RadioSelector';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import { getPrettyDeviceName } from 'utils/string';
import toast from 'react-hot-toast';

export interface OverlaySelectionProps {
  /** Config defined by CameraConfig */
  config: CameraConfig | null;
  /** Set the active overlay */
  setActiveOverlay: (activeOverlay: string) => void;
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

  /** Flipping Video Feed */
  function flipVideo() {
    toast.success('Video feed is flipped!');
    console.log('yes sir I got to this point');
    emit('flip-video-feed');
  }

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
        <Button className="ml-2" variant="outline-success" onClick={handleSave}>
          Save
        </Button>
        <Button className="ml-2" variant="outline-primary" onClick={flipVideo}>
          Flip Video
        </Button>
      </Card.Footer>
    </Card>
  );
}
