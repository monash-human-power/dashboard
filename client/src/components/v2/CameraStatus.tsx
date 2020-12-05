import { getPrettyDeviceName, useCameraStatus } from 'api/v2/camera';
import PropTypes from 'prop-types';
import React from 'react';
import { Badge } from 'react-bootstrap';
import { Device } from '../../types/camera';

export interface CameraStatusProps {
    /** Device name */
    device: Device
}

/**
 * Camera recording buttons for starting and stopping video recording.
 *
 * Starts/stops recording for both displays.
 *
 * This is a feature intended for V3 but is currently in V2 for testing.
 *
 * @param props Props
 * @returns Component
 */
export default function CameraStatus({ device }: CameraStatusProps) {
    const status = useCameraStatus(device);

    return (
        <>
            <Badge pill variant={status ? 'success' : 'danger'}>
                {status ? 'Connected' : 'Disconnected'}
            </Badge><br/>
            <span>
                {`${getPrettyDeviceName(device)} Camera`}
            </span>
        </>
    );
}

CameraStatus.propTypes = {
    device: PropTypes.string.isRequired,
};
