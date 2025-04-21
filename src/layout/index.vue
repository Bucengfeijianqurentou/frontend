<template>
  <div class="layout-container">
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="260px" class="sidebar">
        <div class="logo-container">
          <el-icon class="logo-icon"><School /></el-icon>
          <h1 class="title">食堂监管平台</h1>
        </div>
        <div class="user-profile">
          <el-avatar :size="50" :src="userStore.user?.avatar" class="user-avatar">
            {{ userStore.user?.username?.charAt(0)?.toUpperCase() }}
          </el-avatar>
          <div class="user-info">
            <h3 class="user-name">{{ userStore.user?.username || '用户' }}</h3>
            <p class="user-role">{{ userRoleText }}</p>
          </div>
        </div>
        <el-divider class="sidebar-divider">
          <el-icon><Menu /></el-icon>
        </el-divider>
        <el-scrollbar class="menu-scrollbar">
          <el-menu
            :router="true"
            :default-active="route.path"
            class="menu"
            :unique-opened="true"
            :collapse-transition="false"
          >
            <el-menu-item index="/dashboard" class="menu-item">
              <el-icon><HomeFilled /></el-icon>
              <template #title>
                <span>控制台</span>
              </template>
            </el-menu-item>

            <!-- 管理员菜单 -->
            <template v-if="userStore.isAdmin">
              <el-sub-menu index="system-manage" class="menu-item">
                <template #title>
                  <el-icon><Monitor /></el-icon>
                  <span>系统管理</span>
                </template>
                <el-menu-item index="/system">
                  <el-icon><Connection /></el-icon>
                  <span>系统监控</span>
                </el-menu-item>
                <el-menu-item index="/admin/analysis">
                  <el-icon><DataLine /></el-icon>
                  <span>数据分析</span>
                </el-menu-item>
              </el-sub-menu>

              <el-menu-item index="/admin/tracing" class="menu-item">
                <el-icon><Link /></el-icon>
                <template #title>
                  <span>溯源查询</span>
                </template>
              </el-menu-item>

              <el-menu-item index="/suppliers" class="menu-item">
                <el-icon><Connection /></el-icon>
                <template #title>
                  <span>供应商管理</span>
                </template>
              </el-menu-item>

              <el-menu-item index="/admin/distribution" class="menu-item">
                <el-icon><Reading /></el-icon>
                <template #title>
                  <span>年级管理</span>
                </template>
              </el-menu-item>

              <el-menu-item index="/admin/monitoring" class="menu-item">
                  <el-icon><VideoCamera /></el-icon>
                  <template #title>
                    <span>实时监控</span>
                  </template>
                </el-menu-item>

              <el-sub-menu index="user-manage" class="menu-item">
                <template #title>
                  <el-icon><User /></el-icon>
                  <span>用户管理</span>
                </template>
                <el-menu-item index="/admin/users">
                  <el-icon><UserFilled /></el-icon>
                  <span>用户列表</span>
                </el-menu-item>
                <el-menu-item index="/admin/roles">
                  <el-icon><Lock /></el-icon>
                  <span>角色管理</span>
                </el-menu-item>
                <el-menu-item index="/admin/permissions">
                  <el-icon><Lock /></el-icon>
                  <span>权限管理</span>
                </el-menu-item>
              </el-sub-menu>

              <el-menu-item index="/admin/notifications" class="menu-item">
                <el-icon><Bell /></el-icon>
                <template #title>
                  <span>通知管理</span>
                </template>
              </el-menu-item>

              <el-menu-item index="/admin/reports" class="menu-item">
                <el-icon><Document /></el-icon>
                <template #title>
                  <span>报表生成</span>
                </template>
              </el-menu-item>
            </template>

            <!-- 监管方菜单 -->
            <template v-if="userStore.isInspector">
              <el-sub-menu index="inspection-manage" class="menu-item">
                <template #title>
                  <el-icon><Search /></el-icon>
                  <span>监管检查</span>
                </template>
                <el-menu-item index="/inspection">
                  <el-icon><Document /></el-icon>
                  <span>菜单审查</span>
                </el-menu-item>
                <el-menu-item index="/inspection/records">
                  <el-icon><List /></el-icon>
                  <span>审查记录</span>
                </el-menu-item>
              </el-sub-menu>

              <el-menu-item index="/tracing" class="menu-item">
                <el-icon><Link /></el-icon>
                <template #title>
                  <span>溯源查询</span>
                </template>
              </el-menu-item>

              <el-menu-item index="/analysis" class="menu-item">
                <el-icon><DataLine /></el-icon>
                <template #title>
                  <span>数据分析</span>
                </template>
              </el-menu-item>

              <el-menu-item index="/monitoring" class="menu-item">
                  <el-icon><VideoCamera /></el-icon>
                  <template #title>
                    <span>实时监控</span>
                  </template>
                </el-menu-item>

            </template>

            <!-- 食堂工作人员菜单 -->
            <template v-if="userStore.isStaff">
              <el-menu-item index="/purchase/create" class="menu-item">
                <el-icon><ShoppingCart /></el-icon>
                <template #title>
                  <span>食品采购</span>
                </template>
              </el-menu-item>

              <el-menu-item index="/inventory" class="menu-item">
                <el-icon><Goods /></el-icon>
                <template #title>
                  <span>库存管理</span>
                </template>
              </el-menu-item>

              <el-menu-item index="/processing" class="menu-item">
                <el-icon><KnifeFork /></el-icon>
                <template #title>
                  <span>食品加工</span>
                </template>
              </el-menu-item>

              <el-menu-item index="/menu" class="menu-item">
                <el-icon><Memo /></el-icon>
                <template #title>
                  <span>菜单管理</span>
                </template>
              </el-menu-item>

              <el-menu-item index="/distribution" class="menu-item">
                <el-icon><Box /></el-icon>
                <template #title>
                  <span>食品发放</span>
                </template>
              </el-menu-item>
            </template>

            <!-- 共用菜单分隔符 -->
            <el-divider class="menu-divider">个人</el-divider>

            <!-- 所有用户可见的菜单 -->
            <el-menu-item index="/profile" class="menu-item">
              <el-icon><UserFilled /></el-icon>
              <template #title>
                <span>个人信息</span>
              </template>
            </el-menu-item>

            <el-menu-item class="menu-item logout-item" @click="handleLogout">
              <el-icon><SwitchButton /></el-icon>
              <template #title>
                <span>退出登录</span>
              </template>
            </el-menu-item>
          </el-menu>
        </el-scrollbar>
      </el-aside>

      <el-container>
        <!-- 顶部导航 -->
        <el-header class="header">
          <div class="header-left">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item v-if="currentRoute.meta?.title">{{ currentRoute.meta.title }}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <div class="header-right">
            <!-- 搜索框 -->
            <div class="search-box">
              <el-input
                placeholder="搜索..."
                prefix-icon="Search"
                clearable
                size="small"
              />
            </div>
            
            <!-- 快捷操作 -->
            <div class="header-actions">
              <el-tooltip content="全屏" placement="bottom">
                <el-icon class="header-icon"><FullScreen /></el-icon>
              </el-tooltip>
              <el-tooltip content="刷新" placement="bottom">
                <el-icon class="header-icon" @click="refreshPage"><Refresh /></el-icon>
              </el-tooltip>
              <el-badge :value="3" :max="99" class="header-badge">
                <el-icon class="header-icon"><Bell /></el-icon>
              </el-badge>
            </div>

            <!-- 用户菜单 -->
            <el-dropdown @command="handleCommand" trigger="click">
              <div class="user-dropdown">
                <el-avatar :size="32" :src="userStore.user?.avatar" class="dropdown-avatar">
                  {{ userStore.user?.username?.charAt(0)?.toUpperCase() }}
                </el-avatar>
                <span class="dropdown-username">{{ userStore.user?.username }}</span>
                <el-icon><ArrowDown /></el-icon>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="profile">
                    <el-icon><UserFilled /></el-icon>个人信息
                  </el-dropdown-item>
                  <el-dropdown-item command="settings">
                    <el-icon><Setting /></el-icon>系统设置
                  </el-dropdown-item>
                  <el-dropdown-item divided command="logout">
                    <el-icon><SwitchButton /></el-icon>退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>

        <!-- 主内容区 -->
        <el-main class="main-content">
          <router-view v-slot="{ Component }">
            <transition name="page" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </el-main>

        <!-- 页脚 -->
        <el-footer class="footer">
          <div class="footer-content">
            <p>中小学食堂监管平台 &copy; {{ new Date().getFullYear() }} All Rights Reserved</p>
          </div>
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { 
  Monitor, 
  Setting, 
  User, 
  UserFilled, 
  List, 
  Document, 
  HomeFilled,
  Calendar,
  Box,
  School,
  ShoppingCart,
  KnifeFork,
  Memo,
  Connection,
  Search,
  Link,
  DataLine,
  Lock,
  Bell,
  Goods,
  Reading,
  FullScreen,
  Refresh,
  ArrowDown,
  SwitchButton,
  Menu
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const currentRoute = computed(() => {
  return router.currentRoute.value
})

const userRoleText = computed(() => {
  if (userStore.isAdmin) return '系统管理员'
  if (userStore.isInspector) return '监管人员'
  if (userStore.isStaff) return '食堂工作人员'
  return '普通用户'
})

const handleCommand = (command) => {
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'settings':
      // 添加设置页面路由逻辑
      break
    case 'logout':
      handleLogout()
      break
  }
}

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}

const refreshPage = () => {
  window.location.reload()
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 侧边栏样式 */
.sidebar {
  background-color: var(--dark-bg);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1000;
  transition: all 0.3s;
  width: 260px !important;
  display: flex;
  flex-direction: column;
}

.logo-container {
  display: flex;
  align-items: center;
  padding: 1.2rem;
  border-bottom: 1px solid var(--dark-secondary);
  background: linear-gradient(to right, var(--primary-dark), var(--primary-color));
}

.logo-icon {
  font-size: 1.75rem;
  color: white;
  margin-right: 0.75rem;
}

.title {
  font-size: 1.25rem;
  font-weight: bold;
  color: white;
  margin: 0;
  letter-spacing: 0.5px;
}

.user-profile {
  padding: 1.5rem 1.2rem;
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.03);
}

.user-avatar {
  background: linear-gradient(to right, var(--primary-light), var(--info-color));
  border: 2px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.user-info {
  margin-left: 0.75rem;
}

.user-name {
  color: white;
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.user-role {
  color: rgba(255, 255, 255, 0.7);
  margin: 0.25rem 0 0;
  font-size: 0.8rem;
}

.sidebar-divider {
  border-color: var(--dark-tertiary);
  margin: 0.75rem 1rem;
}

.sidebar-divider :deep(.el-divider__text) {
  background-color: var(--dark-bg);
  color: var(--text-light);
  font-size: 0.8rem;
}

.menu-scrollbar {
  height: calc(100vh - 190px);
}

.menu {
  border: 0;
  background-color: transparent;
}

.menu-item {
  margin: 0.25rem 0.5rem;
  border-radius: 6px;
}

.menu-divider {
  margin: 1rem 1.2rem;
  font-size: 0.75rem;
  color: var(--text-tertiary);
  border-color: rgba(255, 255, 255, 0.1);
}

.menu-divider :deep(.el-divider__text) {
  background-color: var(--dark-bg);
  color: var(--text-tertiary);
  font-size: 0.75rem;
  padding: 0 0.5rem;
}

.logout-item {
  margin-top: auto;
  color: var(--danger-color) !important;
}

/* 顶部导航样式 */
.header {
  background-color: white;
  border-bottom: 1px solid var(--light-border);
  box-shadow: var(--shadow-sm);
  padding: 0 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.search-box {
  width: 200px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-icon {
  font-size: 1.25rem;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 6px;
  transition: all 0.2s;
}

.header-icon:hover {
  color: var(--primary-color);
  background-color: var(--primary-bg);
}

.header-badge :deep(.el-badge__content) {
  background-color: var(--danger-color);
}

.user-dropdown {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  transition: all 0.2s;
}

.user-dropdown:hover {
  background-color: var(--light-bg);
}

.dropdown-avatar {
  margin-right: 0.5rem;
  background: linear-gradient(to right, var(--primary-color), var(--primary-light));
}

.dropdown-username {
  color: var(--text-primary);
  font-weight: 500;
  margin-right: 0.25rem;
}

/* 主内容区样式 */
.main-content {
  background-color: var(--light-bg);
  padding: 1.5rem;
  overflow-y: auto;
  height: calc(100vh - 120px);
}

/* 页脚样式 */
.footer {
  background-color: white;
  border-top: 1px solid var(--light-border);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  height: 40px;
}

.footer-content {
  text-align: center;
  color: var(--text-tertiary);
  font-size: 0.85rem;
}

/* 元素样式覆盖 */
:deep(.el-menu-item.is-active) {
  background-color: var(--primary-color);
  color: white !important;
}

:deep(.el-menu-item:hover), :deep(.el-sub-menu__title:hover) {
  background-color: var(--dark-tertiary);
}

:deep(.el-sub-menu.is-active > .el-sub-menu__title) {
  color: white !important;
}

:deep(.el-menu--inline) {
  background-color: var(--dark-secondary);
}

:deep(.el-menu--inline .el-menu-item) {
  margin: 0.25rem 0.5rem;
  border-radius: 6px;
  padding-left: 30px !important;
}

:deep(.el-container) {
  height: 100%;
}

:deep(.el-main) {
  overflow-y: auto;
  flex: 1;
}
</style> 