import React from 'react';
import Statistic from './Statistic';
import styles from './StatisticRow.module.css';

/**
 * Statistic container using API for various stats.
 *
 * @returns Component
 */
export default function StatisticRow(): JSX.Element {
    const { value } = { value: 501 };

    return (
        <div className={styles.statContainer}>
            <div className={styles.stat}>
                <Statistic value={value} unit="km/h" desc="Current speed" />
            </div>
            <div className={styles.stat}>
                <Statistic value={value} unit="km/h" desc="Current speed" />
            </div>
            <div className={styles.stat}>
                <Statistic value={value} unit="km/h" desc="Current speed" />
            </div>
            <div className={styles.stat}>
                <Statistic value={value} unit="km/h" desc="Current speed" />
            </div>
            <div className={styles.line} />
            <div className={styles.stat}>
                <Statistic value={value} unit="km/h" desc="Current speed" />
            </div>
            <div className={styles.stat}>
                <Statistic value={value} unit="km/h" desc="Current speed" />
            </div>
        </div>
    );
}
