import { useState, useEffect, useCallback } from 'react';
import { useChannel, emit } from './socket';

/**
 * @typedef {object} OverlaysHook
 * @property {?Array.<string>}  overlays          List of available overlays
 * @property {function(string)} setActiveOverlay  Set the active overlay
 */

/**
 * Use a list of camera overlays
 *
 * @param {'primary'|'secondary'} device Camera screen
 * @returns {OverlaysHook} Hook
 */
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

  return { overlays, setActiveOverlay };
}

/**
 * Send Message
 */
export function sendMessage(message) {
  emit('send-message', message);
}
