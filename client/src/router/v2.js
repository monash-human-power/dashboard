import DashboardView from 'views/v2/DashboardView';
import DownloadFilesView from 'views/v2/DownloadFilesView';
import SensorStatusView from 'views/v2/SensorStatusView';
import PowerModelView from 'views/v2/PowerModelView';
import PowerMapView from 'views/v2/PowerMapView';
import PowerModelCalibrationView from 'views/v2/PowerModelCalibrationView';
import CameraSettingsView from 'views/v2/CameraSettingsView';
import OptionsView from 'views/v2/OptionsView';
import { RouteInfo } from './route';

/** @type {RouteInfo[]} */
export const routes = [
  {
    name: 'Dashboard',
    path: '/v2/',
    exact: true,
    component: DashboardView,
  },
  {
    name: 'Files',
    path: '/v2/download-files',
    exact: true,
    component: DownloadFilesView,
  },
  {
    name: 'Sensors',
    path: '/v2/status',
    exact: true,
    component: SensorStatusView,
  },
  {
    name: 'Power Model',
    path: '/v2/power-model',
    exact: true,
    component: PowerModelView,
  },
  {
    name: 'Power Map',
    path: '/v2/power-zone',
    exact: true,
    component: PowerMapView,
  },
  {
    name: 'Power Model Calibration',
    path: '/v2/power-calibration',
    exact: true,
    component: PowerModelCalibrationView,
  },
  {
    name: 'Camera',
    path: '/v2/camera',
    exact: true,
    component: CameraSettingsView,
  },
  {
    name: 'Options',
    path: '/v2/options',
    exact: true,
    component: OptionsView,
  },
];
