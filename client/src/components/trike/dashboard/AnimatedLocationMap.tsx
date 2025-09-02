import React, { useEffect, useState } from 'react';

import { useChannel } from 'api/common/socket';
import LocationMap, {
  LocationTimeSeriesPoint,
} from 'components/common/charts/LocationMap';
import { LatLngTuple } from 'leaflet';

export const TrikeMapKey = 'trike-dashboard-location-map-chart-data';
export const TrikeZoomKey = 'trike-dashboard-location-map-zoom';

// How frequently locationHistory updates
export const INTERVAL_MS: number = 50;

const caseyData: LatLngTuple[] = require('../CaseyLatLngTuple.json');

// Helper functions to convert between a LatLngTuple and LocationTimeSeriesPoint
export const tupleToLTSP = ([
  lat,
  long,
]: LatLngTuple): LocationTimeSeriesPoint => ({ lat, long });

export const LTSPToTuple = ({
  lat,
  long,
}: LocationTimeSeriesPoint): LatLngTuple => [lat, long];

/**
 * Map showing the location of the bike
 *
 * @property props Props
 * @returns Component
 */
export default function AnimatedLocationMap(): JSX.Element {
  // Retrieves a JSON (as a string) in sessionStorage (stored by MQTT I assume)
  // const storedData: string | null = sessionStorage.getItem(TrikeMapKey);  // <-- from MQTT
  const storedData: LocationTimeSeriesPoint[] = caseyData.map(tupleToLTSP); // <-- from JSON array

  const [currIndex, setCurrIndex] = useState(0);
  const [locationHistory, setStateLocationHistory] = useState<
    LocationTimeSeriesPoint[]
  >([storedData[0]] || []);

  // Updates the sessionStorage with the new locationHistory
  const setLocationHistory = (data: LocationTimeSeriesPoint[]) => {
    sessionStorage.setItem(TrikeMapKey, JSON.stringify(data));
    setStateLocationHistory(data);
  };

  // Reset on start
  const reset = () => setLocationHistory([]);

  // TODO: need to change this reset topic
  useChannel('wireless_module-3-start', reset);

  // Updates locations at a certain interval
  const updateLocationEffect = () => {
    const interval = setInterval(() => {
      if (storedData[currIndex] && currIndex < storedData.length) {
        const location = storedData[currIndex];

        // if (isValidLocation(location)) {
        // }

        // The following should be checked for valid location before...
        setStateLocationHistory([...locationHistory, location]);
        setCurrIndex(currIndex + 1);
      } else {
        clearInterval(interval);
      }
    }, INTERVAL_MS);

    return () => clearInterval(interval); // Cleanup function
  };

  // Call updateLocation when currIndex or storedData updates
  useEffect(updateLocationEffect, [currIndex, storedData]);

  // locationHistory type is <LocationTimeSeriesPoint[]>, NOT <LocationMapProps>
  // return <LocationMap series={locationHistory} />;
  return <LocationMap series={locationHistory} samplePeriodMs={INTERVAL_MS} />;
}
