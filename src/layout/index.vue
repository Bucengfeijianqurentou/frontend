<template>
  <div class="layout-container">
    <el-container>
      <el-aside width="200px">
        <div class="logo-container">
          <img src="../assets/logo.png" alt="logo" class="logo">
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
          <!-- 其他菜单项根据角色动态显示 -->
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
import { Monitor } from '@element-plus/icons-vue'

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
}

.logo {
  width: 2rem;
  height: 2rem;
  margin-right: 0.5rem;
}

.title {
  font-size: 1.125rem;
  font-weight: bold;
  color: #1f2937;
}

.menu {
  border: 0;
}

.el-header {
  background-color: #fff;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.username {
  margin-left: 0.5rem;
  color: #374151;
}

.el-main {
  background-color: #f9fafb;
}
</style> 