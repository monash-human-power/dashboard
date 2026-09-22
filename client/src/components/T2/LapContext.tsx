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
    save([
      ...timing.checkpoints,
      {
        lat,
        long,
        label: timing.checkpoints.length
          ? `Segment ${timing.checkpoints.length}`
          : 'Start/Finish',
      },
    ]);
  };
  return (
    <LapContext.Provider
      value={{
        ...timing,
        addCheckpoint,
        clearCheckpoints: () => {
          save([]);
        },
        checkpointStatus,
      }}
    >
      {children}
    </LapContext.Provider>
  );
}
