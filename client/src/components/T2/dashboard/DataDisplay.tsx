import { useChannel } from 'api/common/socket';
import React, { useState, useRef, useCallback, useEffect } from 'react';

// 1 second time out
const TIMEOUT_MS = 3000;

// something to store the data that we collect
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

export default function DataDisplay(): JSX.Element {
  // Client sided detection of recieving telemetry data
  // Currently will claim to be disconnect if not recieving any new data for 2 seconds
  const [connected, setConnected] = useState(false);
  const [telemetry, setTelemetry] = useState<TelemetryPayload | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMessage = useCallback((payload: string | TelemetryPayload) => {
    setConnected(true);

    // Payload may arrive as a raw string or an already-parsed object
    // depending on how the server emitted it — handle both.
    const parsed: TelemetryPayload =
      typeof payload === 'string' ? JSON.parse(payload) : payload;
    setTelemetry(parsed);

    // Clear any pending "disconnected" timer since we just got a message
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Start a fresh countdown — if nothing else arrives in time, mark disconnected
    timeoutRef.current = setTimeout(() => {
      setConnected(false);
    }, TIMEOUT_MS);
  }, []);

  useChannel('t2-telemetry', handleMessage);

  // Cleanup the timer if the component unmounts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <header>
      <div>Status: {connected ? 'Connected' : 'Disconnected'}</div>
      {telemetry && (
        <div>
          <div>type: {telemetry.type}</div>
          <div>timestamp: {telemetry.timestamp}</div>
          <div>sessionId: {telemetry.sessionId}</div>
          <div>
            speed: {telemetry.data.speed.value} {telemetry.data.speed.unit}
          </div>
          <div>
            cadence: {telemetry.data.cadence.value}{' '}
            {telemetry.data.cadence.unit}
          </div>
          <div>
            power: {telemetry.data.power.value} {telemetry.data.power.unit}
          </div>
          <div>
            batteryVoltage: {telemetry.data.batteryVoltage.value}{' '}
            {telemetry.data.batteryVoltage.unit}
          </div>
          <div>gps.latitude: {telemetry.data.gps.latitude}</div>
          <div>gps.longitude: {telemetry.data.gps.longitude}</div>
          <div>gps.altitude: {telemetry.data.gps.altitude}</div>
          <div>gps.speed: {telemetry.data.gps.speed}</div>
        </div>
      )}
    </header>
  );
}
