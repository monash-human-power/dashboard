import { useRouteMatch } from 'react-router-dom';
import HomeView from 'views/HomeView';
import { routes as V2Routes } from './v2';

const versionRoutes = {
  v2: V2Routes,
};

export const routes = [
  {
    name: 'Home',
    path: '/',
    exact: true,
    component: HomeView,
  },
  ...V2Routes,
];

/**
 * Get the list of routes for the selected bike version
 *
 * @returns {import('./route').RouteInfo[]} Route list
 */
export function useVersionRoutes() {
  const match = useRouteMatch('/:version');
  const version = match?.params?.version;
  if (version && versionRoutes[version]) {
    return versionRoutes[version];
  }
  return [];
}
