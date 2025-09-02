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

  /**
   * if points don’t include ts or speed, assume a fixed sample period to estimate speed.
   * e.g 1000 = 1Hz updates.
   */
  samplePeriodMs?: number;

  /**speed breakpoints in km/h, ascending (defines colour bins). */
  speedBreaks?: number[]; // default [10, 20, 35]

  /**colours (CSS hex or names) to use for each bin; length = breaks.length + 1 */
  speedColors?: string[]; // default ['#d73027','#fc8d59','#91cf60','#4575b4']
}

/**haversine distance in meters */
function haversineMeters(
  a: LocationTimeSeriesPoint,
  b: LocationTimeSeriesPoint,
) {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 6371000;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.long - a.long);
  const s1 = Math.sin(dLat / 2);
  const s2 = Math.sin(dLng / 2);
  const t = s1 * s1 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * s2 * s2;
  return 2 * R * Math.asin(Math.sqrt(t));
}

function pickColor(kmh: number, breaks: number[], colors: string[]) {
  for (let i = 0; i < breaks.length; i++) {
    if (kmh < breaks[i]) return colors[i];
  }
  return colors[colors.length - 1];
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
    const segs: { coords: LatLngTuple[]; color: string }[] = [];
    for (let i = 0; i < series.length - 1; i++) {
      const a = series[i];
      const b = series[i + 1];

      // speed preference: given -> timestamp delta -> fixed period
      let vKmh =
        a.speedKmh ??
        (a.ts != null && b.ts != null && b.ts > a.ts
          ? (haversineMeters(a, b) / ((b.ts - a.ts) / 1000)) * 3.6
          : samplePeriodMs
          ? (haversineMeters(a, b) / (samplePeriodMs / 1000)) * 3.6
          : 0);

      //avoid NaN/infinity on bad samples
      if (!Number.isFinite(vKmh)) vKmh = 0;

      const color = pickColor(vKmh, speedBreaks, speedColors);
      segs.push({
        coords: [
          [a.lat, a.long],
          [b.lat, b.long],
        ],
        color,
      });
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
      {segments.map((s, idx) => (
        <Polyline
          key={idx}
          positions={s.coords}
          color={s.color}
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
