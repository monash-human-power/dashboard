import { useVideoFeedStatus } from 'api/common/camera';
import React from 'react';
import { Badge } from 'react-bootstrap';
import styles from './DASRecording.module.css';

/**
 * Shows the recording status for the cameras
 *
 * @returns Component
 */
export default function DASRecording(): JSX.Element {
    const primary = useVideoFeedStatus('primary')?.online ?? false;
    const secondary = useVideoFeedStatus('secondary')?.online ?? false;

    return (
        <div className=''>
            <span className={styles.label}>DAS Recording:</span>

            <span className={styles.device}>Primary:</span>
            <Badge className={styles.pill} pill variant={primary ? 'success' : 'danger'}>
                {primary ? 'Online' : 'Offline'}
            </Badge>

            <span className={styles.device}>Secondary:</span>
            <Badge className={styles.pill} pill variant={secondary ? 'success' : 'danger'}>
                {secondary ? 'Online' : 'Offline'}
            </Badge>
        </div>
    );
}
