import React from 'react';
import { Badge } from 'react-bootstrap';


/**
 * @property {boolean | null} isConnected Whether the status is on, off or error
 */
export interface PillProps {
    /** Specify whether the status is on, off or error */
    isConnected: boolean | null;
}


/**
 * Bootstrap pill used to describe connectivity status for a component
 * @param props Props
 * @returns Component
 */
export default function CameraStatusPill({ isConnected }: PillProps) {

    // This is to deal with the situation when the sensors are of type null
    if (isConnected === null) {
        return (<Badge pill variant='danger'> ERROR </Badge>);
    }

    // If not null return connection status
    return (
        <Badge pill variant={isConnected ? 'success' : 'secondary'}>
            {isConnected ? 'Online' : 'Offline'}
        </Badge>
    );
}