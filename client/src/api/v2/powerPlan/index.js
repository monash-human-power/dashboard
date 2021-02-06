import { useState, useCallback } from 'react';
import { useChannel, emit } from 'api/common/socket';
import presets from 'api/common/presets';

/**
 * @typedef {import('./presets').PowerPlanPreset} PowerPlanPreset
 */
/**
 * @typedef {import('./presets').PowerPlan} PowerPlan
 */

/**
 * Get power plan presets
 *
 * @returns {PowerPlanPreset[]} presets
 */
export function getPresets() {
  return presets;
}

/**
 * @typedef {object} GeneratePowerPlanHook
 * @property {function(PowerPlan)}  generate    Generate a new power plan
 * @property {boolean}              generating  Currently generating a power plan
 * @property {boolean}              generated   Finished generating a power plan
 */

/**
 * Use power plan generator
 *
 * @returns {GeneratePowerPlanHook} Hook
 */
export function useGeneratePowerPlan() {
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleData = useCallback(() => {
    setGenerating(false);
    setGenerated(true);
  }, []);
  useChannel('power-plan-generated', handleData);

  const generate = useCallback((plan) => {
    setGenerating(true);
    setGenerated(false);

    const {
      fileName,
      mass,
      startAdjust,
      lowerBound,
      upperBound,
      step,
      startTrap,
      endTrap,
      zones,
    } = plan;

    const payload = {
      numZones: zones.length,
      inputs: {
        fileName,
        mass,
        startAdjust,
        lowerBound,
        upperBound,
        step,
        startTrap,
        endTrap,
      },
    };
    zones.forEach((zone, index) => {
      payload[`zone${index + 1}`] = zone;
    });

    emit('create-power-plan', payload);
  }, []);

  return { generate, generating, generated };
}
