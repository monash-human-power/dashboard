import { Sensor, useSensorData } from 'api/common/data';
import React, { useEffect, useState } from 'react';
import { HeartRateRT, PowerRT, ReedVelocityRT } from 'types/data';
import Statistic from './Statistic';
import styles from './StatisticRow.module.css';

/**
 * Statistic container using API for various stats.
 *
 * @returns Component
 */
export default function StatisticRow(): JSX.Element {
    // Should only be positive, abs max of currSpeed
    const [maxSpeed, setMaxSpeed] = useState<number | null>(null);

    // TODO: Multiple sensor data
    const currSpeed = useSensorData(3, Sensor.ReedVelocity, ReedVelocityRT);

    // Update max speed whenever the speed is updated
    useEffect(() => {
        // Add new data point
        if (currSpeed) setMaxSpeed(Math.max(currSpeed, Math.abs(maxSpeed ?? 0)));
        // Omit maxSpeed to avoid infinite render loop
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currSpeed]);

    // TODO: Trap locations
    // eslint-disable-next-line no-unused-vars
    const [prevTrapSpeed, setPrevTrapSpeed] = useState(null);

    // TODO: Predicted trap speed
    // eslint-disable-next-line no-unused-vars
    const [nextTrapSpeed, setNextTrapSpeed] = useState(null);

    const power = useSensorData(4, Sensor.Power, PowerRT);

    const heartRate = useSensorData(4, Sensor.HeartRate, HeartRateRT);

    return (
        <div className={styles.statContainer}>
            <div className={styles.statSpeed}>
                <Statistic value={currSpeed} unit="km/h" desc="Current speed" />
            </div>
            <div className={styles.statSpeed}>
                <Statistic value={maxSpeed} unit="km/h" desc="Max. speed" />
            </div>
            <div className={styles.statSpeed}>
                <Statistic
                    value={prevTrapSpeed}
                    unit="km/h"
                    desc="Prev. trap speed (archived"
                />
            </div>
            <div className={styles.statSpeed}>
                <Statistic
                    value={nextTrapSpeed}
                    unit="km/h"
                    desc="Next trap speed (predicted)"
                />
            </div>
            <div className={styles.line} />
            <div className={styles.statPower}>
                <Statistic
                    value={power ? Math.round(power) : null}
                    unit="W"
                    desc="Power"
                />
            </div>
            <div className={styles.statHeartRate}>
                <Statistic
                    value={heartRate ? Math.round(heartRate) : null}
                    unit="bpm"
                    desc="Heart rate"
                />
            </div>
        </div>
    );
}
