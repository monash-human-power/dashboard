import React, { useState, useCallback } from 'react';
import { useChannel } from 'api/common/socket';

interface TelemetryPayload {
  type: string;
  timestamp: string;
  sessionId: string;
  data: {
    speed: { value: number; unit: string };
    cadence: { value: number; unit: string };
    power: { value: number; unit: string };
    batteryVoltage: { value: number; unit: string };
    gps: {
      latitude: number;
      longitude: number;
      altitude: number;
      speed: number;
    };
  };
}

interface Analytics {
  sampleCount: number;
  currentSpeed: number;
  currentPower: number;
  currentCadence: number;
  currentBattery: number;
  avgSpeed: number;
  avgPower: number;
  avgCadence: number;
  maxSpeed: number;
  maxPower: number;
}

const INITIAL_ANALYTICS: Analytics = {
  sampleCount: 0,
  currentSpeed: 0,
  currentPower: 0,
  currentCadence: 0,
  currentBattery: 0,
  avgSpeed: 0,
  avgPower: 0,
  avgCadence: 0,
  maxSpeed: 0,
  maxPower: 0,
};

export default function RiderAnalytics(): JSX.Element {
  const [analytics, setAnalytics] = useState<Analytics>(INITIAL_ANALYTICS);

  const handleMessage = useCallback((payload: string | TelemetryPayload) => {
    const parsed: TelemetryPayload =
      typeof payload === 'string' ? JSON.parse(payload) : payload;
    const { speed, power, cadence, batteryVoltage } = parsed.data;

    setAnalytics((prev) => {
      const n = prev.sampleCount + 1;
      return {
        sampleCount: n,
        currentSpeed: speed.value,
        currentPower: power.value,
        currentCadence: cadence.value,
        currentBattery: batteryVoltage.value,
        // running average: old average scaled down, new sample scaled in
        avgSpeed: (prev.avgSpeed * prev.sampleCount + speed.value) / n,
        avgPower: (prev.avgPower * prev.sampleCount + power.value) / n,
        avgCadence: (prev.avgCadence * prev.sampleCount + cadence.value) / n,
        maxSpeed: Math.max(prev.maxSpeed, speed.value),
        maxPower: Math.max(prev.maxPower, power.value),
      };
    });
  }, []);

  useChannel('t2-telemetry', handleMessage);

  return (
    <div>
      <header>Analytics</header>
      <div>Samples received: {analytics.sampleCount}</div>
      <div>Average speed: {analytics.avgSpeed.toFixed(1)} km/h</div>
      <div>Average power: {analytics.avgPower.toFixed(0)} W</div>
      <div>Average cadence: {analytics.avgCadence.toFixed(0)} rpm</div>
    </div>
  );
}
