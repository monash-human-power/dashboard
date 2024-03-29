import { useRouteMatch } from 'react-router-dom';
import HomeView from 'views/HomeView';
import { RouteInfo } from 'types/route';
import V2Routes from 'router/v2';
import V3Routes from 'router/v3';

export interface VersionInfo {
  /** Bike version friendly name */
  name: string;
  /** Base path for the version */
  rootPath: string;
  /** List of routes under this version */
  routes: RouteInfo[];
  /** Key for React mapping */
  id: number;
}

export const bikeVersions: VersionInfo[] = [
  {
    name: 'Version 2 (Wombat)',
    rootPath: '/v2',
    routes: V2Routes,
    id: 2,
  },
  {
    name: 'Version 3 (Bilby)',
    rootPath: '/v3',
    routes: V3Routes,
    id: 3,
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
    component: (HomeView as unknown) as React.Component,
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
