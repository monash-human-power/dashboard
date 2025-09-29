import { LatLngTuple } from 'leaflet';
import React, { useMemo } from 'react';
import {
  AttributionControl,
  Pane,
  CircleMarker,
  Map,
  Polyline,
  ScaleControl,
  TileLayer,
} from 'react-leaflet';

import styles from 'components/common/charts/LocationMap.module.css';
import LeafletCenterControl from 'components/v2/LeafletCenterControl';
import { LTSPToTuple } from 'components/trike/dashboard/AnimatedLocationMap';
import 'leaflet/dist/leaflet.css';

// Contains some common (LatLngTuple) locations
export const LOCATIONS: { [key: string]: LatLngTuple } = {
  MHP_WORKSHOP: [-37.908756, 145.13404],
  CASEY_FIELDS: [-38.126945, 145.314126],
  CALDER_PARK: [-37.671667, 144.755833],
  PACKER_PARK: [-37.901526, 145.058029],
};

export interface LocationTimeSeriesPoint {
  /** GPS latitude */
  lat: number;
  /** GPS longitude */
  long: number;
  /** optional: timestamp (ms since epoch) */
  ts?: number;
  /** optional: instantaneous speed in km/h (if already computed upstream) */
  speedKmh?: number;
}

export interface LocationMapProps {
  /** GPS location time series */
  series: LocationTimeSeriesPoint[];
  /** If points don’t include ts or speed, assume a fixed sample period to estimate speed (e.g. 1000 = 1 Hz) */
  samplePeriodMs?: number;
  /** Optional custom speed breakpoints (km/h), ascending; if omitted we derive from data */
  speedBreaks?: number[];
  /** Colours for each bin; length = breaks.length + 1 */
  speedColors?: string[]; // default ['#d73027','#fc8d59','#91cf60','#4575b4']
}

/** Haversine distance in meters */
function haversineMeters(
  a: LocationTimeSeriesPoint,
  b: LocationTimeSeriesPoint,
): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 6371000;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.long - a.long);
  const s1 = Math.sin(dLat / 2);
  const s2 = Math.sin(dLng / 2);
  const t = s1 * s1 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * s2 * s2;
  return 2 * R * Math.asin(Math.sqrt(t));
}

function pickColor(kmh: number, breaks: number[], colors: string[]): string {
  for (let i = 0; i < breaks.length; i += 1) {
    if (kmh < breaks[i]) return colors[i];
  }
  return colors[colors.length - 1];
}

/** Compute km/h for segment a -> b using (a.speedKmh) or ts/samplePeriodMs fallbacks */
function segmentSpeedKmh(
  a: LocationTimeSeriesPoint,
  b: LocationTimeSeriesPoint,
  samplePeriodMs?: number,
): number {
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
}

/** Robust quantile (q in [0,1]) */
function quantile(sortedAsc: number[], q: number): number {
  if (!sortedAsc.length) return 0;
  const pos = (sortedAsc.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  if (sortedAsc[base + 1] !== undefined) {
    return sortedAsc[base] + rest * (sortedAsc[base + 1] - sortedAsc[base]);
  }
  return sortedAsc[base];
}

/** Derive [P25,P50,P75] from speeds; ensure strictly increasing; fallback if needed */
function deriveBreaksFromSpeeds(speeds: number[]): number[] {
  const clean = speeds.filter((v) => Number.isFinite(v) && v >= 0);
  if (clean.length < 4) return [10, 20, 35]; // not enough data — sensible default

  const s = [...clean].sort((a, b) => a - b);
  let p25 = quantile(s, 0.25);
  let p50 = quantile(s, 0.5);
  let p75 = quantile(s, 0.75);

  // Enforce strictly increasing ordering (avoid all-equal / flat ranges)
  const eps = Math.max(0.1, (s[s.length - 1] - s[0]) * 0.01); // 1% of range or 0.1 km/h
  if (!(p25 < p50)) p50 = p25 + eps;
  if (!(p50 < p75)) p75 = p50 + eps;

  // Clamp to realistic range
  p25 = Math.max(0, p25);
  p50 = Math.max(p25 + eps, p50);
  p75 = Math.max(p50 + eps, p75);

  return [p25, p50, p75];
}

export default function LocationMap({
  series,
  samplePeriodMs,
  speedBreaks, // if provided, we’ll use these; otherwise data-driven
  speedColors = ['#d73027', '#fc8d59', '#91cf60', '#4575b4'], // red, orange, green, blue
}: LocationMapProps): JSX.Element {
  const bikeHistory: LatLngTuple[] = series.map(LTSPToTuple);
  const initialLocation: LatLngTuple | undefined = bikeHistory[0];
  const currentLocation: LatLngTuple | undefined =
    bikeHistory[bikeHistory.length - 1];

  // Keeps centre constant
  const center: LatLngTuple = LOCATIONS.CASEY_FIELDS;

  // 1) Compute all segment speeds once
  const segmentSpeeds = useMemo<number[]>(() => {
    const out: number[] = [];
    for (let i = 0; i < series.length - 1; i += 1) {
      const v = segmentSpeedKmh(series[i], series[i + 1], samplePeriodMs);
      if (Number.isFinite(v)) out.push(v);
    }
    return out;
  }, [series, samplePeriodMs]);

  // 2) Choose breaks: use prop if provided; else derive from data; else fallback default
  const effectiveBreaks = useMemo<number[]>(() => {
    if (Array.isArray(speedBreaks) && speedBreaks.length >= 1) {
      return [...speedBreaks].sort((a, b) => a - b);
    }
    return deriveBreaksFromSpeeds(segmentSpeeds);
  }, [speedBreaks, segmentSpeeds]);

  // 3) Build coloured segments
  const segments = useMemo(() => {
    const segs: { coords: LatLngTuple[]; color: string; key: string }[] = [];
    for (let i = 0; i < series.length - 1; i += 1) {
      const a = series[i];
      const b = series[i + 1];

      const dist = haversineMeters(a, b);
      if (Number.isFinite(dist) && dist >= 0.2) {
        let vKmh = segmentSpeedKmh(a, b, samplePeriodMs);
        if (!Number.isFinite(vKmh)) vKmh = 0;

        if (i < 10) {
          const dtMs =
            typeof a.ts === 'number' && typeof b.ts === 'number'
              ? b.ts - a.ts
              : samplePeriodMs;
          console.debug(
            `seg ${i}: dist=${dist.toFixed(2)}m dt=${dtMs}ms v=${vKmh.toFixed(
              1,
            )}km/h`,
          );
          console.debug(
            `seg ${i} -> color via breaks ${JSON.stringify(effectiveBreaks)}`,
          );
        }

        const color = pickColor(vKmh, effectiveBreaks, speedColors);
        const key = `${a.lat},${a.long}->${b.lat},${b.long}-${i}`;
        segs.push({
          coords: [
            [a.lat, a.long],
            [b.lat, b.long],
          ],
          color,
          key,
        });
      }
    }
    return segs;
  }, [series, samplePeriodMs, effectiveBreaks, speedColors]);

  return (
    <Map
      center={center}
      zoom={16}
      attributionControl={false}
      className={styles.map}
    >
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="http://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}&s=Ga"
      />

      {/* Define panes with explicit z-index */}
      <Pane name="track" style={{ zIndex: 400 }} />
      <Pane name="top" style={{ zIndex: 650 }} />

      {/* draw older segments */}
      {segments.slice(0, -1).map((s) => (
        <Polyline
          key={s.key}
          pane="track"
          positions={s.coords}
          color={s.color}
          weight={3}
          opacity={0.9}
          lineCap="round"
          interactive={false}
        />
      ))}

      {/* draw latest segment on top */}
      {segments.length > 0 && (
        <Polyline
          key={`${segments[segments.length - 1].key}-top`}
          pane="top"
          positions={segments[segments.length - 1].coords}
          color={segments[segments.length - 1].color}
          weight={3}
          opacity={0.95}
          lineCap="round"
          interactive={false}
        />
      )}

      {/* current marker above everything */}
      {currentLocation && (
        <CircleMarker
          pane="top"
          center={currentLocation}
          radius={7}
          color="white"
          weight={2}
          fillColor="DodgerBlue"
          fillOpacity={1}
        />
      )}

      {/* initial marker can stay lower if you want */}
      {initialLocation && (
        <CircleMarker
          pane="track"
          center={initialLocation}
          radius={7}
          color="white"
          weight={2}
          fillColor="#0BDA51"
          fillOpacity={1}
        />
      )}

      <ScaleControl imperial={false} />
      <AttributionControl prefix={false} />
      <LeafletCenterControl center={center} />
    </Map>
  );
}
