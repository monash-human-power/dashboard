import { useState, useCallback } from 'react';
import { emit, useChannel } from './socket';

export interface PowerModelData {
  /** Recommended speed */
  recSpeed?: number;
  /** Recommended power */
  recPower?: number;
  /** Distance remaining in current power zone */
  zoneDist?: number;
  /** Distance offset */
  distanceOffset?: number;
  /** Total distance remaining */
  distanceLeft?: number;
  /** Predicted maximum speed */
  predictedMaxSpeed?: number;
}

/**
 * Use current power model data
 *
 * @returns Power model data
 */
export function usePowerModel(): PowerModelData {
  const [recSpData, setRecSpData] = useState({});
  const [maxSpData, setMaxSpData] = useState({});

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
 * Use power model running state
 *
 * @returns The power model running state and a function to set this value.
 */
export function usePowerModelState() {
  const [running, setRunning] = useState(false);

  const handleData = useCallback(() => {
    setRunning(true);
  }, []);
  useChannel('power-model-running', handleData);

  const setState = useCallback((state: boolean) => {
    if (state) {
      emit('start-power-model');
    } else {
      emit('stop-power-model');
    }
    setRunning(state);
  }, []);

  return [running, setState] as const;
}

/**
 * Set power model calibration
 *
 * @param {number} distance Current actual distance
 */
export function setCalibration(distance: number) {
  emit('submit-calibration', distance);
}

/**
 * Reset power model calibration
 */
export function resetCalibration() {
  emit('reset-calibration');
}
