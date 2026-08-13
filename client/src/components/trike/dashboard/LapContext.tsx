import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
} from 'react';

// metrics for a completed lap
export interface LapStat {
  avgSpeed: number; // km/h
  maxSpeed: number; // km/h
  avgPower: number; // W
  maxPower: number; // W
  durationSec: number;
  startTime: number; // chart x-axis value when this lap began
  endTime: number; // chart x-axis value when this lap ended
}

/**
 * running totals for the in-progress lap,
 * stored in a ref so that recordSample() doesn't trigger re-renders on every tick
 */
interface Accumulator {
  sumSpeed: number;
  maxSpeed: number;
  sumPower: number;
  maxPower: number;
  count: number; // number of samples recorded in this lap
  startTime: number; // chart x when this lap started
  lastTime: number; // chart x of most recent sample
}

// shape of the context value consumed by child components
interface LapContextValue {
  lapNum: number;
  // chart x-values where each lap boundary falls (length === lapNum)
  lapBoundaries: number[];
  // analytics for each completed lap (length === lapNum)
  lapStats: LapStat[];
  // live accumulator for the current in-progress lap (read-only snapshot)
  currentLapAccumulator: Accumulator;
  // finalise the current lap: snapshot stats, push a boundary, reset accumulator
  incLap: () => void;
  // undo the most recent lap split (no-op if no laps exist)
  decLap: () => void;
  // feed a new data sample into the current-lap accumulator (called on every chart tick)
  recordSample: (time: number, speedKmh: number, power: number) => void;
}

const INITIAL_ACCUMULATOR: Accumulator = {
  sumSpeed: 0,
  maxSpeed: 0,
  sumPower: 0,
  maxPower: 0,
  count: 0,
  startTime: 0,
  lastTime: 0,
};

const LapContext = createContext<LapContextValue | null>(null);

// hook to consume the lap context, must be rendered inside a <LapProvider>.
export function useLapContext(): LapContextValue {
  const ctx = useContext(LapContext);
  if (!ctx) {
    throw new Error('useLapContext must be used within a LapProvider');
  }
  return ctx;
}

/**
 * provides shared lap-splitting state to the dashboard.
 * wraps the dashboard so that LiveDataRow (buttons), TrikePowerSpeedTimeChart
 * (data feed + segment boundaries), and LapAnalyticsCard (per-lap stats) all share a single source of truth for lap data.
 */
export function LapProvider({ children }: { children: React.ReactNode }) {
  const [lapStats, setLapStats] = useState<LapStat[]>([]);
  const [lapBoundaries, setLapBoundaries] = useState<number[]>([]);
  const accRef = useRef<Accumulator>({ ...INITIAL_ACCUMULATOR });

  // tick counter — incremented after incLap/decLap so consumers re-render
  // and pick up the updated accRef snapshot.
  const [, setTick] = useState(0);

  /**
   * record a single data sample into the current-lap accumulator,
   * O(1) per call, mutates the ref directly to avoid re-renders.
   */
  const recordSample = useCallback(
    (time: number, speedKmh: number, power: number) => {
      const acc = accRef.current;
      if (acc.count === 0) {
        acc.startTime = time;
      }
      acc.sumSpeed += speedKmh;
      acc.maxSpeed = Math.max(acc.maxSpeed, speedKmh);
      acc.sumPower += power;
      acc.maxPower = Math.max(acc.maxPower, power);
      acc.count += 1;
      acc.lastTime = time;
    },
    [],
  );

  /**
   * finalise the current lap:
   * 1. snapshot the accumulator into a LapStat
   * 2. push the boundary time so the chart knows where to fade
   * 3. reset the accumulator for the next lap (startTime = previous endTime)
   */
  const incLap = useCallback(() => {
    const acc = accRef.current;
    if (acc.count === 0) return; // nothing to snapshot

    const stat: LapStat = {
      avgSpeed: acc.sumSpeed / acc.count,
      maxSpeed: acc.maxSpeed,
      avgPower: acc.sumPower / acc.count,
      maxPower: acc.maxPower,
      durationSec: acc.lastTime - acc.startTime,
      startTime: acc.startTime,
      endTime: acc.lastTime,
    };

    setLapStats((prev) => [...prev, stat]);
    setLapBoundaries((prev) => [...prev, acc.lastTime]);

    // reset accumulator - new lap starts where the old one ended
    accRef.current = {
      ...INITIAL_ACCUMULATOR,
      startTime: acc.lastTime,
    };
    setTick((t) => t + 1);
  }, []);

  /**
   * undo the most recent lap split
   * pops the last LapStat and boundary so the faded segment merges back into the current lap at full opacity
   */
  const decLap = useCallback(() => {
    setLapStats((prev) => {
      if (prev.length === 0) return prev;
      return prev.slice(0, -1);
    });
    setLapBoundaries((prev) => {
      if (prev.length === 0) return prev;
      return prev.slice(0, -1);
    });
    setTick((t) => t + 1);
  }, []);

  const value: LapContextValue = {
    lapNum: lapStats.length,
    lapBoundaries,
    lapStats,
    currentLapAccumulator: accRef.current,
    incLap,
    decLap,
    recordSample,
  };

  return <LapContext.Provider value={value}>{children}</LapContext.Provider>;
}
