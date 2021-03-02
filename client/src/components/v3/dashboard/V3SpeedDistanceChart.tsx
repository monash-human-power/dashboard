import { Sensor, useSensorData } from 'api/common/data';
import SpeedDistanceChart from 'components/common/charts/SpeedDistanceChart';
import React, { useEffect, useState } from 'react';
import { ChartPoint } from 'types/chart';
import { ReedDistanceRT, ReedVelocityRT } from 'types/data';



/**
 * Passes V3 data to the speed distance chart component
 *
 * @returns Component
 */
export function V3SpeedDistanceChart() {
    // Used to store the data points
    const [data, setData] = useState<ChartPoint[]>([]);

    // Speed
    const point = useSensorData(3, Sensor.ReedVelocity, ReedVelocityRT);
    const distance = useSensorData(3, Sensor.ReedDistance, ReedDistanceRT);

    // Update data whenever the point is updated
    useEffect(() => {
        // Add new data point
        if (
            point && distance  // Non null
            // New distance measurement
            && distance !== data[data.length - 1]?.y
        ) setData([...data, { x: distance, y: point }]);
    }, [data, point, distance]);

    return (<SpeedDistanceChart
        // Maximum of data set
        max={data.reduce((acc, { y }) => Math.max(acc, y), -1)}
        data={data} />);
}
