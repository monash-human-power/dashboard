import DashboardView from 'views/v2/DashboardView';
import DownloadFilesView from 'views/v2/DownloadFilesView';
import SensorStatusView from 'views/v2/SensorStatusView';
import PowerModelView from 'views/v2/PowerModelView';
import PowerMapView from 'views/v2/PowerMapView';
import PowerModelCalibrationView from 'views/v2/PowerModelCalibrationView';
import CameraSettingsView from 'views/v2/CameraSettingsView';
import OptionsView from 'views/v2/OptionsView';

export const routes = [
  {
    name: 'Dashboard',
    path: '/',
    exact: true,
    component: DashboardView,
  },
  {
    name: 'Files',
    path: '/download-files',
    exact: true,
    component: DownloadFilesView,
  },
  {
    name: 'Sensors',
    path: '/status',
    exact: true,
    component: SensorStatusView,
  },
  {
    name: 'Power Model',
    path: '/power-model',
    exact: true,
    component: PowerModelView,
  },
  {
    name: 'Power Map',
    path: '/power-zone',
    exact: true,
    component: PowerMapView,
  },
  {
    name: 'Power Model Calibration',
    path: '/power-calibration',
    exact: true,
    component: PowerModelCalibrationView,
  },
  {
    name: 'Camera',
    path: '/camera',
    exact: true,
    component: CameraSettingsView,
  },
  {
    name: 'Options',
    path: '/options',
    exact: true,
    component: OptionsView,
  },
];
