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
import {
  useData,
  useInitialSensorData,
  useMultiSensorTimeSeries,
} from 'api/v2/sensors';
import styles from './LocationTimeChart.module.css';

const MHP_WORKSHOP_LOCATION = [-37.908756, 145.13404];

/**
 * Checks if a given location is valid
 *
 * @param {number[]} location Location to check
 * @returns {?Array.<number>} LatLng array if location is valid. Null if invalid
 */
function validateLocation(location) {
  if (location[0] && location[1]) {
    return location;
  }
  return null;
}

/**
 * @typedef {object} LocationTimeChartProps
 * @property {number} interval Time between updates in ms
 */

/**
 * Location chart component
 *
 * @param {LocationTimeChartProps} props Props
 * @returns {React.Component} Component
 */
export default function LocationTimeChart({ interval }) {
  const data = useData();
  const { series: locationHistory } = useMultiSensorTimeSeries(['gps_lat', 'gps_long'], interval);

  const initialLocation = validateLocation([
    useInitialSensorData('gps_lat'),
    useInitialSensorData('gps_long'),
  ]);
  const currentLocation = validateLocation([
    data?.['gps_lat'],
    data?.['gps_long'],
  ]);

  const bikeHistory = locationHistory.map((time) => ([
    time.gps_lat.value,
    time.gps_long.value,
  ]));
  if (currentLocation) {
    bikeHistory.push(currentLocation);
  }

  return (
    <Map
      center={initialLocation ?? MHP_WORKSHOP_LOCATION}
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
      <Polyline
        positions={bikeHistory}
        color="#007bff"
        weight={4}
      />
      <ScaleControl imperial={false} />
      <AttributionControl prefix={false} />
    </Map>
  );
}

LocationTimeChart.propTypes = {
  interval: PropTypes.number.isRequired,
};