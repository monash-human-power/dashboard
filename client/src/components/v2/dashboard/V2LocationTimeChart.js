import React from 'react';
import PropTypes from 'prop-types';
import { useSensorData, useMultiSensorTimeSeries } from 'api/v2/sensors';
import LocationTimeChart from 'components/charts/LocationTimeChart';

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
 * @typedef {object} V2LocationTimeChartProps
 * @property {number} interval Time between updates in ms
 */

/**
 * Location chart component
 *
 * @param {V2LocationTimeChartProps} props Props
 * @returns {React.Component} Component
 */
export default function V2LocationTimeChart({ interval }) {
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

  return <LocationTimeChart series={bikeHistory} />;
}

V2LocationTimeChart.propTypes = {
  interval: PropTypes.number.isRequired,
};
