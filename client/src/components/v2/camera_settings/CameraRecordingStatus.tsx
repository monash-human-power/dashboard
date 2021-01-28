import { CameraRecordingStatusItem } from 'api/v2/camera';
import React from 'react';
import styles from './CameraRecordingStatus.module.css';

const defaultStatus = 'Waiting for status...';

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
export default function CameraRecordingStatus(
  { statusFormatted }: CameraRecordingStatusProps
): JSX.Element {
  return (
    <div>
      {statusFormatted ? (
        statusFormatted.map((field) => (
          <div className={styles.statusRow} key={field.name}>
            <span>{`${field.name}`}</span>
            <span className={styles.push}>{field.value}</span>
          </div>
        ))
      ) : (
          <div className={styles.statusRow}>{`Status: ${defaultStatus}`}</div>
        )}
    </div>
  );
}
