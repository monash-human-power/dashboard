import React from 'react';
import styles from './Statistic.module.css';

export interface StatisticProps {
    /** Value to be shown */
    value: number | null;
    /** Unit of the value */
    unit: string;
    /** Description */
    desc: string;
}

/**
 * Display a value
 *
 * @returns Component
 */
export default function Statistic({ value, unit, desc }: StatisticProps): JSX.Element {
    return (
        <div>
            <span className={styles.value}>{value ?? '—'}</span>
            <span className={styles.unit}>{unit}</span><br />
            <span className={styles.desc}>{desc}</span>
        </div>
    );
}
