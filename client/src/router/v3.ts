import DashboardView from 'views/v3/DashboardView';
import LogsView from 'views/common/LogsView';
import StatusView from 'views/v3/StatusView';
import BoostView from 'views/common/BoostView';
import CameraSystemView from 'views/v3/CameraSystemView';
import { RouteInfo } from 'router/route';

/**
 * V3 views
 */
export const routes: RouteInfo[] = [
  {
    name: 'Dashboard',
    path: '/v3/',
    exact: true,
    component: DashboardView as unknown as React.Component,
  },
  {
    name: 'Logs',
    path: '/v3/logs',
    exact: true,
    component: LogsView as unknown as React.Component,
  },
  {
    name: 'Status',
    path: '/v3/status',
    exact: true,
    component: StatusView as unknown as React.Component,
  },
  {
    name: 'Boost',
    path: '/v3/boost',
    exact: true,
    component: BoostView as unknown as React.Component,
  },
  {
    name: 'Camera System',
    path: '/v3/camera-system',
    exact: true,
    component: CameraSystemView as unknown as React.Component,
  }
];

