import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
} from 'react';

import { useSessionChannel as useChannel } from 'components/T2/SessionHistory';

interface TelemetryPayload {
  timestamp: string;
  data: { gps: { latitude: number; longitude: number } };
}
export interface Checkpoint {
  lat: number;
  long: number;
  label: string; // "Start/Finish" for index 0, "Segment 1", "Segment 2", ...
}

interface SegmentResult {
  label: string;
  durationSec: number;
}

interface SegmentTiming {
  lapNumber: number;
  durationSec: number;
}

interface LapContextValue {
  checkpoints: Checkpoint[];
  addCheckpoint: (lat: number, long: number) => void;
  clearCheckpoints: () => void;
  lapCount: number;
  lastSegment: SegmentResult | null;
  segmentHistory: { [label: string]: SegmentTiming[] }; // every recorded duration per segment, across laps
  currentSegmentElapsedSec: number;
  currentLapElapsedSec: number;
}

const CHECKPOINT_TRIGGER_RADIUS_M = 12;
const MIN_SEGMENT_DURATION_SEC = 5;

function haversineDistanceM(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const LapContext = createContext<LapContextValue | null>(null);

export function useLapContext(): LapContextValue {
  const ctx = useContext(LapContext);
  if (!ctx) {
    throw new Error('useLapContext must be used within a LapProvider');
  }
  return ctx;
}

export function LapProvider({ children }: { children: React.ReactNode }) {
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);
  const [lapCount, setLapCount] = useState(0);
  const [lastSegment, setLastSegment] = useState<SegmentResult | null>(null);
  const [currentLapElapsedSec, setCurrentLapElapsedSec] = useState(0);
  const lapStartTimeMsRef = useRef<number | null>(null);
  const [segmentHistory, setSegmentHistory] = useState<{
    [label: string]: SegmentTiming[];
  }>({});
  const [currentSegmentElapsedSec, setCurrentSegmentElapsedSec] = useState(0);
  const hasStartedRef = useRef(false);

  // Which checkpoint index we're currently waiting to reach next
  const targetIndexRef = useRef(0);
  const currentLapNumberRef = useRef(1);
  // When the current segment (since the last checkpoint) started
  const segmentStartTimeMsRef = useRef<number | null>(null);

  const addCheckpoint = useCallback((lat: number, long: number) => {
    hasStartedRef.current = false;
    setCheckpoints((prev) => {
      const label =
        prev.length === 0 ? 'Start/Finish' : `Segment ${prev.length}`;
      return [...prev, { lat, long, label }];
    });
  }, []);

  const clearCheckpoints = useCallback(() => {
    setCheckpoints([]);
    setLapCount(0);
    setLastSegment(null);
    setSegmentHistory({});
    setCurrentSegmentElapsedSec(0);
    setCurrentLapElapsedSec(0);
    targetIndexRef.current = 0;
    segmentStartTimeMsRef.current = null;
    lapStartTimeMsRef.current = null;
    currentLapNumberRef.current = 1;
    hasStartedRef.current = false;
  }, []);

  const processCrossing = useCallback(
    (lat: number, long: number, tsMs: number) => {
      if (checkpoints.length === 0) return null;

      if (!hasStartedRef.current) {
        const startPoint = checkpoints[0];
        const distanceToStartM = haversineDistanceM(
          startPoint.lat,
          startPoint.long,
          lat,
          long,
        );

        if (distanceToStartM <= CHECKPOINT_TRIGGER_RADIUS_M) {
          hasStartedRef.current = true;
          segmentStartTimeMsRef.current = tsMs;
          lapStartTimeMsRef.current = tsMs;
          targetIndexRef.current = checkpoints.length > 1 ? 1 : 0;
        }

        // Either way — not yet started, or just started right now —
        // this point itself never counts as completing anything
        return null;
      }

      if (segmentStartTimeMsRef.current === null) {
        segmentStartTimeMsRef.current = tsMs;
        lapStartTimeMsRef.current = tsMs; // lap clock also starts here
        targetIndexRef.current = checkpoints.length > 1 ? 1 : 0;
        return null;
      }

      const target = checkpoints[targetIndexRef.current];
      const distanceM = haversineDistanceM(target.lat, target.long, lat, long);
      const elapsedSec = (tsMs - segmentStartTimeMsRef.current) / 1000;
      setCurrentSegmentElapsedSec(elapsedSec);

      // Lap clock keeps running regardless of segment crossings
      if (lapStartTimeMsRef.current !== null) {
        setCurrentLapElapsedSec((tsMs - lapStartTimeMsRef.current) / 1000);
      }

      if (
        distanceM <= CHECKPOINT_TRIGGER_RADIUS_M &&
        elapsedSec >= MIN_SEGMENT_DURATION_SEC
      ) {
        const crossedIndex = targetIndexRef.current;
        const lapNumber = currentLapNumberRef.current;
        const completedLap = crossedIndex === 0;

        // The label for the leg just finished — independent of the checkpoint's
        // own display label. Crossing checkpoint i finishes "Segment i"; crossing
        // back to Start/Finish (index 0) finishes the final closing segment.
        const segmentLabel = completedLap
          ? `Segment ${checkpoints.length}`
          : `Segment ${crossedIndex}`;

        const result: SegmentResult = {
          label: segmentLabel,
          durationSec: elapsedSec,
        };
        setLastSegment(result);

        setSegmentHistory((prev) => {
          const next = { ...prev };
          if (checkpoints.length > 1) {
            next[segmentLabel] = [
              ...(next[segmentLabel] ?? []),
              { lapNumber, durationSec: elapsedSec },
            ];
          }

          if (completedLap && lapStartTimeMsRef.current !== null) {
            const fullLapDurationSec =
              (tsMs - lapStartTimeMsRef.current) / 1000;
            next['Full Lap'] = [
              ...(next['Full Lap'] ?? []),
              { lapNumber, durationSec: fullLapDurationSec },
            ];
          }

          return next;
        });

        if (completedLap) {
          setLapCount((prev) => prev + 1);
          lapStartTimeMsRef.current = tsMs;
          setCurrentLapElapsedSec(0);
          currentLapNumberRef.current += 1;
        }

        targetIndexRef.current =
          checkpoints.length > 1 ? (crossedIndex + 1) % checkpoints.length : 0;
        segmentStartTimeMsRef.current = tsMs;
        setCurrentSegmentElapsedSec(0);

        return { crossedCheckpointIndex: crossedIndex, completedLap };
      }

      return null;
    },
    [checkpoints],
  );

  const handleTelemetry = useCallback(
    (payload: string | TelemetryPayload) => {
      const parsed: TelemetryPayload =
        typeof payload === 'string' ? JSON.parse(payload) : payload;
      const tsMs = new Date(parsed.timestamp).getTime();
      processCrossing(
        parsed.data.gps.latitude,
        parsed.data.gps.longitude,
        tsMs,
      );
    },
    [processCrossing],
  );

  useChannel('t2-telemetry', handleTelemetry);

  const value: LapContextValue = {
    checkpoints,
    addCheckpoint,
    clearCheckpoints,
    lapCount,
    lastSegment,
    segmentHistory,
    currentSegmentElapsedSec,
    currentLapElapsedSec,
  };

  return <LapContext.Provider value={value}>{children}</LapContext.Provider>;
}
