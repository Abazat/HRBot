import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      redirect: '/dashboard'
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Login.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('../views/Dashboard.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/bots',
      name: 'Bots',
      component: () => import('../views/Bots.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/bots/create',
      name: 'CreateBot',
      component: () => import('../views/CreateBot.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/bots/:id/edit',
      name: 'EditBot',
      component: () => import('../views/EditBot.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/bots/:id/questions',
      name: 'BotQuestions',
      component: () => import('../views/BotQuestions.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('../views/Profile.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router