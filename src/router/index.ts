import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import { ElMessage } from 'element-plus';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('../views/Login.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/Register.vue'),
    },
    {
      path: '/home/:username',
      name: 'home',
      meta: { requiresAuth: true },
      props: true,
      component: () => import('../views/Home.vue'),
    },
    {
      path: '/article/:id',
      name: 'article',
      component: () => import('../views/Article.vue'),
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/edit/:id',
      name: 'edit',
      component: () => import('../views/Edit.vue'),
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/write',
      name: 'write',
      meta: { requiresAuth: true },
      component: () => import('../views/Write.vue'),
    }
  ],
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !token) {
    ElMessage.warning('请先登录才能访问此页面');
    next({ name: 'login' });
  } else if ((to.name === 'login' || to.name === 'register') && token) {
    ElMessage.info('您已登录，无需重复操作');
    next({ name: 'home', params: { username: localStorage.getItem('username') || 'User' } });
  }
  else {
    next();
  }
});

export default router
