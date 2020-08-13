import React from 'react';
import PropTypes from 'prop-types';
import {
  AttributionControl,
  CircleMarker,
  Map,
  Polyline,
  ScaleControl,
  TileLayer,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import LeafletCenterControl from 'components/LeafletCenterControl';
import styles from './LocationTimeChart.module.css';

const MHP_WORKSHOP_LOCATION = [-37.908756, 145.13404];

/**
 * @typedef {object} LocationTimeSeriesPoint
 * @property {number} lat   GPS latitude
 * @property {number} long  GPS longitude
 */

/**
 * @typedef {object} LocationTimeChartProps
 * @property {LocationTimeSeriesPoint[]} series GPS location time series
 */

/**
 * Location chart component
 *
 * @param {LocationTimeChartProps} props Props
 * @returns {React.Component} Component
 */
export default function LocationTimeChart({ series }) {
  const bikeHistory = series.map(({ lat, long }) => [lat, long]);

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
