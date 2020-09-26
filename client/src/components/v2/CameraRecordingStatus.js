import { useCameraRecordingStatus } from 'api/v2/camera';
import PropTypes from 'prop-types';
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
export default function CameraRecordingStatus({ device }) {
  const payload = useCameraRecordingStatus(device);

  console.log(`recording status: ${payload}`);

  return (
    <div>
      {payload ? (
        Object.keys(payload).map((field) => (
          <div className={styles.statusRow} key={field}>
            <span>{`${field}:`}</span>
            <span className={styles.push}>{payload[field]}</span>
          </div>
        ))
      ) : (
        <div className={styles.p}>{`Status: ${defaultStatus}`}</div>
      )}
    </div>
  );
}

CameraRecordingStatus.propTypes = {
  device: PropTypes.string.isRequired,
};
