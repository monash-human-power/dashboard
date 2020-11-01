import React from 'react';
import styles from './CameraRecordingStatus.module.css';

const defaultStatus = 'Waiting for status...';

// ! Remove this after merge and import from camera
interface CameraRecordingStatusItem {
  /** Display name of the status item e.g. "Disk Space Remaining" */
  name: string;
  /** Value of the status item e.g. "1.2 GiB" */
  value: string;
}

export interface CameraRecordingStatusProps {
  /** Status payload formatted to be human readable */
  statusFormatted: CameraRecordingStatusItem[] | null
}

/**
 *  Status of a camera
 *
 * @param props Props
 * @returns Component
 */
export default function CameraRecordingStatus({ statusFormatted }: CameraRecordingStatusProps) {
  return (
    <div>
      {statusFormatted ? (
        statusFormatted.map((field) => (
          <div className={styles.statusRow} key={field.name}>
            <span>{`${field.name}:`}</span>
            <span className={styles.push}>{field.value}</span>
          </div>
        ))
      ) : (
        <div className={styles.p}>{`Status: ${defaultStatus}`}</div>
      )}
    </div>
  );
}
