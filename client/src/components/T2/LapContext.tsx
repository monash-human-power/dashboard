import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
} from 'react';

export interface Checkpoint {
  lat: number;
  long: number;
  label: string; // "Start/Finish" for index 0, "Segment 1", "Segment 2", ...
}

interface SegmentResult {
  label: string;
  durationSec: number;
}

interface LapContextValue {
  checkpoints: Checkpoint[];
  addCheckpoint: (lat: number, long: number) => void;
  clearCheckpoints: () => void;
  lapCount: number;
  lastSegment: SegmentResult | null;
  segmentHistory: { [label: string]: number[] }; // every recorded duration per segment, across laps
  currentSegmentElapsedSec: number;
  checkCheckpointCrossing: (
    lat: number,
    long: number,
    tsMs: number,
  ) => { crossedCheckpointIndex: number; completedLap: boolean } | null;
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
  const [segmentHistory, setSegmentHistory] = useState<{
    [label: string]: number[];
  }>({});
  const [currentSegmentElapsedSec, setCurrentSegmentElapsedSec] = useState(0);

  // Which checkpoint index we're currently waiting to reach next
  const targetIndexRef = useRef(0);
  // When the current segment (since the last checkpoint) started
  const segmentStartTimeMsRef = useRef<number | null>(null);

  const addCheckpoint = useCallback((lat: number, long: number) => {
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
    targetIndexRef.current = 0;
    segmentStartTimeMsRef.current = null;
  }, []);

  const checkCheckpointCrossing = useCallback(
    (lat: number, long: number, tsMs: number) => {
      if (checkpoints.length === 0) return null;

      // First point after checkpoints exist — start timing, don't trigger yet
      if (segmentStartTimeMsRef.current === null) {
        segmentStartTimeMsRef.current = tsMs;
        targetIndexRef.current = checkpoints.length > 1 ? 1 : 0;
        return null;
      }

      const target = checkpoints[targetIndexRef.current];
      const distanceM = haversineDistanceM(target.lat, target.long, lat, long);
      const elapsedSec = (tsMs - segmentStartTimeMsRef.current) / 1000;
      setCurrentSegmentElapsedSec(elapsedSec);

      if (
        distanceM <= CHECKPOINT_TRIGGER_RADIUS_M &&
        elapsedSec >= MIN_SEGMENT_DURATION_SEC
      ) {
        const crossedIndex = targetIndexRef.current;
        const result: SegmentResult = {
          label: target.label,
          durationSec: elapsedSec,
        };

        setLastSegment(result);
        setSegmentHistory((prev) => ({
          ...prev,
          [target.label]: [...(prev[target.label] ?? []), elapsedSec],
        }));

        const completedLap = crossedIndex === 0;
        if (completedLap) {
          setLapCount((prev) => prev + 1);
        }

        // Advance to the next checkpoint in sequence, wrapping back to 0
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

  const value: LapContextValue = {
    checkpoints,
    addCheckpoint,
    clearCheckpoints,
    lapCount,
    lastSegment,
    segmentHistory,
    currentSegmentElapsedSec,
    checkCheckpointCrossing,
  };

  return <LapContext.Provider value={value}>{children}</LapContext.Provider>;
}
