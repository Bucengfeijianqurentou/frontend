import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { getToken } from '@/utils/auth'
import { ElMessage } from 'element-plus'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/common/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/common/Register.vue'),
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
      // 个人信息路由
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/common/profile.vue'),
        meta: { requiresAuth: true }
      },
      // 管理员路由
      {
        path: 'system',
        name: 'System',
        component: () => import('@/views/admin/system.vue'),
        meta: { requiresAuth: true, role: 'ADMIN' }
      },
      {
        path: 'admin/analysis',
        name: 'AdminAnalysis',
        component: () => import('@/views/admin/analysis.vue'),
        meta: { requiresAuth: true, role: 'ADMIN' }
      },
      {
        path: 'admin/tracing',
        name: 'AdminTracing',
        component: () => import('@/views/tracing.vue'),
        meta: { requiresAuth: true, role: 'ADMIN' }
      },
      {
        path: 'admin/users',
        name: 'Users',
        component: () => import('@/views/admin/users.vue'),
        meta: { requiresAuth: true, role: 'ADMIN' }
      },
      {
        path: 'suppliers',
        name: 'Suppliers',
        component: () => import('@/views/admin/suppliers.vue'),
        meta: { requiresAuth: true, role: 'ADMIN' }
      },
      {
        path: 'admin/roles',
        name: 'Roles',
        component: () => import('@/views/admin/roles.vue'),
        meta: { requiresAuth: true, role: 'ADMIN' }
      },
      {
        path: 'admin/permissions',
        name: 'Permissions',
        component: () => import('@/views/admin/permissions.vue'),
        meta: { requiresAuth: true, role: 'ADMIN' }
      },
      {
        path: 'admin/notifications',
        name: 'Notifications',
        component: () => import('@/views/admin/notifications.vue'),
        meta: { requiresAuth: true, role: 'ADMIN' }
      },
      {
        path: 'admin/reports',
        name: 'Reports',
        component: () => import('@/views/admin/reports.vue'),
        meta: { requiresAuth: true, role: 'ADMIN' }
      },
      {
        path: 'admin/distribution',
        name: 'AdminDistribution',
        component: () => import('@/views/admin/distribution.vue'),
        meta: { requiresAuth: true, role: 'ADMIN' }
      },
      // 实时监控路由 - 管理员可访问
      {
        path: 'admin/monitoring',
        name: 'AdminMonitoring',
        component: () => import('@/views/monitoring/index.vue'),
        meta: { requiresAuth: true, role: 'ADMIN' }
      },
      // 监管方路由
      {
        path: 'inspection',
        name: 'Inspection',
        component: () => import('@/views/inspection/inspection.vue'),
        meta: { requiresAuth: true, role: 'INSPECTOR' }
      },
      {
        path: 'inspection/records',
        name: 'InspectionRecords',
        component: () => import('@/views/inspection/records.vue'),
        meta: { requiresAuth: true, role: 'INSPECTOR' }
      },
      {
        path: 'tracing',
        name: 'Tracing',
        component: () => import('@/views/tracing.vue'),
        meta: { requiresAuth: true, role: 'INSPECTOR' }
      },
      {
        path: 'analysis',
        name: 'Analysis',
        component: () => import('@/views/admin/analysis.vue'),
        meta: { requiresAuth: true, role: 'INSPECTOR' }
      },
      // 实时监控路由 - 监管方可访问
      {
        path: 'monitoring',
        name: 'Monitoring',
        component: () => import('@/views/monitoring/index.vue'),
        meta: { requiresAuth: true, role: 'INSPECTOR' }
      },
      // 食堂工作人员路由
      {
        path: 'purchase/create',
        name: 'PurchaseCreate',
        component: () => import('@/views/purchase/create.vue'),
        meta: { requiresAuth: true, role: 'STAFF' }
      },
      
      {
        path: 'processing',
        name: 'Processing',
        component: () => import('@/views/processing/processing.vue'),
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
        path: 'menu/recommend',
        name: 'MenuRecommend',
        component: () => import('@/views/menu/recommend.vue'),
        meta: { requiresAuth: true, role: 'STAFF', title: '智能菜单推荐' }
      },
      {
        path: 'inventory',
        name: 'Inventory',
        component: () => import('@/views/inventory/index.vue'),
        meta: { requiresAuth: true, role: 'STAFF' }
      },
      {
        path: 'feedback',
        name: 'CanteenFeedback',
        component: () => import('@/views/feedback/index.vue'),
        meta: { requiresAuth: true, role: 'STAFF' }
      },
      // 数据大屏路由
      {
        path: 'datascreen',
        name: 'DataScreen',
        component: () => import('@/views/datascreen/index.vue'),
        meta: { requiresAuth: true }
      },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 全局路由守卫
router.beforeEach(async (to, from, next) => {
  const token = getToken()
  const userStore = useUserStore()

  if (to.meta.requiresAuth) {
    if (!token) {
      next({ name: 'Login' })
    } else {
      try {
        // 如果没有用户信息，先获取用户信息
        if (!userStore.user) {
          await userStore.getUserInfoAction()
        }
        
        // 检查角色权限
        if (to.meta.role && !userStore.hasRole(to.meta.role)) {
          ElMessage.warning('您没有访问该页面的权限')
          next({ name: 'Dashboard' })
          return
        }
        next()
      } catch (error) {
        userStore.logout()
        next({ name: 'Login' })
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