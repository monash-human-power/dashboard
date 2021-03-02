import StatisticSpeed from 'components/v3/StatisticSpeed';
import React from 'react';
import { Badge } from 'react-bootstrap';
import { V3SpeedDistanceChart } from '../../components/v3/dashboard/V3SpeedDistanceChart';
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
                    <div className={styles.stat}><StatisticSpeed /></div>
                    <div className={styles.stat}><StatisticSpeed /></div>
                    <div className={styles.stat}><StatisticSpeed /></div>
                    <div className={styles.stat}><StatisticSpeed /></div>
                    <div className={styles.line} />
                    <div className={styles.stat}><StatisticSpeed /></div>
                    <div className={styles.stat}><StatisticSpeed /></div>
                </div>
                <div className={styles.graph}><V3SpeedDistanceChart /></div>
            </div>
            <div className={styles.content}>
                <div><div className={styles.bigGraph}>Big Graph Here</div></div>
            </div>
        </div>
    );
};
