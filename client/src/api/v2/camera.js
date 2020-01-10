import { useState, useEffect, useCallback } from 'react';
import { useChannel, emit } from './socket';

export function useOverlays(device) {
  const [overlays, setOverlays] = useState(null);

  const handleData = useCallback((data) => {
    const json = JSON.parse(data);
    if (json.device === device) {
      setOverlays({
        active: json.activeOverlay,
        overlays: json.overlays,
      });
    }
  }, [device]);
  useChannel('push-overlays', handleData);

  useEffect(() => {
    emit('get-overlays');
  }, [device]);

  const setActiveOverlay = useCallback((activeOverlay) => {
    emit('set-overlays', JSON.stringify({
      [device]: activeOverlay,
    }));
  }, [device]);

  return [overlays, setActiveOverlay];
}
