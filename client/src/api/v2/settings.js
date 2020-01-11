import { useState, useEffect, useCallback } from 'react';
import { useChannel, emit } from './socket';

/**
 * @typedef {object} DASSettings
 * @property {boolean} publishOnline Whether to publish data to online broker
 */

/**
 * Use DAS settings
 *
 * @returns {?DASSettings} DAS settings
 */
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

/**
 * @typedef {object} PublishOnlineStateHook
 * @property {boolean}            publishOnline     Whether 'publish online' is enabled
 * @property {function(boolean)}  setPublishOnline  Set the 'publish online' setting
 */

/**
 * Use "publish online" setting state
 *
 * @returns {PublishOnlineStateHook} Hook
 */
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

  return { publishOnline, setPublishOnline: setPublishState };
}
