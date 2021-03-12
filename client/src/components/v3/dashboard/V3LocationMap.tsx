import { Sensor, useSensorData } from 'api/common/data';
import LocationMap, {
  LocationTimeSeriesPoint,
} from 'components/common/charts/LocationMap';
import React, { useEffect, useState } from 'react';
import { GPSRT } from 'types/data';

/**
 * Checks if a given location is valid
 *
 * @param location Location to check
 * @returns True if is valid, otherwise False
 */
function isValidLocation(location: LocationTimeSeriesPoint): boolean {
  return (
    Number.isFinite(location.lat) &&
    location.lat >= -180 &&
    location.lat <= 180 &&
    Number.isFinite(location.long) &&
    location.long >= -180 &&
    location.long <= 180
  );
}

/**
 * Map showing the location of the bike
 *
 * @property props Props
 * @returns Component
 */
export default function V3LocationMap(): JSX.Element {
  const [locationHistory, setLocationHistory] = useState<
    LocationTimeSeriesPoint[]
  >([]);

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