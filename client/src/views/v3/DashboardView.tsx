import React from 'react';

import V3LocationMap from 'components/v3/dashboard/V3LocationMap';
import { V3SpeedDistanceChart } from 'components/v3/dashboard/V3SpeedDistanceChart';
import DASRecording from 'components/v3/DASRecording';
import StatisticRow from 'components/v3/StatisticRow';

import styles from './DashboardView.module.css';

/**
 * Dashboard View component
 *
 * @returns Component
 */
export default function DashboardView(): JSX.Element {
  return (
    <div className={styles.contentContainer}>
      <div className={styles.content}>
        <DASRecording />
        <StatisticRow />
        <div className={styles.graph}>
          <V3SpeedDistanceChart />
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.bigGraph}>
          <V3LocationMap />
        </div>
      </div>
    </div>
  );
}
