import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import {
  useSessionChannel,
  useSessionHistory,
  LapTiming,
  Telemetry,
} from 'components/T2/SessionHistory';

export interface Checkpoint {
  lat: number;
  long: number;
  label: string;
}
interface LapContextValue extends LapTiming {
  addCheckpoint: (lat: number, long: number) => void;
  removeCheckpoint: (lat: number, long: number) => void;
  setStartCheckpoint: (lat: number, long: number) => void; // new
  clearCheckpoints: () => void;
  checkpointStatus: string;
}
const EMPTY: LapTiming = {
  checkpoints: [],
  lapCount: 0,
  lastSegment: null,
  segmentHistory: {},
  currentSegmentElapsedSec: 0,
  currentLapElapsedSec: 0,
};
const LapContext = createContext<LapContextValue | null>(null);
export function useLapContext(): LapContextValue {
  const context = useContext(LapContext);
  if (!context)
    throw new Error('useLapContext must be used within a LapProvider');
  return context;
}

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

const REMOVE_CLICK_RADIUS_M = 30;

function insertionIndexFor(
  checkpoints: Checkpoint[],
  lat: number,
  long: number,
): number {
  if (checkpoints.length < 2) return checkpoints.length; // nothing to compare yet — just append

  let bestIndex = checkpoints.length;
  let bestExtraDistance = Infinity;

  for (let i = 0; i < checkpoints.length; i += 1) {
    const a = checkpoints[i];
    const b = checkpoints[(i + 1) % checkpoints.length]; // wraps last → Start/Finish
    const extra =
      haversineDistanceM(a.lat, a.long, lat, long) +
      haversineDistanceM(a.lat, a.long, lat, long) +
      haversineDistanceM(lat, long, b.lat, b.long) -
      haversineDistanceM(a.lat, a.long, b.lat, b.long);

    if (extra < bestExtraDistance) {
      bestExtraDistance = extra;
      bestIndex = i + 1; // insert between a and b
    }
  }

  return bestIndex;
}

export function LapProvider({ children }: { children: React.ReactNode }) {
  const { session, records, savedTiming } = useSessionHistory();
  const latest = records[records.length - 1];
  const [timing, setTiming] = useState<LapTiming>(
    () => latest?.lapTiming || savedTiming || EMPTY,
  );
  const [checkpointStatus, setCheckpointStatus] = useState('');
  const saving = useRef(false);
  const mounted = useRef(true);
  useEffect(
    () => () => {
      mounted.current = false;
    },
    [],
  );
  const handleTelemetry = useCallback((record: Telemetry) => {
    if (record.lapTiming) setTiming(record.lapTiming);
  }, []);
  useSessionChannel('t2-telemetry', handleTelemetry);

  const save = async (checkpoints: Checkpoint[]) => {
    if (session) {
      setCheckpointStatus('Go to live before changing checkpoint positions.');
      return;
    }
    if (!latest) {
      setCheckpointStatus('Wait for telemetry before setting checkpoints.');
      return;
    }
    if (saving.current) return;
    saving.current = true;
    setCheckpointStatus('Saving checkpoints and calculating timing…');
    try {
      const response = await fetch(
        `/api/t2/sessions/${encodeURIComponent(latest.sessionId)}/checkpoints`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ checkpoints }),
        },
      );
      if (!response.ok)
        throw new Error(
          'Could not save checkpoints. Check the backend and try again.',
        );
      const restored = await response.json();
      if (mounted.current) {
        setTiming(restored);
        setCheckpointStatus('Checkpoints saved for this session.');
      }
    } catch (error) {
      if (mounted.current) setCheckpointStatus(error.message);
    } finally {
      saving.current = false;
    }
  };
  const addCheckpoint = (lat: number, long: number) => {
    const insertAt = insertionIndexFor(timing.checkpoints, lat, long);

    const updated = [
      ...timing.checkpoints.slice(0, insertAt),
      { lat, long, label: '' }, // label gets fixed up below, based on final position
      ...timing.checkpoints.slice(insertAt),
    ].map((cp, i) => ({
      lat: cp.lat,
      long: cp.long,
      label: i === 0 ? 'Start/Finish' : `Segment ${i}`,
    }));

    save(updated);
  };
  const removeCheckpoint = (lat: number, long: number) => {
    if (timing.checkpoints.length === 0) return;

    // Find whichever existing checkpoint is closest to where the user clicked
    let nearestIndex = 0;
    let nearestDistM = Infinity;
    timing.checkpoints.forEach((cp, i) => {
      const d = haversineDistanceM(cp.lat, cp.long, lat, long);
      if (d < nearestDistM) {
        nearestDistM = d;
        nearestIndex = i;
      }
    });

    if (nearestDistM > REMOVE_CLICK_RADIUS_M) {
      setCheckpointStatus('Click closer to an existing point to remove it.');
      return;
    }

    // Rebuild the array without that point, relabeling so index 0 stays
    // "Start/Finish" and the rest stay numbered "Segment 1", "Segment 2", ...
    const remaining = timing.checkpoints
      .filter((_, i) => i !== nearestIndex)
      .map((cp, i) => ({
        lat: cp.lat,
        long: cp.long,
        label: i === 0 ? 'Start/Finish' : `Segment ${i}`,
      }));

    save(remaining);
  };
  const setStartCheckpoint = (lat: number, long: number) => {
    if (timing.checkpoints.length < 2) return; // nothing to reorder

    let nearestIndex = 0;
    let nearestDistM = Infinity;
    timing.checkpoints.forEach((cp, i) => {
      const d = haversineDistanceM(cp.lat, cp.long, lat, long);
      if (d < nearestDistM) {
        nearestDistM = d;
        nearestIndex = i;
      }
    });

    if (nearestDistM > REMOVE_CLICK_RADIUS_M) {
      setCheckpointStatus(
        'Click closer to an existing point to make it the start.',
      );
      return;
    }

    if (nearestIndex === 0) return; // already the start

    // Rotate so the chosen point becomes index 0, keeping everyone else
    // in the same relative loop order
    const rotated = [
      ...timing.checkpoints.slice(nearestIndex),
      ...timing.checkpoints.slice(0, nearestIndex),
    ].map((cp, i) => ({
      lat: cp.lat,
      long: cp.long,
      label: i === 0 ? 'Start/Finish' : `Segment ${i}`,
    }));

    save(rotated);
  };
  return (
    <LapContext.Provider
      value={{
        ...timing,
        addCheckpoint,
        removeCheckpoint,
        clearCheckpoints: () => {
          save([]);
        },
        checkpointStatus,
        setStartCheckpoint,
      }}
    >
      {children}
    </LapContext.Provider>
  );
}
