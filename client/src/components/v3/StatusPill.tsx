import React from 'react';
import { Badge } from 'react-bootstrap';


interface PillProps {
    /** Specify the camera device */
    connected: Boolean | null;
}


/**
 *  Bootstrap pill used to describe connectivity for a component
 */
export default function CameraStatusPill({ connected }: PillProps) {

    // This is to deal with the situation when the sensors are of type null
    if (connected === null) {
        return (<Badge pill variant='danger'> ERROR </Badge>);
    }

    // If not null return connection status
    return (
        <Badge pill variant={connected ? 'success' : 'secondary'}>
            {connected ? 'Online' : 'Offline'}
        </Badge>
    );
}

