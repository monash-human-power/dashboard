import React from 'react';
import { RouteInfo } from 'types/route';
import DashboardView from 'views/trike/DashboardView';

const routes: RouteInfo[] = [
  {
    name: 'Dashboard',
    path: '/trike/',
    exact: true,
    component: (DashboardView as unknown) as React.Component,
  },
];

export default routes;
