import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { getToken } from '@/utils/auth'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/layout/index.vue'),
    redirect: '/dashboard',
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: { requiresAuth: true }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 全局路由守卫
router.beforeEach((to, from, next) => {
  const token = getToken()
  const userStore = useUserStore()

  if (to.meta.requiresAuth) {
    if (!token) {
      next({ name: 'Login' })
    } else {
      if (!userStore.user) {
        // 如果store中没有用户信息，尝试获取
        userStore.getUserInfoAction().then(() => {
          next()
        }).catch(() => {
          userStore.logout()
          next({ name: 'Login' })
        })
      } else {
        next()
      }
    }
  } else {
    if (token && (to.name === 'Login' || to.name === 'Register')) {
      next({ name: 'Dashboard' })
    } else {
      next()
    }
  }
})

export default router 