import { LatLngTuple } from 'leaflet';
import React, { useMemo } from 'react';
import {
  AttributionControl,
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
  // If points don’t include ts or speed, assume a fixed sample period to estimate speed (e.g. 1000 = 1 Hz)
  samplePeriodMs?: number;
  // Speed breakpoints in km/h, ascending (defines colour bins).
  speedBreaks?: number[]; // default [10, 20, 35]
  // Colours for each bin; length = breaks.length + 1
  speedColors?: string[]; // default ['#d73027','#fc8d59','#91cf60','#4575b4']
}

// Haversine distance in meters
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

// Compute km/h for segment a -> b using (a.speedKmh) or ts/samplePeriodMs fallbacks
function segmentSpeedKmh(
  a: LocationTimeSeriesPoint,
  b: LocationTimeSeriesPoint,
  samplePeriodMs?: number,
): number {
  // If upstream provided speed on point a, use it
  if (Number.isFinite(a.speedKmh as number)) return a.speedKmh as number;

  // If both timestamps are present, use their delta
  if (typeof a.ts === 'number' && typeof b.ts === 'number' && b.ts > a.ts) {
    const mps = haversineMeters(a, b) / ((b.ts - a.ts) / 1000);
    return mps * 3.6;
  }

  // Fallback: assume fixed sampling period
  if (typeof samplePeriodMs === 'number' && samplePeriodMs > 0) {
    const mps = haversineMeters(a, b) / (samplePeriodMs / 1000);
    return mps * 3.6;
  }

  return 0;
}

export default function LocationMap({
  series,
  samplePeriodMs,
  speedBreaks = [10, 20, 35],
  speedColors = ['#d73027', '#fc8d59', '#91cf60', '#4575b4'], // red, orange, green, blue
}: LocationMapProps): JSX.Element {
  const bikeHistory: LatLngTuple[] = series.map(LTSPToTuple);
  const initialLocation: LatLngTuple = bikeHistory[0];
  const currentLocation: LatLngTuple = bikeHistory[bikeHistory.length - 1];

  // Keeps centre constant
  const center: LatLngTuple = LOCATIONS.CASEY_FIELDS;

  //building coloured segments
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
        }

        if (i < 10) console.debug(`seg ${i}: ${vKmh.toFixed(1)} km/h`);
        const color = pickColor(vKmh, speedBreaks, speedColors);
        if (i < 10)
          console.debug(
            `seg ${i} -> color ${color} | breaks=${JSON.stringify(
              speedBreaks,
            )}`,
          );

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
  }, [series, samplePeriodMs, speedBreaks, speedColors]);

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

      {currentLocation ? (
        <CircleMarker
          center={currentLocation}
          radius={7}
          color="white"
          weight={2}
          fillColor="DodgerBlue"
          fillOpacity={1}
        />
      ) : null}

      {initialLocation ? (
        <CircleMarker
          center={initialLocation}
          radius={7}
          color="white"
          weight={2}
          fillColor="#0BDA51"
          fillOpacity={1}
        />
      ) : null}

      {/* draw speed-coloured path */}
      {segments.map((s) => (
        <Polyline
          key={s.key}
          positions={s.coords}
          color={s.color} // <- use top-level props in v2
          weight={3}
          opacity={0.9}
          lineCap="round"
        />
      ))}

      <ScaleControl imperial={false} />
      <AttributionControl prefix={false} />
      <LeafletCenterControl center={center} />
    </Map>
  );
}
