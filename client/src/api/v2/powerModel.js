import { useState, useCallback } from 'react';
import { emit, useChannel } from './socket';

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

export function setCalibration(distance) {
  emit('submit-calibration', distance);
}

export function resetCalibration() {
  emit('reset-calibration');
}
