import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useChannel } from 'api/common/socket';
import LocationMap, {
  LocationTimeSeriesPoint,
} from 'components/common/charts/LocationMap';
import { LatLngTuple } from 'leaflet';
export const LTSPToTuple = ({
  lat,
  long,
}: LocationTimeSeriesPoint): [number, number] => [lat, long];
export const tupleToLTSP = ([lat, long]: [number, number]) => ({ lat, long });

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

export default function AnimatedLocationMap({
  assumedPeriodMs = 1000,
}: { assumedPeriodMs?: number } = {}): JSX.Element {
  const BIN_COUNT = 7; // set 6 if you want 6 colour bins

  const latLng = useMemo(() => normaliseLatLng(rawLatLng), []);
  const timesMs = useMemo(() => normaliseTimesMs(rawTimes), []);

  const baseSeries = useMemo<LocationTimeSeriesPoint[]>(
    () => latLng.map(([lat, long]) => ({ lat, long })),
    [latLng],
  );

  const inferredPeriodMs = useMemo<number>(() => {
    if (timesMs && timesMs.length > 1)
      return medianDiff(timesMs) || assumedPeriodMs;
    return assumedPeriodMs;
  }, [timesMs, assumedPeriodMs]);

  const [locationHistory, setLocationHistory] = useState<
    LocationTimeSeriesPoint[]
  >(() => (baseSeries.length ? [{ ...baseSeries[0], ts: timesMs?.[0] }] : []));

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

      setLocationHistory((prev) => [...prev, { ...base, ts }]);
      indexRef.current = i + 1;
    }, INTERVAL_MS);

    return () => clearInterval(id);
  }, [playbackToken, baseSeries, timesMs, inferredPeriodMs]);

  return (
    <LocationMap
      series={locationHistory}
      samplePeriodMs={inferredPeriodMs}
      binCount={BIN_COUNT}
      showLegend
      showDirectionCues
      arrowEvery={60}
    />
  );
}
