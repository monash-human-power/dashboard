import { useState, useCallback } from 'react';
import { emit, useChannel } from './socket';

/**
 * @typedef {object} PowerModelData
 * @property {number} rec_speed           Recommended Speed
 * @property {number} rec_power           Recommended Power
 * @property {number} zdist               Zone Distance Left
 * @property {number} distance_offset     Distance Offset
 * @property {number} distance_left       Total Distance Left
 * @property {number} predicted_max_speed Predicted Max Speed
 */

/**
 * Use current power model data
 *
 * @returns {?PowerModelData} Power model data
 */
export function usePowerModel() {
  const [recSpData, setRecSpData] = useState({
    rec_speed: null,
    rec_power: null,
    zdist: null,
    distance_offset: null,
    distance_left: null,
  });
  const [maxSpData, setMaxSpData] = useState({
    predicted_max_speed: null,
  });

  const recSpHandler = useCallback((data) => {
    setRecSpData(data);
  }, []);
  useChannel('power-model-recommended-SP', recSpHandler);

  const maxSpHandler = useCallback((data) => {
    setMaxSpData(data);
  }, []);
  useChannel('power-model-max-speed', maxSpHandler);

  return {
    ...recSpData,
    ...maxSpData,
  };
}

/**
 * @typedef {object} PowerModelStateHook
 * @property {boolean}            running     Is the power model running
 * @property {function(boolean)}  setRunning  Set power model running state
 */

/**
 * Use power model running state
 *
 * @returns {PowerModelStateHook} Hook
 */
export function usePowerModelState() {
  const [running, setRunning] = useState(false);

  const handleData = useCallback(() => {
    setRunning(true);
  }, []);
  useChannel('power-model-running', handleData);

  const setState = useCallback((state) => {
    if (state) {
      emit('start-power-model');
    } else {
      emit('stop-power-model');
    }
    setRunning(state);
  }, []);

  return [running, setState];
}

/**
 * Set power model calibration
 *
 * @param {number} distance Current actual distance
 */
export function setCalibration(distance) {
  emit('submit-calibration', distance);
}

/**
 * Reset power model calibration
 */
export function resetCalibration() {
  emit('reset-calibration');
}

/**
 * Send Message
 */
export function sendMessage(message) {
  emit('send-message', message);
}
