import { RouteInfo } from 'types/route';

import DashboardView from 'views/T2/DashboardView';
import StatisticsView from 'views/T2/StatisticsView';

import BoostView from 'views/common/BoostView';
import LogsView from 'views/common/LogsView';

const routes: RouteInfo[] = [
  {
    name: 'Dashboard',
    path: '/T2',
    exact: true,
    component: (DashboardView as unknown) as React.Component,
  },
  {
    name: 'Statistics',
    path: '/T2/statistics',
    exact: true,
    component: (StatisticsView as unknown) as React.Component,
  },
  {
    name: 'Logs',
    path: '/T2/logs',
    exact: true,
    component: (LogsView as unknown) as React.Component,
  },
  {
    name: 'Boost',
    path: '/T2/boost',
    exact: true,
    component: (BoostView as unknown) as React.Component,
  },
];

export default routes;
