import BoostView from 'views/common/BoostView';
import LogsView from 'views/common/LogsView';
import CameraSystemView from 'views/common/CameraSystemView';
import DashboardView from 'views/v4/DashboardView';
import StatusView from 'views/v4/StatusView';
import { RouteInfo } from 'types/route';

/**
 * V4 views
 */
const routes: RouteInfo[] = [
  {
    name: 'Dashboard',
    path: '/v4/',
    exact: true,
    component: (DashboardView as unknown) as React.Component,
  },
  {
    name: 'Logs',
    path: '/v4/logs',
    exact: true,
    component: (LogsView as unknown) as React.Component,
  },
  {
    name: 'Status',
    path: '/v4/status',
    exact: true,
    component: (StatusView as unknown) as React.Component,
  },
  {
    name: 'Boost',
    path: '/v4/boost',
    exact: true,
    component: (BoostView as unknown) as React.Component,
  },
  {
    name: 'Camera System',
    path: '/v4/camera-system',
    exact: true,
    component: (CameraSystemView as unknown) as React.Component,
  },
];

export default routes;
