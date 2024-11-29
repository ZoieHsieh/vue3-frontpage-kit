import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/Settings.vue'),
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue'),
  },
  {
    path: '/carousel',
    name: 'Carousel',
    component: () => import('../views/CarouselManager.vue'), // 輪播元件頁面
  },
  {
    path: '/productgroup',
    name: 'Productgroup',
    component: () => import('../views/ProductGroup.vue'), // 輪播元件頁面
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
