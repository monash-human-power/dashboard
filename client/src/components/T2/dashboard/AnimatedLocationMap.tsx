import React, { useState, useCallback } from 'react';
import { useChannel } from 'api/common/socket';
import LocationMap, {
  LocationTimeSeriesPoint,
} from 'components/common/charts/LocationMap';

interface TelemetryPayload {
  type: string;
  timestamp: string;
  sessionId: string;
  data: {
    speed: { value: number; unit: string };
    gps: {
      latitude: number;
      longitude: number;
      altitude: number;
      speed: number;
    };
  };
}

export default function AnimatedLocationMap(): JSX.Element {
  const [locationHistory, setLocationHistory] = useState<
    LocationTimeSeriesPoint[]
  >([]);

  const handleMessage = useCallback((payload: string | TelemetryPayload) => {
    const parsed: TelemetryPayload =
      typeof payload === 'string' ? JSON.parse(payload) : payload;

    const point: LocationTimeSeriesPoint = {
      lat: parsed.data.gps.latitude,
      long: parsed.data.gps.longitude,
      ts: new Date(parsed.timestamp).getTime(),
      speedKmh: parsed.data.speed.value,
    };

    setLocationHistory((prev) => [...prev, point]);
  }, []);

  useChannel('t2-telemetry', handleMessage);

  return (
    <LocationMap
      series={locationHistory}
      binCount={7}
      showLegend
      showDirectionCues
      arrowEvery={10}
    />
  );
}
