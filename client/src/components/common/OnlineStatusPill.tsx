import React from 'react';
import { Badge } from 'react-bootstrap';

export type isOnlineT = boolean | null;

/**
 * @property isOnline Whether the status is on, off or error
 */
export interface OnlineStatusPillProps {
  /** Specify whether the status is on, off or error */
  isOnline: isOnlineT;
}

/**
 * Bootstrap pill used to describe connectivity status for a component
 *
 * @param props Props
 * @returns Component
 */
export default function OnlineStatusPill({ isOnline }: OnlineStatusPillProps) {
  switch (isOnline) {
    case true:
      return (
        <Badge pill variant="success">
          Online
        </Badge>
      );
    case false:
      return (
        <Badge pill variant="secondary">
          Offline
        </Badge>
      );
    case null:
    default:
      return (
        <Badge pill variant="danger">
          ERROR
        </Badge>
      );
  }
}
