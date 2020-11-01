import React from 'react';
import styles from './CameraRecordingStatus.module.css';

const defaultStatus = 'Waiting for status...';

/**
 * @typedef {object} CameraRecordingStatusProps
 * @property {'primary'|'secondary'} device Camera screen
 */

/**
 *  Status of a camera
 *
 * @param {CameraRecordingStatusProps} props Props
 * @returns {React.Component<CameraRecordingStatusProps>} Component
 */
export default function CameraRecordingStatus({ statusFormatted }) {
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
