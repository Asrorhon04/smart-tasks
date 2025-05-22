import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  // Без layout (гостевые страницы)
  {
    path: '/login',
    component: () => import('pages/AuthLoginPage.vue'),
  },
  {
    path: '/register',
    component: () => import('pages/AuthRegisterPage.vue'),
  },
  // С layout
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', redirect: '/tasks' },
      { path: 'tasks', component: () => import('pages/TasksPage.vue') },
      { path: 'profile', component: () => import('pages/ProfilePage.vue') },
      { path: 'home', component: () => import('pages/HomePage.vue') }
    ]
  },
  // Ошибка 404
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  }
];

export default routes;
