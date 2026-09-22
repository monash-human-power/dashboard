import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from 'react';
import { useChannel } from 'api/common/socket';

export const MAX_SESSION_READINGS = 20000;
export interface LapTiming {
  checkpoints: { lat: number; long: number; label: string }[];
  lapCount: number;
  lastSegment: { label: string; durationSec: number } | null;
  segmentHistory: {
    [label: string]: { lapNumber: number; durationSec: number }[];
  };
  currentSegmentElapsedSec: number;
  currentLapElapsedSec: number;
}

export interface Telemetry {
  type: string;
  sessionId: string;
  timestamp: string;
  eventId?: string;
  lapTiming?: LapTiming;
  data: {
    speed: { value: number; unit: string };
    power: { value: number; unit: string };
    cadence: { value: number; unit: string };
    batteryVoltage: { value: number; unit: string };
    gps: {
      latitude: number;
      longitude: number;
      altitude: number;
      speed: number;
    };
  };
}
const HistoryContext = createContext<{
  session: string | null;
  records: Telemetry[];
  select: (id: string | null) => void;
  revision: number;
  savedTiming?: LapTiming;
}>({ session: null, records: [], select: () => {}, revision: 0 });
export const useSessionHistory = () => useContext(HistoryContext);

// Seed components from history, then deliver only additional live readings.
export function useSessionChannel(_channel: string, callback: Function) {
  const { session, records } = useSessionHistory();
  const consumed = useRef(records[records.length - 1]);
  useEffect(() => {
    const start = consumed.current
      ? records.lastIndexOf(consumed.current) + 1
      : 0;
    consumed.current = records[records.length - 1];
    if (!session) records.slice(start).forEach((record) => callback(record));
  }, [session, records, callback]);
}

export function SessionHistoryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<string | null>(null);
  const [liveId, setLiveId] = useState<string | null>(null);
  const [records, setRecords] = useState<Telemetry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [revision, setRevision] = useState(0);
  const [savedTiming, setSavedTiming] = useState<LapTiming | undefined>();
  const mode = useRef<string | null>(null);
  const active = useRef<string | null>(null);
  const pinned = useRef(false);
  const buffer = useRef<Telemetry[]>([]);
  const seen = useRef(new Set<string>());

  const receive = useCallback((payload: string | Telemetry) => {
    const record: Telemetry =
      typeof payload === 'string' ? JSON.parse(payload) : payload;
    if (mode.current) {
      if (record.sessionId === mode.current) {
        buffer.current.push(record);
        if (buffer.current.length > MAX_SESSION_READINGS)
          buffer.current.shift();
      }
      return;
    }
    // A restored history belongs to one session: never mix another publisher into it.
    if (pinned.current && record.sessionId !== active.current) return;
    if (active.current !== record.sessionId) {
      active.current = record.sessionId;
      setLiveId(record.sessionId);
      seen.current.clear();
      setSavedTiming(undefined);
      setRecords([record]);
      setRevision((previous) => previous + 1);
    } else {
      if (record.eventId && seen.current.has(record.eventId)) return;
      setRecords((previous) => [
        ...previous.slice(-(MAX_SESSION_READINGS - 1)),
        record,
      ]);
    }
    if (record.eventId) seen.current.add(record.eventId);
    if (seen.current.size > MAX_SESSION_READINGS)
      seen.current.delete(seen.current.values().next().value);
  }, []);
  useChannel('t2-telemetry', receive);

  const select = (id: string | null) => {
    setError('');
    if (!id) {
      // Reuse the already loaded snapshot and catch up from the local live buffer.
      active.current = mode.current;
      pinned.current = !!active.current;
      setLiveId(active.current);
      const pending = buffer.current.filter((record) => {
        if (
          record.sessionId !== active.current ||
          (record.eventId && seen.current.has(record.eventId))
        )
          return false;
        if (record.eventId) seen.current.add(record.eventId);
        return true;
      });
      setRecords((previous) =>
        [...previous, ...pending].slice(-MAX_SESSION_READINGS),
      );
      seen.current = new Set(
        Array.from(seen.current).slice(-MAX_SESSION_READINGS),
      );
      setLoading(false);
    } else {
      setSavedTiming(undefined);
      setLoading(true);
      setRecords([]);
      seen.current.clear();
    }
    buffer.current = [];
    mode.current = id;
    setSession(id);
    setRevision((previous) => previous + 1);
  };

  const freshLive = () => {
    mode.current = null;
    active.current = null;
    pinned.current = false;
    buffer.current = [];
    seen.current.clear();
    setSession(null);
    setLiveId(null);
    setRecords([]);
    setSavedTiming(undefined);
    setError('');
    setLoading(false);
    setRevision((previous) => previous + 1);
  };

  useEffect(() => {
    if (!session) return undefined;
    const controller = new AbortController();
    fetch(`/api/t2/sessions/${encodeURIComponent(session)}/snapshot`, {
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok)
          throw new Error(
            'Could not load history. Check the backend and retry.',
          );
        return response.json();
      })
      .then((page) => {
        if (controller.signal.aborted) return;
        const restored: Telemetry[] = page.telemetry.slice(
          -MAX_SESSION_READINGS,
        );
        seen.current = new Set(
          restored
            .map((record) => record.eventId)
            .filter((id): id is string => !!id),
        );
        setRecords(restored);
        setSavedTiming(page.lapTiming);
        setLoading(false);
      })
      .catch((failure) => {
        if (!controller.signal.aborted) {
          setError(failure.message);
          setLoading(false);
        }
      });
    return () => controller.abort();
  }, [session, revision]);

  return (
    <HistoryContext.Provider
      value={{ session, records, select, revision, savedTiming }}
    >
      <div className="m-3" role="status">
        {session
          ? `Viewing saved session: ${session}.`
          : `Live session: ${liveId || 'waiting for telemetry'}.`}{' '}
        {loading
          ? 'Loading saved readings…'
          : error || `${records.length} readings (latest 20,000 maximum).`}{' '}
        {session && (
          <>
            <button
              type="button"
              disabled={loading || !!error}
              onClick={() => select(null)}
            >
              Go to live
            </button>{' '}
            <button type="button" onClick={() => select(session)}>
              Reload session
            </button>{' '}
          </>
        )}
        {(session || pinned.current) && (
          <button type="button" onClick={freshLive}>
            Start fresh live view
          </button>
        )}
        {session && (
          <div>
            Go to live continues this session using the loaded history. Other
            session IDs stay separate.
          </div>
        )}
      </div>
      {!loading && !error && children}
    </HistoryContext.Provider>
  );
}
