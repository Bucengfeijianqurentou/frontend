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
      },
      // 食堂工作人员路由
      {
        path: 'purchase/create',
        name: 'PurchaseCreate',
        component: () => import('@/views/purchase/create.vue'),
        meta: { requiresAuth: true, role: 'STAFF' }
      },
      {
        path: 'purchase/list',
        name: 'PurchaseList',
        component: () => import('@/views/purchase/list.vue'),
        meta: { requiresAuth: true, role: 'STAFF' }
      },
      {
        path: 'processing',
        name: 'Processing',
        component: () => import('@/views/processing.vue'),
        meta: { requiresAuth: true, role: 'STAFF' }
      },
      {
        path: 'distribution',
        name: 'Distribution',
        component: () => import('@/views/distribution.vue'),
        meta: { requiresAuth: true, role: 'STAFF' }
      },
      {
        path: 'menu',
        name: 'Menu',
        component: () => import('@/views/menu.vue'),
        meta: { requiresAuth: true, role: 'STAFF' }
      },
      {
        path: 'suppliers',
        name: 'Suppliers',
        component: () => import('@/views/suppliers.vue'),
        meta: { requiresAuth: true, role: 'STAFF' }
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
          // 检查角色权限
          if (to.meta.role && !userStore.hasRole(to.meta.role)) {
            next({ name: 'Dashboard' })
          } else {
            next()
          }
        }).catch(() => {
          userStore.logout()
          next({ name: 'Login' })
        })
      } else {
        // 检查角色权限
        if (to.meta.role && !userStore.hasRole(to.meta.role)) {
          next({ name: 'Dashboard' })
        } else {
          next()
        }
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