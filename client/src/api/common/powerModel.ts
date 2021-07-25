import { emit, useChannel, useChannelShaped } from 'api/common/socket';
import { useCallback, useState } from 'react';
import { Number, Record, Static } from 'runtypes';

const RecommendedData = Record({
  /** Recommended speed */
  rec_speed: Number,
  /** Recommended power */
  rec_power: Number,
  /** Distance remaining in current power zone */
  zdist: Number,
  /** Distance offset */
  distance_offset: Number,
  /** Total distance remaining */
  distance_left: Number,
});
type RecommendedData = Static<typeof RecommendedData>;

const EstimatedData = Record({
  /** Predicted maximum speed */
  predicted_max_speed: Number,
});
type EstimatedData = Static<typeof EstimatedData>;

const AchievedData = Record({
  /**Achieved maximum (previous trap) speed */
  achieved_max_speed: Number,
})
type AchievedData = Static<typeof AchievedData>;
/**
 * Use current power model data
 *
 * @returns Power model data
 */
export function usePowerModel() {
  const [recData, setRecData] = useState<RecommendedData | null>(null);
  const [estData, setEstData] = useState<EstimatedData | null>(null);
  const [achievedData, setAchievedData] = useState<AchievedData | null>(null);

  const recHandler = useCallback((data: RecommendedData) => {
    setRecData(data);
  }, []);
  useChannelShaped('power-model-recommended-SP', RecommendedData, recHandler);

  const maxHandler = useCallback((data: EstimatedData) => {
    setEstData(data);
  }, []);
  useChannelShaped('power-model-predicted-max-speed', EstimatedData, maxHandler);

  const handleAchivedMaxData = useCallback((data: AchievedData) => {
    setAchievedData(data);
  }, []);
  useChannelShaped('power-model-achieved-max-speed', AchievedData, handleAchivedMaxData);

  return { recData, maxData: estData, achievedMaxData: achievedData};
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
