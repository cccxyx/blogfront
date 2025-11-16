import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/Register',
      name: 'Register',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path:'/Home/:username',
      name:'Home',
      meta: {  requiresAuth: true},
      props: true,
      component: () => import('../views/Home.vue'),
    },
    {
      path:'/Article/:id',
      name:'Article',
      component: () => import('../views/Article.vue'),
      props: true,
    },
    {
      path: '/edit/:id', 
      name: 'EditArticle',
      component: () => import('../views/Edit.vue'),
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path:'/Write',
      name:'Write',
      component: () => import('../views/Write.vue'),
    }
  ],
})

export default router
