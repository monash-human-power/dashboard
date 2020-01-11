import { useState, useCallback } from 'react';
import { emit, useChannel } from './socket';

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
