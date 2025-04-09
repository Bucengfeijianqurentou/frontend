<template>
  <div class="p-4">
    <el-card class="w-full">
      <template #header>
        <div class="flex items-center">
          <el-icon class="mr-2"><UserFilled /></el-icon>
          <span>个人信息</span>
        </div>
      </template>
      
      <el-form label-width="100px" class="max-w-2xl mx-auto">
        <el-form-item label="头像">
          <el-avatar 
            :size="100" 
            :src="userStore.user?.avatar"
            class="mb-2"
          >
            {{ userStore.user?.username?.charAt(0)?.toUpperCase() }}
          </el-avatar>
          <div>
            <el-button type="primary" class="ml-2">更换头像</el-button>
          </div>
        </el-form-item>

        <el-form-item label="用户名">
          <el-input v-model="userStore.user.username" disabled />
        </el-form-item>

        <el-form-item label="角色">
          <el-tag :type="roleType">{{ roleText }}</el-tag>
        </el-form-item>

        <el-form-item label="邮箱">
          <el-input v-model="userStore.user.email" disabled />
        </el-form-item>

        <el-form-item label="注册时间">
          <el-input :model-value="formatDate(userStore.user.createdAt)" disabled />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleUpdateProfile">
            保存修改
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { UserFilled } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()

// 角色显示文本
const roleText = computed(() => {
  switch (userStore.userRole) {
    case 'ADMIN':
      return '管理员'
    case 'INSPECTOR':
      return '监管人员'
    case 'STAFF':
      return '食堂工作人员'
    default:
      return '未知角色'
  }
})

// 角色标签类型
const roleType = computed(() => {
  switch (userStore.userRole) {
    case 'ADMIN':
      return 'danger'
    case 'INSPECTOR':
      return 'warning'
    case 'STAFF':
      return 'success'
    default:
      return 'info'
  }
})

// 格式化日期
const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleString()
}

// 更新个人信息
const handleUpdateProfile = () => {
  ElMessage.success('个人信息更新成功')
}
</script> 