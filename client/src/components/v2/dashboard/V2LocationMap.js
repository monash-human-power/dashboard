import PropTypes from 'prop-types';
import React from 'react';

import { useMultiSensorTimeSeries, useSensorData } from 'api/v2/sensors';
import LocationMap from 'components/common/charts/LocationMap';

/**
 * Checks if a given location is valid
 *
 * @param {object} location Location to check
 * @returns {?object} LatLng object if location is valid. Null if invalid
 */
function validateLocation(location) {
  if (
    Number.isFinite(location.lat) &&
    location.lat >= -180 &&
    location.lat <= 180 &&
    Number.isFinite(location.long) &&
    location.long >= -180 &&
    location.long <= 180
  ) {
    return location;
  }
  return null;
}

/**
 * @typedef {object} V2LocationMapProps
 * @property {number} interval Time between updates in ms
 */

/**
 * Location chart component
 *
 * @param {V2LocationMapProps} props Props
 * @returns {React.Component} Component
 */
export default function V2LocationMap({ interval }) {
  const { series: locationHistory } = useMultiSensorTimeSeries(
    ['gps_lat', 'gps_long'],
    interval,
  );
  const latData = useSensorData('gps_lat');
  const longData = useSensorData('gps_long');

  const initialLocation = validateLocation({
    lat: latData.initialData,
    long: longData.initialData,
  });
  const currentLocation = validateLocation({
    lat: latData.data,
    long: longData.data,
  });

  const bikeHistory = locationHistory.map((point) => ({
    lat: point.gps_lat.value,
    long: point.gps_long.value,
  }));

  if (initialLocation) {
    bikeHistory.unshift(initialLocation);
  }
  if (currentLocation) {
    bikeHistory.push(currentLocation);
  }

  return <LocationMap series={bikeHistory} />;
}

V2LocationMap.propTypes = {
  interval: PropTypes.number.isRequired,
};
