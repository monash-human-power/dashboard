import { useState, useCallback } from 'react';
import { useChannel, emit } from '../socket';
import presets from './presets';

export function getPresets() {
  return presets;
}

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

  return [generate, generating, generated];
}
