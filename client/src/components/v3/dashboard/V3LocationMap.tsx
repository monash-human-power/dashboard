import React, { useEffect, useState } from 'react';

import { Sensor, useSensorData } from 'api/common/data';
import { useChannel } from 'api/common/socket';
import LocationMap, {
  LocationTimeSeriesPoint,
} from 'components/common/charts/LocationMap';
import { GPSRT } from 'types/data';

export const V3MapKey = 'v3-dashboard-location-map-chart-data';
export const V3MapZoomKey = 'v3-dashboard-location-map-zoom';

/**
 * Checks if a given location is valid
 *
 * @param location Location to check
 * @returns True if is valid, otherwise False
 */
function isValidLocation(location: LocationTimeSeriesPoint): boolean {
  return (
    Number.isFinite(location.lat) &&
    location.lat >= -90 &&
    location.lat <= 90 &&
    Number.isFinite(location.long) &&
    location.long >= -90 &&
    location.long <= 90
  );
}

/**
 * Map showing the location of the bike
 *
 * @property props Props
 * @returns Component
 */
export default function V3LocationMap(): JSX.Element {
  const storedData = sessionStorage.getItem(V3MapKey);

  const [locationHistory, setStateLocationHistory] = useState<
    LocationTimeSeriesPoint[]
  >(storedData ? JSON.parse(storedData) : []);

  // Reset on start
  const reset = () => setStateLocationHistory([]);
  useChannel('start', reset);

  const setLocationHistory = (data: LocationTimeSeriesPoint[]) => {
    sessionStorage.setItem(V3MapKey, JSON.stringify(data));
    setStateLocationHistory(data);
  };

  // Extract location info from GPS
  const GPS = useSensorData(3, Sensor.GPS, GPSRT);

  useEffect(() => {
    if (GPS) {
      const location = { lat: GPS.latitude, long: GPS.longitude };
      if (isValidLocation(location))
        setLocationHistory([...locationHistory, location]);
    }
    // Omit locationHistory to prevent infinite render loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [GPS]);

  return <LocationMap series={locationHistory} />;
}
