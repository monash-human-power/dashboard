import { useRouteMatch } from 'react-router-dom';
import HomeView from 'views/HomeView';
import { RouteInfo } from './route';
import { routes as V2Routes } from './v2';
import { routes as V3Routes } from './v3';

export interface VersionInfo {
  /** Bike version friendly name */
  name: string,
  /** Base path for the version */
  rootPath: string,
  /** List of routes under this version */
  routes: RouteInfo[]
}

export const bikeVersions: VersionInfo[] = [
  {
    name: 'Version 2 (Wombat)',
    rootPath: '/v2',
    routes: V2Routes,
  },
  {
    name: 'Version 3 (V3)',
    rootPath: '/v3',
    routes: V3Routes,
  },
];

/**
 * Component type is force casted to React.Component.
 *
 * V2 views will have to be converted to ts otherwise.
 */
export const routes: RouteInfo[] = [
  {
    name: 'Home',
    path: '/',
    exact: true,
    component: HomeView as unknown as React.Component,
  },
];

bikeVersions.forEach((v) => {
  routes.push(...v.routes);
});

/**
 * Get the route info for the selected bike version
 *
 * @returns Bike version route info
 */
export function useBikeVersion(): VersionInfo | null {
  const match = useRouteMatch<{ version: string }>('/:version');
  const version = match?.params?.version;
  const bikeVersion = bikeVersions.find((v) => v.rootPath === `/${version}`);
  if (bikeVersion) {
    return bikeVersion;
  }
  return null;
}
