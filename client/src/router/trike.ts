import React from 'react';
import { RouteInfo } from 'types/route';
import DashboardView from 'views/trike/DashboardView';

import BoostView from 'views/common/BoostView';
import LogsView from 'views/common/LogsView';

const routes: RouteInfo[] = [
  {
    name: 'Dashboard',
    path: '/trike/',
    exact: true,
    component: (DashboardView as unknown) as React.Component,
  },
  {
    name: 'Logs',
    path: '/trike/logs',
    exact: true,
    component: (LogsView as unknown) as React.Component,
  },
  {
    name: 'Boost',
    path: '/trike/boost',
    exact: true,
    component: (BoostView as unknown) as React.Component,
  },
];

export default routes;
