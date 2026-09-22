import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  useSessionChannel as useChannel,
  useSessionHistory,
  MAX_SESSION_READINGS,
} from 'components/T2/SessionHistory';
import LocationMap, {
  LocationTimeSeriesPoint,
} from 'components/common/charts/LocationMap';
import { useLapContext } from 'components/T2/LapContext';

interface TelemetryPayload {
  type: string;
  timestamp: string;
  sessionId: string;
  data: {
    speed: { value: number; unit: string };
    gps: {
      latitude: number;
      longitude: number;
      altitude: number;
      speed: number;
    };
  };
}

export default function AnimatedLocationMap(): JSX.Element {
  const { records } = useSessionHistory();
  const {
    checkpoints,
    addCheckpoint,
    clearCheckpoints,
    lapCount,
  } = useLapContext();
  const [locationHistory, setLocationHistory] = useState<
    LocationTimeSeriesPoint[]
  >(() =>
    records.map((record) => ({
      lat: record.data.gps.latitude,
      long: record.data.gps.longitude,
      ts: Date.parse(record.timestamp),
      speedKmh: record.data.speed.value,
    })),
  );
  const prevLapCount = useRef(lapCount);

  const handleMessage = useCallback((payload: string | TelemetryPayload) => {
    const parsed: TelemetryPayload =
      typeof payload === 'string' ? JSON.parse(payload) : payload;
    const { gps, speed } = parsed.data;
    const tsMs = new Date(parsed.timestamp).getTime();

    const point: LocationTimeSeriesPoint = {
      lat: gps.latitude,
      long: gps.longitude,
      ts: tsMs,
      speedKmh: speed.value,
    };
    setLocationHistory((prev) => [
      ...prev.slice(-(MAX_SESSION_READINGS - 1)),
      point,
    ]);
  }, []);

  useChannel('t2-telemetry', handleMessage);

  useEffect(() => {
    if (lapCount !== prevLapCount.current) {
      prevLapCount.current = lapCount;
      setLocationHistory((prev) =>
        prev.length > 1 ? [prev[prev.length - 1]] : prev,
      );
    }
  }, [lapCount]);

  return (
    <LocationMap
      compactRendering
      series={locationHistory}
      checkpoints={checkpoints}
      binCount={7}
      showLegend
      showDirectionCues
      arrowEvery={10}
      onMapClick={(lat, long) => addCheckpoint(lat, long)}
    />
  );
}
