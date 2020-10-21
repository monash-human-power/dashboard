import CameraSettingsView from 'views/v2/CameraSettingsView';
import DashboardView from 'views/v2/DashboardView';
import DownloadFilesView from 'views/v2/DownloadFilesView';
import OptionsView from 'views/v2/OptionsView';
import PowerMapView from 'views/v2/PowerMapView';
import PowerModelCalibrationView from 'views/v2/PowerModelCalibrationView';
import PowerModelView from 'views/v2/PowerModelView';
import SensorStatusView from 'views/v2/SensorStatusView';
import { RouteInfo } from './route';

/**
 * Component type is force casted to React.Component.
 *
 * V2 views will have to be converted to ts otherwise.
 */
export const routes: RouteInfo[] = [
  {
    name: 'Dashboard',
    path: '/v2/',
    exact: true,
    component: DashboardView as unknown as React.Component,
  },
  {
    name: 'Files',
    path: '/v2/download-files',
    exact: true,
    component: DownloadFilesView as unknown as React.Component,
  },
  {
    name: 'Sensors',
    path: '/v2/status',
    exact: true,
    component: SensorStatusView as unknown as React.Component,
  },
  {
    name: 'Power Model',
    path: '/v2/power-model',
    exact: true,
    component: PowerModelView as unknown as React.Component,
  },
  {
    name: 'Power Map',
    path: '/v2/power-zone',
    exact: true,
    component: PowerMapView as unknown as React.Component,
  },
  {
    name: 'Power Model Calibration',
    path: '/v2/power-calibration',
    exact: true,
    component: PowerModelCalibrationView as unknown as React.Component,
  },
  {
    name: 'Camera',
    path: '/v2/camera',
    exact: true,
    component: CameraSettingsView as unknown as React.Component,
  },
  {
    name: 'Options',
    path: '/v2/options',
    exact: true,
    component: OptionsView as unknown as React.Component,
  },
];
