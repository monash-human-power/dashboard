import Vue from 'vue';
import VueRouter from 'vue-router';
import DashboardView from '@/views/DashboardView.vue';
import DownloadFilesView from '@/views/DownloadFilesView.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: DashboardView,
  },
  {
    path: '/download-files',
    name: 'download-files',
    component: DownloadFilesView,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
