import React, { useState, useEffect } from 'react';
import styles from './LiveDataRow.module.css';
import LiveData from './LiveData';

export default function TrikeStatsRow(): JSX.Element {
  // Elapsed time function
  const [localTime, setLocalTime] = useState(new Date());
  const [elapsedTime, setElapsedTime] = useState(0); // In seconds
  const startTime = new Date(); // Capture the start time

  useEffect(() => {
    const interval = setInterval(() => {
      // Update local time
      const now = localTime;
      setLocalTime(now);

      // Calculate elapsed time (in seconds)
      const elapsed = Math.floor(
        (localTime.getTime() - startTime.getTime()) / 1000,
      ); // in seconds

      setElapsedTime(elapsed);
    }, 1000); // Update every second

    return () => clearInterval(interval); // Clear interval on component unmount
  }, [startTime]);

  return (
    <div>
      {/** LAP DATA */}
      <div>
        <h2 className={styles.subtitle}>Lap Data</h2>
      </div>

      <div className={styles.currentStintContainer}>
        <div className={styles.liveDataItem}>
          <LiveData value="300" unit="km/h" desc="Last Lap Time:" />
        </div>

        <div className={styles.liveDataItem}>
          <LiveData value="300" unit="km/h" desc="Last Lap Avg Speed:" />
        </div>

        <div className={styles.liveDataItem}>
          <LiveData value="300" unit="km/h" desc="Last Lap Avg Watts:" />
        </div>
      </div>

      {/** STINT DATA */}
      <div>
        <h2 className={styles.subtitle}>Stint Data</h2>
      </div>

      <div className={styles.currentStintContainer}>
        <div className={styles.liveDataItem}>
          <LiveData value={elapsedTime} unit="sec" desc="Elapsed Time:" />
        </div>

        <div className={styles.liveDataItem}>
          <LiveData value="vals" unit="km/h" desc="Avg Spd:" />
        </div>

        <div className={styles.liveDataItem}>
          <LiveData value="300" unit="km/h" desc="Distance Covered:" />
        </div>
      </div>

      {/** RACE DETAILS */}
      <div>
        <h2 className={styles.subtitle}>Race Details</h2>
      </div>

      <div className={styles.currentStintContainer}>
        <div className={styles.liveDataItem}>
          <LiveData value="300" unit="km/h" desc="Elapsed Time:" />
        </div>

        <div className={styles.liveDataItem}>
          <LiveData value="300" unit="km/h" desc="Avg Spd:" />
        </div>

        <div className={styles.liveDataItem}>
          <LiveData value="300" unit="km/h" desc="Laps Done:" />
        </div>

        <div className={styles.liveDataItem}>
          <LiveData value="300" unit="km/h" desc="Distance Covered:" />
        </div>
      </div>
    </div>
  );
}
