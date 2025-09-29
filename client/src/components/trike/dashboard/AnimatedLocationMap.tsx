import React, { useEffect, useRef, useState, useMemo } from 'react';

import { useChannel } from 'api/common/socket';
import LocationMap, {
  LocationTimeSeriesPoint,
} from 'components/common/charts/LocationMap';
import { LatLngTuple } from 'leaflet';

export const TrikeMapKey = 'trike-dashboard-location-map-chart-data';
export const TrikeZoomKey = 'trike-dashboard-location-map-zoom';

// How frequently locationHistory updates

export const INTERVAL_MS = 50;
// const DATA_SAMPLE_MS = 1000;
// const caseyData: LatLngTuple[] = require('../CaseyLatLngTuple.json');

const rawLatLng: any[] = require('../CaseyLatLngTuple.json');

let rawTimes: any[] | null = null;
try {
  rawTimes = require('../CaseyTimes.json'); // [["1"],["2"],...]
} catch {
  // optional file; ignore if missing
}

// Helpers and normalisers
const toNum = (v: any): number => {
  if (Array.isArray(v)) return Number(v[0]);
  return Number(v);
};

const normaliseLatLng = (raw: any[]): [number, number][] =>
  raw.map((pair: any) => [toNum(pair[0]), toNum(pair[1])] as [number, number]);

const normaliseTimesMs = (raw: any[] | null | undefined): number[] | null => {
  if (!raw) return null;
  // CaseyTimes values are seconds; convert to ms
  return raw.map((v: any) => Math.round(toNum(v) * 1000));
};

const median = (xs: number[]) => {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
};

const medianDiff = (ts: number[]) => {
  const diffs: number[] = [];
  for (let i = 1; i < ts.length; i += 1) {
    const d = ts[i] - ts[i - 1];
    if (Number.isFinite(d) && d > 0) diffs.push(d);
  }
  return median(diffs);
};

// Tuple <-> LTSP exports
// (LocationMap imports LTSPToTuple)
export const tupleToLTSP = ([
  lat,
  long,
]: LatLngTuple): LocationTimeSeriesPoint => ({ lat, long });
export const LTSPToTuple = ({
  lat,
  long,
}: LocationTimeSeriesPoint): LatLngTuple => [lat, long];

/**
 * Map showing the location of the bike
 *
 * @property props Props
 * @returns Component
 */
export default function AnimatedLocationMap({
  // Caller can override the fallback if the dataset cadence is known
  assumedPeriodMs = 1000,
}: { assumedPeriodMs?: number } = {}): JSX.Element {
  // Normalise raw inputs to numbers
  const latLng = useMemo<[number, number][]>(
    () => normaliseLatLng(rawLatLng),
    [],
  );
  const timesMs = useMemo<number[] | null>(
    () => normaliseTimesMs(rawTimes),
    [],
  );

  // Build base series from LatLng
  const baseSeries = useMemo<LocationTimeSeriesPoint[]>(
    () => latLng.map(([lat, long]) => ({ lat, long })),
    [latLng],
  );

  // Infer a period ONLY if we don't have usable per-point timestamps
  const inferredPeriodMs = useMemo<number>(() => {
    if (timesMs && timesMs.length > 1)
      return medianDiff(timesMs) || assumedPeriodMs;
    return assumedPeriodMs;
  }, [timesMs, assumedPeriodMs]);

  // Seed with first point (attach its ts if present)
  const [locationHistory, setLocationHistory] = useState<
    LocationTimeSeriesPoint[]
  >(() => {
    if (!baseSeries.length) return [];
    const first = { ...baseSeries[0] };
    if (timesMs?.length) first.ts = timesMs[0];
    return [first];
  });

  // Playback index that doesn't re-render
  const indexRef = useRef<number>(1);
  // Bump to restart playback (eg, on external reset)
  const [playbackToken, setPlaybackToken] = useState(0);

  // External reset (MQTT/socket)
  const reset = () => {
    indexRef.current = 1;
    if (baseSeries.length) {
      const first = { ...baseSeries[0] };
      if (timesMs?.length) first.ts = timesMs[0];
      setLocationHistory([first]);
    } else {
      setLocationHistory([]);
    }
    setPlaybackToken((t) => t + 1);
  };
  useChannel('wireless_module-3-start', reset);

  // Drive the animation: advance one data point every INTERVAL_MS
  // Physics timing comes from data (timesMs) or synthesised using inferredPeriodMs
  useEffect(() => {
    if (!baseSeries.length) return () => {}; // no-op cleanup (satisfies consistent-return)

    indexRef.current = 1;

    // If we need to synthesise timestamps, anchor to now
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
          ? timesMs[i] // real timing from data
          : synthStart + i * Math.max(1, inferredPeriodMs); // synthesised timing

      setLocationHistory((prev) => [...prev, { ...base, ts }]);
      indexRef.current = i + 1;
    }, INTERVAL_MS);

    return () => clearInterval(id);
  }, [playbackToken, baseSeries, timesMs, inferredPeriodMs]);

  // locationHistory type is <LocationTimeSeriesPoint[]>, NOT <LocationMapProps>
  // return <LocationMap series={locationHistory} />;
  // Pass inferredPeriodMs as a fallback; it is ignored when ts is present
  return (
    <LocationMap series={locationHistory} samplePeriodMs={inferredPeriodMs} />
  );
}
