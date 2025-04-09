<template>
  <div class="dashboard-container">
    <h2>欢迎使用中小学食堂监管平台</h2>
    <el-row :gutter="20" class="mt-4">
      <el-col :span="8">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>用户信息</span>
            </div>
          </template>
          <div class="user-info">
            <p><strong>用户名：</strong>{{ userStore.user?.username }}</p>
            <p><strong>角色：</strong>{{ getRoleName(userStore.user?.role) }}</p>
            <p><strong>邮箱：</strong>{{ userStore.user?.email }}</p>
          </div>
        </el-card>
      </el-col>
      <!-- 其他卡片可以根据角色动态显示 -->
    </el-row>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const getRoleName = (role) => {
  const roleMap = {
    'ADMIN': '管理员',
    'INSPECTOR': '监管人员',
    'STAFF': '食堂工作人员'
  }
  return roleMap[role] || role
}
</script>

<style scoped>
.dashboard-container {
  padding: 1.5rem;
}

h2 {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 1.5rem;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.user-info p {
  color: #4b5563;
  margin: 0;
}

.user-info strong {
  color: #1f2937;
}

.mt-4 {
  margin-top: 1rem;
}
</style> 