import { V3SpeedDistanceChart } from 'components/v3/dashboard/V3SpeedDistanceChart';
import StatisticRow from 'components/v3/StatisticRow';
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
                <StatisticRow />
                <div className={styles.graph}><V3SpeedDistanceChart /></div>
            </div>
            <div className={styles.content}>
                <div><div className={styles.bigGraph}>Big Graph Here</div></div>
            </div>
        </div>
    );
};
