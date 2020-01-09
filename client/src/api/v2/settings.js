import { useState, useEffect, useCallback } from 'react';
import { useChannel, emit } from './socket';

export function useSettings() {
  const [settings, setSettings] = useState(null);

  const handleData = useCallback((newSettings) => {
    setSettings(newSettings);
  }, []);
  useChannel('server-settings', handleData);

  // Get settings on initial load
  useEffect(() => {
    emit('get-server-settings');
  }, []);

  return settings;
}

export function usePublishOnlineState() {
  const settings = useSettings();
  const [publishOnline, setPublishOnline] = useState(false);

  useEffect(() => {
    if (settings !== null) {
      setPublishOnline(settings.publishOnline);
    }
  }, [settings]);

  const setPublishState = useCallback((state) => {
    if (state) {
      emit('publish-data-on');
    } else {
      emit('publish-data-off');
    }
    setPublishOnline(state);
  }, []);

  return [publishOnline, setPublishState];
}
