import { useRouteMatch } from 'react-router-dom';
import HomeView from 'views/HomeView';
import { routes as V2Routes } from './v2';

/**
 * @typedef {object} VersionInfo
 * @property {string} name Bike version friendly name
 * @property {string} rootPath Base path for the version
 * @property {import('./route').RouteInfo[]} routes List of routes under this version
 */

/** @type {VersionInfo[]} */
export const bikeVersions = [
  {
    name: 'Version 2 (Wombat)',
    rootPath: '/v2',
    routes: V2Routes,
  },
  {
    name: 'Version 3 (V3)',
    rootPath: '/v3',
    routes: [],
  },
];

export const routes = [
  {
    name: 'Home',
    path: '/',
    exact: true,
    component: HomeView,
  },
];
bikeVersions.forEach((v) => {
  routes.push(...v.routes);
});

/**
 * Get the route info for the selected bike version
 *
 * @returns {VersionInfo} Bike version route info
 */
export function useBikeVersion() {
  const match = useRouteMatch('/:version');
  const version = match?.params?.version;
  const bikeVersion = bikeVersions.find((v) => v.rootPath === `/${version}`);
  if (bikeVersion) {
    return bikeVersion;
  }
  return null;
}
