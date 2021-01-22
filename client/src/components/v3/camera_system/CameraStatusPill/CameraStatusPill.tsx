import { useCameraStatus, CameraDevice } from 'api/v2/camera';
// TODO: convert to v3 api
import React from 'react';
import { Badge } from 'react-bootstrap';



export interface CameraStatusProps {
    /** Specify the camera device */
    device: CameraDevice;
}

/**
 *  Camera status displayed in a bootstrap pill
 *
 * @param props Props
 * @returns Component
 */
export default function CameraStatusPill({ device }: CameraStatusProps) {
    const status = useCameraStatus(device);

    // TODO: How come the status can be null??
    if (status == null) {
        return (<Badge pill variant='danger'> ERROR </Badge>);
    }

    // If not null return the camera connection status
    return (
        <Badge pill variant={status.connected ? 'success' : 'secondary'}>
            {status.connected ? 'Online' : 'Offline'}
        </Badge>
    );
}

