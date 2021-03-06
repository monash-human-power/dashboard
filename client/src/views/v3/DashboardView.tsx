import V3LocationMap from 'components/v3/dashboard/V3LocationMap';
import { V3SpeedDistanceChart } from 'components/v3/dashboard/V3SpeedDistanceChart';
import React from 'react';
import { Badge } from 'react-bootstrap';
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
                <div>
                    <span>DAS recording</span>
                    <Badge pill variant='danger'>
                        501
                    </Badge>
                </div>
                <div className={styles.statContainer}>
                    <div className={styles.stat}>Stat</div>
                    <div className={styles.stat}>Stat</div>
                    <div className={styles.stat}>Stat</div>
                    <div className={styles.stat}>Stat</div>
                    <div className={styles.line} />
                    <div className={styles.stat}>Stat</div>
                    <div className={styles.stat}>Stat</div>
                </div>
                <div className={styles.graph}><V3SpeedDistanceChart /></div>
            </div>
            <div className={styles.content}>
                <div className={styles.bigGraph}><V3LocationMap /></div>
            </div>
        </div>
    );
};
