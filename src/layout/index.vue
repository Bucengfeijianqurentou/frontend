<template>
  <div class="layout-container">
    <el-container>
      <el-aside width="200px">
        <div class="logo-container">
          <el-icon class="logo-icon"><School /></el-icon>
          <h1 class="title">食堂监管平台</h1>
        </div>
        <el-menu
          :router="true"
          :default-active="route.path"
          class="menu"
        >
          <el-menu-item index="/dashboard">
            <el-icon><Monitor /></el-icon>
            <span>控制台</span>
          </el-menu-item>

          <!-- 管理员菜单 -->
          <template v-if="userStore.isAdmin">
            <el-sub-menu index="system">
              <template #title>
                <el-icon><Setting /></el-icon>
                <span>系统管理</span>
              </template>
              <el-menu-item index="/system/users">
                <el-icon><User /></el-icon>
                <span>用户管理</span>
              </el-menu-item>
              <el-menu-item index="/system/roles">
                <el-icon><UserFilled /></el-icon>
                <span>角色管理</span>
              </el-menu-item>
            </el-sub-menu>
          </template>

          <!-- 监管人员菜单 -->
          <template v-if="userStore.isInspector">
            <el-menu-item index="/inspection/tasks">
              <el-icon><List /></el-icon>
              <span>检查任务</span>
            </el-menu-item>
            <el-menu-item index="/inspection/reports">
              <el-icon><Document /></el-icon>
              <span>检查报告</span>
            </el-menu-item>
            <el-menu-item index="/inspection/statistics">
              <el-icon><PieChart /></el-icon>
              <span>统计分析</span>
            </el-menu-item>
          </template>

          <!-- 食堂工作人员菜单 -->
          <template v-if="userStore.isStaff">
            <el-menu-item index="/canteen/daily">
              <el-icon><Calendar /></el-icon>
              <span>日常记录</span>
            </el-menu-item>
            <el-menu-item index="/canteen/food">
              <el-icon><Food /></el-icon>
              <span>食品管理</span>
            </el-menu-item>
            <el-menu-item index="/canteen/inventory">
              <el-icon><Box /></el-icon>
              <span>库存管理</span>
            </el-menu-item>
          </template>

          <!-- 所有角色共有的菜单 -->
          <el-menu-item index="/profile">
            <el-icon><UserFilled /></el-icon>
            <span>个人信息</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
          <div class="header-right">
            <el-dropdown @command="handleCommand">
              <span class="user-info">
                <el-avatar :size="32" :src="userStore.user?.avatar">
                  {{ userStore.user?.username?.charAt(0)?.toUpperCase() }}
                </el-avatar>
                <span class="username">{{ userStore.user?.username }}</span>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="profile">个人信息</el-dropdown-item>
                  <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { 
  Monitor, 
  Setting, 
  User, 
  UserFilled, 
  List, 
  Document, 
  PieChart,
  Calendar,
  Food,
  Box,
  School
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const handleCommand = (command) => {
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'logout':
      userStore.logout()
      router.push('/login')
      break
  }
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
}

.logo-container {
  display: flex;
  align-items: center;
  padding: 1rem;
  background: var(--el-menu-bg-color);
  border-bottom: 1px solid var(--el-border-color-light);
}

.logo-icon {
  font-size: 1.5rem;
  color: var(--el-color-primary);
  margin-right: 0.5rem;
}

.title {
  font-size: 1.125rem;
  font-weight: bold;
  color: var(--el-text-color-primary);
  margin: 0;
}

.menu {
  border: 0;
  height: calc(100vh - 4rem);
}

.el-header {
  background-color: #fff;
  border-bottom: 1px solid var(--el-border-color-light);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 1rem;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: background-color 0.3s;
}

.user-info:hover {
  background-color: var(--el-fill-color-light);
}

.username {
  margin-left: 0.5rem;
  color: var(--el-text-color-regular);
}

.el-main {
  background-color: var(--el-fill-color-blank);
  padding: 1rem;
}

:deep(.el-menu-item.is-active) {
  background-color: var(--el-color-primary-light-9);
}

:deep(.el-menu-item:hover) {
  background-color: var(--el-fill-color-light);
}

:deep(.el-sub-menu__title:hover) {
  background-color: var(--el-fill-color-light);
}
</style> 