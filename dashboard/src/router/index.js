import Vue from 'vue';
import VueRouter from 'vue-router';
import DashboardView from '@/views/DashboardView.vue';
import DownloadFiles from '@/views/DownloadFiles.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'dashboard-view',
    component: DashboardView,
  },
  {
    path: '/download-files',
    name: 'download-files',
    component: DownloadFiles,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
