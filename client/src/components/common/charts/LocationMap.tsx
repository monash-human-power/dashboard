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

// Common (LatLngTuple) locations
export const LOCATIONS: { [key: string]: LatLngTuple } = {
  MHP_WORKSHOP: [-37.908756, 145.13404],
  CASEY_FIELDS: [-38.126945, 145.314126],
  CALDER_PARK: [-37.671667, 144.755833],
  PACKER_PARK: [-37.901526, 145.058029],
};

export interface LocationTimeSeriesPoint {
  lat: number;
  long: number;
  ts?: number;
  speedKmh?: number;
}

export interface LocationMapProps {
  series: LocationTimeSeriesPoint[];
  samplePeriodMs?: number;
  speedBreaks?: number[];
  speedColors?: string[];
  binCount?: number; // total colour bins (default 7)
  showLegend?: boolean;
  showDirectionCues?: boolean;
  arrowEvery?: number;
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

/** Segment speed (km/h), using speedKmh or ts/samplePeriodMs fallbacks */
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

/** Simple quantile helper */
function quantile(sortedAsc: number[], p: number): number {
  if (!sortedAsc.length) return 0;
  const pos = (sortedAsc.length - 1) * p;
  const base = Math.floor(pos);
  const rest = pos - base;
  return sortedAsc[base + 1] !== undefined
    ? sortedAsc[base] + rest * (sortedAsc[base + 1] - sortedAsc[base])
    : sortedAsc[base];
}

/**
 * Equal-width breaks:
 *  - Always dedicate a stop bin (<= zeroThreshold)
 *  - Compute trimmed moving range [P5..P95]
 *  - Split that range into equal-width bins
 *  - Enforce a minimum width per band (minWidth)
 */
function deriveEqualWidthBreaks(
  speeds: number[],
  binCount: number,
  zeroThreshold = 1, // 0–1 km/h is "stopped"
  trimLo = 0.05,
  trimHi = 0.95,
  minWidth = 2, // km/h
): number[] {
  const clean = speeds.filter((v) => Number.isFinite(v) && v >= 0);
  if (!clean.length) return [];

  const hasZeroBin = clean.some((v) => v <= zeroThreshold);
  const moving = clean.filter((v) => v > zeroThreshold).sort((a, b) => a - b);
  if (!moving.length) return [zeroThreshold];

  const movingBins = hasZeroBin ? binCount - 1 : binCount;
  const cutsNeeded = Math.max(0, movingBins - 1);

  // Trim range to reduce outlier impact
  const loQ = quantile(moving, trimLo);
  const hiQ = quantile(moving, trimHi);

  const lo = Math.max(zeroThreshold, loQ);
  const hi = Math.max(lo + minWidth * movingBins, hiQ); // ensure enough span

  const width = Math.max(minWidth, (hi - lo) / movingBins);

  const cuts: number[] = [];
  for (let i = 1; i <= cutsNeeded; i += 1) {
    cuts.push(lo + i * width);
  }

  return hasZeroBin ? [zeroThreshold, ...cuts] : cuts;
}

/** Red→green palette (7). Sliced to needed length. */
const RED_TO_GREEN_7 = [
  '#7f0000',
  '#b30000',
  '#d7301f',
  '#ef6548',
  '#fdbb84',
  '#a1d99b',
  '#31a354',
];

// const RED_TO_GREEN_7 = ['#940404', '#e04010', '#e88d15', '#d6c313', '#72bf0d', '#16b8d9', '#1644d9'];

/** Degrees-per-meter helper for arrow heads */
function metersToDegrees(
  latDeg: number,
  metersX: number,
  metersY: number,
): [number, number] {
  const latRad = (latDeg * Math.PI) / 180;
  const metersPerDegLat = 111320;
  const metersPerDegLng = 111320 * Math.cos(latRad);
  return [metersY / metersPerDegLat, metersX / metersPerDegLng];
}

/** Tiny chevron arrow at end of segment a->b */
function buildArrowChevrons(
  a: LocationTimeSeriesPoint,
  b: LocationTimeSeriesPoint,
  sizeMeters = 10,
): LatLngTuple[][] {
  const dLat = b.lat - a.lat;
  const dLng = b.long - a.long;
  const segLen = Math.hypot(dLat, dLng);
  if (segLen === 0) return [];

  const [dLatSize, dLngSize] = metersToDegrees(b.lat, sizeMeters, sizeMeters);
  const ux = dLng / segLen;
  const uy = dLat / segLen;

  const cosT = Math.cos((30 * Math.PI) / 180);
  const sinT = Math.sin((30 * Math.PI) / 180);
  const rot = (
    x: number,
    y: number,
    c: number,
    s: number,
  ): [number, number] => [x * c - y * s, x * s + y * c];

  const dir: [number, number] = [ux * dLngSize, uy * dLatSize];
  const [rx1, ry1] = rot(dir[0], dir[1], cosT, sinT);
  const [rx2, ry2] = rot(dir[0], dir[1], cosT, -sinT);

  const tip: LatLngTuple = [b.lat, b.long];
  const wing1: LatLngTuple = [b.lat - ry1, b.long - rx1];
  const wing2: LatLngTuple = [b.lat - ry2, b.long - rx2];

  return [
    [tip, wing1],
    [tip, wing2],
  ];
}

export default function LocationMap({
  series,
  samplePeriodMs,
  speedBreaks,
  speedColors,
  binCount = 7,
  showLegend = true,
  showDirectionCues = true,
  arrowEvery = 60,
}: LocationMapProps): JSX.Element {
  const bikeHistory: LatLngTuple[] = series.map(LTSPToTuple);
  const initialLocation = bikeHistory[0];
  const currentLocation = bikeHistory[bikeHistory.length - 1];

  const center: LatLngTuple = LOCATIONS.CASEY_FIELDS;

  // 1) Segment speeds
  const segmentSpeeds = useMemo<number[]>(() => {
    const out: number[] = [];
    for (let i = 0; i < series.length - 1; i += 1) {
      const v = segmentSpeedKmh(series[i], series[i + 1], samplePeriodMs);
      if (Number.isFinite(v)) out.push(v);
    }
    return out;
  }, [series, samplePeriodMs]);

  // 2) Breaks
  const effectiveBreaks = useMemo<number[]>(() => {
    if (Array.isArray(speedBreaks) && speedBreaks.length >= 1) {
      return [...speedBreaks].sort((a, b) => a - b);
    }
    return deriveEqualWidthBreaks(segmentSpeeds, binCount);
  }, [speedBreaks, segmentSpeeds, binCount]);

  // 3) Colors
  const effectiveColors = useMemo<string[]>(() => {
    const need = effectiveBreaks.length + 1;
    if (Array.isArray(speedColors) && speedColors.length >= need) {
      return speedColors.slice(0, need);
    }
    if (need <= RED_TO_GREEN_7.length) return RED_TO_GREEN_7.slice(0, need);
    return [
      ...RED_TO_GREEN_7,
      ...Array(need - RED_TO_GREEN_7.length).fill(
        RED_TO_GREEN_7[RED_TO_GREEN_7.length - 1],
      ),
    ];
  }, [speedColors, effectiveBreaks.length]);

  // 4) Segments & arrows
  const { segments, arrows } = useMemo(() => {
    const segs: { coords: LatLngTuple[]; color: string; key: string }[] = [];
    const arrs: { coords: LatLngTuple[]; color: string; key: string }[] = [];

    for (let i = 0; i < series.length - 1; i += 1) {
      const a = series[i];
      const b = series[i + 1];

      const dist = haversineMeters(a, b);
      if (Number.isFinite(dist) && dist >= 0.2) {
        let vKmh = segmentSpeedKmh(a, b, samplePeriodMs);
        if (!Number.isFinite(vKmh)) vKmh = 0;

        const color = pickColor(vKmh, effectiveBreaks, effectiveColors);
        const key = `${a.lat},${a.long}->${b.lat},${b.long}-${i}`;

        segs.push({
          coords: [
            [a.lat, a.long],
            [b.lat, b.long],
          ],
          color,
          key,
        });

        if (showDirectionCues && i % arrowEvery === 0) {
          const chevrons = buildArrowChevrons(a, b, 10);
          chevrons.forEach((coords, k) => {
            arrs.push({ coords, color, key: `${key}-arrow-${k}` });
          });
        }
      }
    }
    return { segments: segs, arrows: arrs };
  }, [
    series,
    samplePeriodMs,
    effectiveBreaks,
    effectiveColors,
    showDirectionCues,
    arrowEvery,
  ]);

  // 5) Legend labels (deduped)
  const legendBands = useMemo(() => {
    if (!segmentSpeeds.length) return [];
    const min = Math.min(...segmentSpeeds);
    const cuts = effectiveBreaks;

    const raw: { color: string; text: string }[] = [];
    raw.push({
      color: effectiveColors[0],
      text: `${min.toFixed(0)}–${cuts[0].toFixed(0)} km/h`,
    });
    for (let i = 1; i < cuts.length; i += 1) {
      raw.push({
        color: effectiveColors[i],
        text: `${cuts[i - 1].toFixed(0)}–${cuts[i].toFixed(0)} km/h`,
      });
    }
    raw.push({
      color: effectiveColors[effectiveColors.length - 1],
      text: `${cuts[cuts.length - 1].toFixed(0)}+ km/h`,
    });

    const deduped: { color: string; text: string }[] = [];
    for (const item of raw) {
      if (!deduped.length || deduped[deduped.length - 1].text !== item.text)
        deduped.push(item);
    }
    return deduped;
  }, [effectiveBreaks, effectiveColors, segmentSpeeds]);

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

      <Pane name="track" style={{ zIndex: 400 }} />
      <Pane name="arrows" style={{ zIndex: 625 }} />
      <Pane name="top" style={{ zIndex: 650 }} />

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

      {showDirectionCues &&
        arrows.map((a) => (
          <Polyline
            key={a.key}
            pane="arrows"
            positions={a.coords}
            color={a.color}
            weight={2}
            opacity={0.9}
            lineCap="round"
            interactive={false}
          />
        ))}

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

      {showLegend && legendBands.length > 0 && (
        <div
          style={{
            position: 'absolute',
            right: 10,
            top: 10,
            background: 'rgba(30,30,30,0.75)',
            color: 'white',
            padding: '8px 10px',
            borderRadius: 8,
            fontSize: 12,
            lineHeight: 1.2,
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
            backdropFilter: 'blur(2px)',
            zIndex: 1000,
            pointerEvents: 'none',
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Speed</div>
          {legendBands.map((b) => (
            <div
              key={b.text}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                margin: '3px 0',
              }}
            >
              <span
                style={{
                  width: 16,
                  height: 8,
                  borderRadius: 2,
                  display: 'inline-block',
                  background: b.color,
                }}
              />
              <span>{b.text}</span>
            </div>
          ))}
        </div>
      )}

      <ScaleControl imperial={false} />
      <AttributionControl prefix={false} />
      <LeafletCenterControl center={center} />
    </Map>
  );
}
