import React from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import { roundNum } from 'utils/data';
import { useLapContext, LapStat } from './LapContext';
import LiveData from './LiveData';
import styles from './LapAnalyticsCard.module.css';
import rowStyles from './LiveDataRow.module.css';

/**
 * Renders a row of LiveData items for a single lap's metrics.
 */
function LapMetrics({
  avgSpeed,
  maxSpeed,
  avgPower,
  maxPower,
  durationSec,
}: Omit<LapStat, 'startTime' | 'endTime'>) {
  return (
    <div className={rowStyles.currentStintContainer}>
      <div className={rowStyles.liveDataItem}>
        <LiveData value={roundNum(avgSpeed, 2)} unit="km/h" desc="Avg Speed:" />
      </div>
      <div className={rowStyles.liveDataItem}>
        <LiveData value={roundNum(maxSpeed, 2)} unit="km/h" desc="Max Speed:" />
      </div>
      <div className={rowStyles.liveDataItem}>
        <LiveData value={roundNum(avgPower, 1)} unit="W" desc="Avg Power:" />
      </div>
      <div className={rowStyles.liveDataItem}>
        <LiveData value={roundNum(maxPower, 1)} unit="W" desc="Max Power:" />
      </div>
      <div className={rowStyles.liveDataItem}>
        <LiveData value={roundNum(durationSec, 1)} unit="s" desc="Duration:" />
      </div>
    </div>
  );
}

/**
 * A tabbed card that shows per-lap analytics.
 * One tab per completed lap, plus a "Current" tab showing live stats
 * for the in-progress lap.
 */
export default function LapAnalyticsCard(): JSX.Element {
  const { lapStats, currentLapAccumulator } = useLapContext();

  const currentAvgSpeed =
    currentLapAccumulator.count > 0
      ? currentLapAccumulator.sumSpeed / currentLapAccumulator.count
      : 0;
  const currentAvgPower =
    currentLapAccumulator.count > 0
      ? currentLapAccumulator.sumPower / currentLapAccumulator.count
      : 0;
  const currentDuration =
    currentLapAccumulator.lastTime - currentLapAccumulator.startTime;

  return (
    <div>
      <h2 className={rowStyles.subtitle}>Lap Analytics</h2>
      <div className={styles.cardContainer}>
        <Tabs
          defaultActiveKey="current"
          id="lap-analytics-tabs"
          className={styles.tabs}
        >
          {lapStats.map((stat, i) => (
            <Tab eventKey={`lap-${i}`} title={`Lap ${i + 1}`} key={`lap-${i}`}>
              <LapMetrics
                avgSpeed={stat.avgSpeed}
                maxSpeed={stat.maxSpeed}
                avgPower={stat.avgPower}
                maxPower={stat.maxPower}
                durationSec={stat.durationSec}
              />
            </Tab>
          ))}
          <Tab eventKey="current" title="Current">
            <LapMetrics
              avgSpeed={currentAvgSpeed}
              maxSpeed={currentLapAccumulator.maxSpeed}
              avgPower={currentAvgPower}
              maxPower={currentLapAccumulator.maxPower}
              durationSec={currentDuration}
            />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
