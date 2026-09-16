import LocationMap, {
  LocationTimeSeriesPoint,
} from 'components/common/charts/LocationMap';
import React from 'react';

export default function AnimatedLocationMap(): JSX.Element {
  const t1: LocationTimeSeriesPoint[] = [
    { lat: 1, long: 1, ts: 1, speedKmh: 1 },
  ];
  return (
    <LocationMap
      series={t1}
      samplePeriodMs={1}
      binCount={7}
      showLegend
      showDirectionCues
      arrowEvery={60}
    />
  );
}
