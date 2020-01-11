import { useState, useCallback } from 'react';
import presets from './presets';

export function getPresets() {
  return presets;
}

export function useGeneratePowerPlan() {
  const [generating, setGenerating] = useState(false);

  const generatePowerPlan = useCallback(() => {
    setGenerating(true);
  }, []);

  return [generating, generatePowerPlan];
}
