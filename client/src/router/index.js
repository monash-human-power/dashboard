import DashboardView from 'views/DashboardView';
import DownloadFilesView from 'views/DownloadFilesView';
import SensorStatusView from 'views/SensorStatusView';
import PowerModelView from 'views/PowerModelView';
import PowerMapView from 'views/PowerMapView';
import PowerModelCalibrationView from 'views/PowerModelCalibrationView';
import CameraSettingsView from 'views/CameraSettingsView';
import OptionsView from 'views/OptionsView';

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
