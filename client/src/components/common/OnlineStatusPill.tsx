import React from 'react';
import { Badge } from 'react-bootstrap';


/**
 * @property {boolean | null} isOnline Whether the status is on, off or error
 */
export interface OnlineStatusPillProps {
    /** Specify whether the status is on, off or error */
    isOnline: boolean | null;
}


/**
 * Bootstrap pill used to describe connectivity status for a component
 * @param props Props
 * @returns Component
 */
export default function OnlineStatusPill({ isOnline }: OnlineStatusPillProps) {

    // This is to deal with the situation when the sensors are of type null
    if (isOnline === null) {
        return (<Badge pill variant='danger'> ERROR </Badge>);
    }

    // If not null return connection status
    return (
        <Badge pill variant={isOnline ? 'success' : 'secondary'}>
            {isOnline ? 'Online' : 'Offline'}
        </Badge>
    );
}