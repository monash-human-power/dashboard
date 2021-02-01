import { useState, useEffect, useCallback } from 'react';
import { useChannel, emit } from '../common/socket';

export interface DASSettings {
  /** Whether to publish data to online broker */
  publishOnline: boolean;
}

/**
 * Use DAS settings
 *
 * @returns DAS settings
 */
export function useSettings() {
  const [settings, setSettings] = useState<DASSettings | null>(null);

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

/**
 * Use "publish online" setting state
 *
 * @returns Whether publishing online is enabled, and a setter for this value.
 */
export function usePublishOnlineState() {
  const settings = useSettings();
  const [publishOnline, setPublishOnline] = useState(false);

  useEffect(() => {
    if (settings !== null) {
      setPublishOnline(settings.publishOnline);
    }
  }, [settings]);

  const setPublishState = useCallback((state: boolean) => {
    if (state) {
      emit('publish-data-on');
    } else {
      emit('publish-data-off');
    }
    setPublishOnline(state);
  }, []);

  return { publishOnline, setPublishOnline: setPublishState };
}
