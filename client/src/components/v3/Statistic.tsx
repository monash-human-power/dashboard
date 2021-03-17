import styles from 'components/v3/Statistic.module.css';
import React from 'react';

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
export default function Statistic({
  value,
  unit,
  desc,
}: StatisticProps): JSX.Element {
  return (
    <>
      <div className={styles.top}>
        <span className={styles.value}>{value ?? '—'}</span>
        <span className={styles.unit}>{unit}</span>
      </div>
      <span className={styles.desc}>{desc}</span>
    </>
  );
}
