import React, { useEffect, useRef, useState, useMemo } from 'react';

import { useChannel } from 'api/common/socket';
import LocationMap, {
  LocationTimeSeriesPoint,
} from 'components/common/charts/LocationMap';
import { LatLngTuple } from 'leaflet';

// Public so LiveDataRow uses the same interval
export const INTERVAL_MS = 50;

// ---- load test fixtures (numbers can be nested strings like ["1"]) ----
const rawLatLng: any[] = require('../CaseyLatLngTuple.json');
let rawTimes: any[] | null = null;
try {
  rawTimes = require('../CaseyTimes.json');
} catch {
  /* optional */
}

// ---- normalisers ----
const toNum = (v: any): number => (Array.isArray(v) ? Number(v[0]) : Number(v));
const normaliseLatLng = (raw: any[]): [number, number][] =>
  raw.map((p: any) => [toNum(p[0]), toNum(p[1])] as [number, number]);
const normaliseTimesMs = (raw: any[] | null): number[] | null =>
  raw ? raw.map((v) => Math.round(toNum(v) * 1000)) : null;

const median = (xs: number[]) => {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
const medianDiff = (ts: number[]) => {
  const d: number[] = [];
  for (let i = 1; i < ts.length; i += 1) {
    const dd = ts[i] - ts[i - 1];
    if (Number.isFinite(dd) && dd > 0) d.push(dd);
  }
  return median(d);
};

// ---- light helpers (duplicated here so we can compute speeds per segment) ----
const haversineMeters = (
  a: LocationTimeSeriesPoint,
  b: LocationTimeSeriesPoint,
) => {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 6371000;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.long - a.long);
  const s1 = Math.sin(dLat / 2);
  const s2 = Math.sin(dLng / 2);
  const t = s1 * s1 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * s2 * s2;
  return 2 * R * Math.asin(Math.sqrt(t));
};
const segmentSpeedKmh = (
  a: LocationTimeSeriesPoint,
  b: LocationTimeSeriesPoint,
  samplePeriodMs?: number,
): number => {
  if (Number.isFinite(a.speedKmh as number)) return a.speedKmh as number;
  if (typeof a.ts === 'number' && typeof b.ts === 'number' && b.ts > a.ts) {
    const mps = haversineMeters(a, b) / ((b.ts - a.ts) / 1000);
    return mps * 3.6;
  }
  if (typeof samplePeriodMs === 'number' && samplePeriodMs > 0) {
    const mps = haversineMeters(a, b) / (samplePeriodMs / 1000);
    return mps * 3.6;
  }
  return 0;
};

// robust quantile for breaks
const quantile = (sortedAsc: number[], q: number) => {
  if (!sortedAsc.length) return 0;
  const pos = (sortedAsc.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  return sortedAsc[base + 1] !== undefined
    ? sortedAsc[base] + rest * (sortedAsc[base + 1] - sortedAsc[base])
    : sortedAsc[base];
};
const deriveBreaks = (speeds: number[]): [number, number, number] => {
  const clean = speeds.filter((v) => Number.isFinite(v) && v >= 0);
  if (clean.length < 4) return [10, 20, 35]; // fallback when tiny sample
  const s = [...clean].sort((a, b) => a - b);
  let p25 = quantile(s, 0.25);
  let p50 = quantile(s, 0.5);
  let p75 = quantile(s, 0.75);
  const eps = Math.max(0.1, (s[s.length - 1] - s[0]) * 0.01);
  if (!(p25 < p50)) p50 = p25 + eps;
  if (!(p50 < p75)) p75 = p50 + eps;
  return [p25, p50, p75];
};

// Tuple <-> LTSP for LocationMap import
export const tupleToLTSP = ([
  lat,
  long,
]: LatLngTuple): LocationTimeSeriesPoint => ({ lat, long });
export const LTSPToTuple = ({
  lat,
  long,
}: LocationTimeSeriesPoint): LatLngTuple => [lat, long];

export default function AnimatedLocationMap({
  assumedPeriodMs = 1000,
}: { assumedPeriodMs?: number } = {}): JSX.Element {
  // normalised inputs
  const latLng = useMemo(() => normaliseLatLng(rawLatLng), []);
  const timesMs = useMemo(() => normaliseTimesMs(rawTimes), []);

  // base series (lat/long)
  const baseSeries = useMemo<LocationTimeSeriesPoint[]>(
    () => latLng.map(([lat, long]) => ({ lat, long })),
    [latLng],
  );

  // sample period fallback (if no per-point ts)
  const inferredPeriodMs = useMemo<number>(() => {
    if (timesMs && timesMs.length > 1)
      return medianDiff(timesMs) || assumedPeriodMs;
    return assumedPeriodMs;
  }, [timesMs, assumedPeriodMs]);

  // current lap points
  const [locationHistory, setLocationHistory] = useState<
    LocationTimeSeriesPoint[]
  >(() => (baseSeries.length ? [{ ...baseSeries[0], ts: timesMs?.[0] }] : []));

  // playback
  const indexRef = useRef(1);
  const [playbackToken, setPlaybackToken] = useState(0);
  const reset = () => {
    indexRef.current = 1;
    setLocationHistory(
      baseSeries.length ? [{ ...baseSeries[0], ts: timesMs?.[0] }] : [],
    );
    setPlaybackToken((t) => t + 1);
  };
  useChannel('wireless_module-3-start', reset);

  // --------- breaks: warm-up then freeze ----------
  // session-wide speed sample
  const allSpeedsRef = useRef<number[]>([]);
  // the breaks we expose to LocationMap
  const [effectiveBreaks, setEffectiveBreaks] = useState<number[] | null>(null);
  const [frozen, setFrozen] = useState(false);
  const stableCountRef = useRef(0);

  // knobs
  const WARMUP_SEGMENTS = 800; // or tweak to time-based if you prefer
  const CHANGE_EPS = 1; // km/h; smaller changes are considered “stable”
  const STABLE_RUNS_TO_FREEZE = 2; // how many consecutive stable recomputes to freeze

  const maybeUpdateBreaks = () => {
    if (frozen) return;

    const next = deriveBreaks(allSpeedsRef.current);
    const prev = effectiveBreaks ?? next;
    const maxDelta = Math.max(
      Math.abs(next[0] - prev[0]),
      Math.abs(next[1] - prev[1]),
      Math.abs(next[2] - prev[2]),
    );

    setEffectiveBreaks(next);

    // stability logic
    if (maxDelta < CHANGE_EPS) {
      stableCountRef.current += 1;
    } else {
      stableCountRef.current = 0;
    }

    // freeze either when enough segments collected, or when stable for N runs
    const enoughData = allSpeedsRef.current.length >= WARMUP_SEGMENTS;
    const stableEnough = stableCountRef.current >= STABLE_RUNS_TO_FREEZE;
    if (enoughData || stableEnough) {
      setFrozen(true);
      // one last set to ensure we freeze the final values
      setEffectiveBreaks(next);
      // console.debug('Breaks frozen at:', next);
    }
  };

  // playback driver: add points, compute segment speed for breaks
  useEffect(() => {
    if (!baseSeries.length) return () => {};

    indexRef.current = 1;
    const synthStart = Date.now();
    const id = window.setInterval(() => {
      const i = indexRef.current;
      if (i >= baseSeries.length) {
        clearInterval(id);
        return;
      }

      const base = baseSeries[i];
      const ts =
        timesMs && timesMs[i] != null
          ? timesMs[i]
          : synthStart + i * Math.max(1, inferredPeriodMs);

      // compute speed for the new segment (prev -> current)
      setLocationHistory((prev) => {
        const nextPoint = { ...base, ts };
        if (prev.length) {
          const v = segmentSpeedKmh(
            prev[prev.length - 1],
            nextPoint,
            inferredPeriodMs,
          );
          if (Number.isFinite(v)) {
            allSpeedsRef.current.push(v);
            maybeUpdateBreaks();
          }
        }
        return [...prev, nextPoint];
      });

      indexRef.current = i + 1;
    }, INTERVAL_MS);

    return () => clearInterval(id);
  }, [playbackToken, baseSeries, timesMs, inferredPeriodMs]);

  // hand off to the map; once breaks freeze, colours are stable
  return (
    <LocationMap
      series={locationHistory}
      samplePeriodMs={inferredPeriodMs}
      speedBreaks={effectiveBreaks ?? undefined}
    />
  );
}
