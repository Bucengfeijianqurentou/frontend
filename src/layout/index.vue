<template>
  <div class="layout-container">
    <el-container>
      <el-aside width="240px">
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
            <el-menu-item index="/system">
              <el-icon><Monitor /></el-icon>
              <span>系统监控</span>
            </el-menu-item>

            <el-menu-item index="/admin/analysis">
              <el-icon><DataLine /></el-icon>
              <span>数据分析</span>
            </el-menu-item>

            <el-menu-item index="/admin/tracing">
              <el-icon><Link /></el-icon>
              <span>溯源查询</span>
            </el-menu-item>

            <el-menu-item index="/suppliers">
                <el-icon><Connection /></el-icon>
                <span>供应商管理</span>
              </el-menu-item>

            <el-sub-menu index="user-manage">
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
            </el-sub-menu>

            <el-menu-item index="/admin/permissions">
              <el-icon><Lock /></el-icon>
              <span>权限管理</span>
            </el-menu-item>

            <el-menu-item index="/admin/notifications">
              <el-icon><Bell /></el-icon>
              <span>通知管理</span>
            </el-menu-item>

            <el-menu-item index="/admin/reports">
              <el-icon><Document /></el-icon>
              <span>报表生成</span>
            </el-menu-item>
          </template>

          <!-- 监管方菜单 -->
          <template v-if="userStore.isInspector">
            <el-menu-item index="/inspection">
              <el-icon><Search /></el-icon>
              <span>监管检查</span>
            </el-menu-item>

            <el-menu-item index="/tracing">
              <el-icon><Link /></el-icon>
              <span>溯源查询</span>
            </el-menu-item>

            <el-menu-item index="/analysis">
              <el-icon><DataLine /></el-icon>
              <span>数据分析</span>
            </el-menu-item>
          </template>

          <!-- 食堂工作人员菜单 -->
          <template v-if="userStore.isStaff">
            <el-sub-menu index="purchase">
              <template #title>
                <el-icon><ShoppingCart /></el-icon>
                <span>食品采购</span>
              </template>
              <el-menu-item index="/purchase/create">
                <el-icon><Plus /></el-icon>
                <span>新建采购单</span>
              </el-menu-item>
              <el-menu-item index="/purchase/list">
                <el-icon><List /></el-icon>
                <span>采购记录</span>
              </el-menu-item>
            </el-sub-menu>

            <el-menu-item index="/processing">
              <el-icon><KnifeFork /></el-icon>
              <span>食品加工</span>
            </el-menu-item>

            <el-menu-item index="/distribution">
              <el-icon><Box /></el-icon>
              <span>食品发放</span>
            </el-menu-item>

            <el-menu-item index="/menu">
              <el-icon><Memo /></el-icon>
              <span>菜单管理</span>
            </el-menu-item>

            
          </template>

          <!-- 所有用户可见的菜单 -->
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
  School,
  ShoppingCart,
  Plus,
  KnifeFork,
  Memo,
  Connection,
  Search,
  Link,
  DataLine,
  Lock,
  Bell
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