import SystemStatusView from 'views/v3/SystemStatusView';
import { RouteInfo } from './route';

/**
 * V3 routes to each page
 */
export const routes: RouteInfo[] = [
    {
        name: 'System Status',
        path: '/v3/system-status',
        exact: true,
        component: SystemStatusView as unknown as React.Component,
    },
];
