import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useChannel } from 'api/common/socket';
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
  const {
    checkpoints,
    addCheckpoint,
    clearCheckpoints,
    checkCheckpointCrossing,
    lapCount,
  } = useLapContext();
  const [locationHistory, setLocationHistory] = useState<
    LocationTimeSeriesPoint[]
  >([]);
  const prevLapCount = useRef(lapCount);

  const handleMessage = useCallback(
    (payload: string | TelemetryPayload) => {
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

      const crossing = checkCheckpointCrossing(
        gps.latitude,
        gps.longitude,
        tsMs,
      );

      if (crossing?.completedLap) {
        setLocationHistory([point]); // wipe trail only on a full lap, not every segment
      } else {
        setLocationHistory((prev) => [...prev, point]);
      }
    },
    [checkCheckpointCrossing],
  );

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
