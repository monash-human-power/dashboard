import styles from 'components/common/charts/LocationTimeChart.module.css';
import LeafletCenterControl from 'components/v2/LeafletCenterControl';
import {
  LatLngTuple
} from 'leaflet';
import 'leaflet/dist/leaflet.css';
import PropTypes from 'prop-types';
import React from 'react';
import {
  AttributionControl,
  CircleMarker,
  Map,
  Polyline,
  ScaleControl,
  TileLayer
} from 'react-leaflet';

const MHP_WORKSHOP_LOCATION = [-37.908756, 145.13404];

export interface LocationTimeSeriesPoint {
  /** GPS latitude */
  lat: number
  /** GPS longitude */
  long: number
}

export interface LocationTimeChartProps {
  /** GPS location time series */
  series: LocationTimeSeriesPoint[]
}

/**
 * Location chart component
 *
 * @param props Props
 * @returns Component
 */
export default function LocationTimeChart({ series }: LocationTimeChartProps): JSX.Element {
  const bikeHistory = series.map(({ lat, long }) => [lat, long] as LatLngTuple);

  const initialLocation = bikeHistory[0];
  const currentLocation = bikeHistory[series.length - 1];

  const center = initialLocation ?? MHP_WORKSHOP_LOCATION;

  return (
    <Map
      center={center}
      zoom={17}
      attributionControl={false}
      className={styles.map}
    >
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {currentLocation ? (
        <CircleMarker
          center={currentLocation}
          radius={7}
          color="white"
          weight={2}
          fillColor="#007bff"
          fillOpacity={1}
        />
      ) : null}
      <Polyline positions={bikeHistory} color="#007bff" weight={4} />
      <ScaleControl imperial={false} />
      <AttributionControl prefix={false} />
      <LeafletCenterControl center={center} />
    </Map>
  );
}

LocationTimeChart.propTypes = {
  series: PropTypes.arrayOf(
    PropTypes.shape({
      lat: PropTypes.number.isRequired,
      long: PropTypes.number.isRequired,
    }),
  ).isRequired,
};
