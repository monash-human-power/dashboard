import React from 'react';
import { Badge } from 'react-bootstrap';
// TODO: implement with real api


/**
 *  Wireless module status displayed in a bootstrap pill
 */
export default function CameraStatusPill() {
    const connected = null;

    if (connected === null) {
        return (
            <Badge pill variant='danger'>
                NOT IMPLEMENTED
            </Badge>
        );
    }

    return (
        <Badge pill variant={connected ? 'success' : 'secondary'}>
            {connected ? 'Online' : 'Offline'}
        </Badge>
    );
}

