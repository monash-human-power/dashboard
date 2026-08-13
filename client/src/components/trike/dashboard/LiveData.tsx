import React from 'react';
import styles from 'components/trike/dashboard/LiveData.module.css';

export interface LiveDataProps {
  /** Value to be shown */
  value: number | string | null;
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

export default function LiveData({
  value,
  unit,
  desc,
}: LiveDataProps): JSX.Element {
  return (
    <>
      <span className={styles.desc}>{desc}</span>
      <div className={styles.top}>
        <span className={styles.value}>{value ?? '-'}</span>
        <span className={styles.unit}>{unit}</span>
      </div>
    </>
  );
}
