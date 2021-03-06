import DASRecording from 'components/v3/DASRecording';
import StatisticRow from 'components/v3/StatisticRow';
import React from 'react';
import styles from './DashboardView.module.css';

/**
 * Dashboard View component
 *
 * @returns Component
 */
export default function DashboardView(): JSX.Element {
    return (
        <div className={styles.contentContainer}>
            <div className={styles.content} >
                <DASRecording />
                <StatisticRow />
                <div><div className={styles.graph}>Graph Here</div></div>
            </div>
            <div className={styles.content}>
                <div><div className={styles.bigGraph}>Big Graph Here</div></div>
            </div>
        </div>
    );
};
