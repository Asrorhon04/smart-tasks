import { route } from 'quasar/wrappers';
import { createRouter, createWebHashHistory } from 'vue-router';
import routes from './routes';
import { auth } from 'src/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default route(function () {
  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createWebHashHistory(),
  });

  let isAuthResolved = false;

  Router.beforeEach(async (to, from, next) => {
    // Подождём auth инициализацию один раз
    if (!isAuthResolved) {
      await new Promise((resolve) => {
        const un = onAuthStateChanged(auth, () => {
          resolve(true);
          un(); // отписка
        });
      });
      isAuthResolved = true;
    }

    const requiresAuth = to.path !== '/login' && to.path !== '/register';
    const isLoggedIn = !!auth.currentUser;

    if (requiresAuth && !isLoggedIn) {
      next('/login');
    } else {
      next();
    }
  });

  return Router;
});
