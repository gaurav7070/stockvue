import { createRouter, createWebHistory } from 'vue-router';
import store from '../store'; 
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

router.beforeEach((to, from, next) => {
  const isLoggedIn = !!store.state.token || !!localStorage.getItem('auth_token'); 

  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/login');
  } else if (to.path === '/login' && isLoggedIn) {
    next('/');
  } else {
    next();
  }
});

export default router;
