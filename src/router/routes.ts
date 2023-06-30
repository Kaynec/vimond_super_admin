import { useUserStore } from 'src/stores/User';
import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  { path: '/login', component: () => import('pages/Login.vue'), name: 'Login' },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    beforeEnter: (to, from, next) => {
      const store = useUserStore();
      const auth = to.meta['auth'] || false;
      if (!auth) {
        if (!store.isLoggedIn) return next();
        return next({ name: 'MainPage' });
      }
      // page  does require auth
      else if (auth) {
        if (store.isLoggedIn) return next();
        return next({ name: 'Login' });
      }
    },
    children: [
      {
        path: '/dashboard',
        component: () => import('pages/IndexPage.vue'),
        meta: { auth: true },
        name: 'MainPage'
      },
      {
        path: '/users',
        component: () => import('pages/Users.vue'),
        meta: { auth: true },
        name: 'Users'
      },
      {
        path: '/didehban',
        component: () => import('pages/DidehBan.vue'),
        meta: { auth: true },
        name: 'DidehBan'
      },
      {
        path: '/profile',
        component: () => import('pages/Profile.vue'),
        name: 'Profile',
        meta: { auth: true }
      },
      {
        path: '/:id',
        component: () => import('pages/Payment.vue'),
        name: 'Payment',
        meta: { auth: true }
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
];

export default routes;
