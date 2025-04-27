import { createRouter, createWebHistory } from 'vue-router';
import store from '../store';  // Import your store

import Login from '../components/UserLogin.vue';
import Register from '../components/UserRegister.vue';
import StockList from '../components/StockList.vue';
import BulkStockEntry from '../components/BulkStockEntry.vue';

const routes = [
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { 
    path: '/', 
    component: StockList,
    meta: { requiresAuth: true } 
  },
  { 
    path: '/bulk-entry', 
    component: BulkStockEntry,
    meta: { requiresAuth: true }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard
router.beforeEach((to, from, next) => {
  const isLoggedIn = !!store.state.token || !!localStorage.getItem('auth_token'); // Check token in Vuex or localStorage

  // If the route requires authentication and the user is not logged in, redirect to login page
  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/login');
  } else if (to.path === '/login' && isLoggedIn) {
    // If the user is already logged in and tries to access the login page, redirect to the home page (Stock List)
    next('/');
  } else {
    next();
  }
});

export default router;
