<template>
  <div class="profile-container p-4">
    <el-row :gutter="24">
      <!-- 左侧个人信息卡片 -->
      <el-col :xs="24" :md="8">
        <el-card class="user-card mb-4 overflow-visible shadow-lg border-0">
          <div class="user-header">
            <div class="bg-gradient"></div>
            <div class="avatar-wrapper">
              <div class="avatar-container">
                <el-avatar 
                  :size="120" 
                  :src="userStore.user?.avatar"
                  class="user-avatar"
                >
                  {{ userStore.user?.username?.charAt(0)?.toUpperCase() }}
                </el-avatar>
                <div class="avatar-badge">
                  <el-tag :type="roleType" size="small" effect="dark" class="px-3 py-1 rounded-2xl">
                    {{ roleText }}
                  </el-tag>
                </div>
              </div>
            </div>
            
            <h2 class="user-name mt-3">{{ userStore.user?.realName || userStore.user?.username }}</h2>
            <p class="user-title text-gray-500">{{ userStore.user?.title || roleText }}</p>
            
            <div class="user-stats mt-4">
              <div class="stat-item">
                <div class="stat-value">{{ userStore.user?.loginCount || 12 }}</div>
                <div class="stat-label">登录次数</div>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item">
                <div class="stat-value">{{ formatDays(userStore.user?.createTime) }}</div>
                <div class="stat-label">使用天数</div>
              </div>
            </div>
          </div>
          
          <div class="info-badges my-4 px-2">
            <el-row :gutter="10">
              <el-col :span="8">
                <div class="info-badge text-center p-2 rounded-lg">
                  <el-icon class="mb-1"><Medal /></el-icon>
                  <div class="badge-value">{{ userStore.user?.achievementCount || 3 }}</div>
                  <div class="badge-label">成就</div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="info-badge text-center p-2 rounded-lg">
                  <el-icon class="mb-1"><Check /></el-icon>
                  <div class="badge-value">{{ userStore.user?.completedTaskCount || 15 }}</div>
                  <div class="badge-label">完成任务</div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="info-badge text-center p-2 rounded-lg">
                  <el-icon class="mb-1"><Star /></el-icon>
                  <div class="badge-value">{{ userStore.user?.contributionLevel || 4 }}</div>
                  <div class="badge-label">贡献等级</div>
                </div>
              </el-col>
            </el-row>
          </div>
          
          <div class="blockchain-info mt-4 p-4 bg-gray-50 rounded-md border border-gray-100">
            <div class="flex items-center mb-3">
              <el-icon class="mr-2 text-indigo-500"><Connection /></el-icon>
              <span class="font-bold text-indigo-600">区块链账户</span>
            </div>
            <el-input 
              v-model="userStore.user.chainAccount" 
              disabled 
              size="small"
              class="blockchain-address mb-2"
            >
              <template #append>
                <el-button @click="copyToClipboard(userStore.user.chainAccount)">
                  <el-icon><DocumentCopy /></el-icon>
                </el-button>
              </template>
            </el-input>
            <div class="blockchain-status flex items-center">
              <el-icon class="mr-1 text-green-500"><CircleCheck /></el-icon>
              <span class="text-xs text-green-500">已验证的区块链身份</span>
            </div>
          </div>
        </el-card>
        
        <!-- 账户安全卡片 -->
        <el-card class="mb-4 shadow-md border-0 overflow-hidden">
          <template #header>
            <div class="flex items-center py-2">
              <el-icon class="mr-2 text-indigo-500"><Lock /></el-icon>
              <span class="font-medium text-indigo-600">账户安全</span>
            </div>
          </template>
          <div class="security-items">
            <div class="security-item flex justify-between items-center mb-3 pb-3 border-b">
              <div class="flex items-center">
                <el-icon class="mr-2 text-green-500"><Key /></el-icon>
                <span>密码</span>
              </div>
              <el-button type="primary" link @click="showPasswordDialog = true">修改</el-button>
            </div>
            <div class="security-item flex justify-between items-center mb-3 pb-3 border-b">
              <div class="flex items-center">
                <el-icon class="mr-2 text-green-500"><Message /></el-icon>
                <span>绑定邮箱</span>
              </div>
              <span class="text-gray-500">{{ maskEmail(userStore.user.email) }}</span>
            </div>
            <div class="security-item flex justify-between items-center">
              <div class="flex items-center">
                <el-icon class="mr-2 text-green-500"><Phone /></el-icon>
                <span>绑定手机</span>
              </div>
              <span class="text-gray-500">{{ maskPhone(userStore.user.phone) }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <!-- 右侧信息编辑区域 -->
      <el-col :xs="24" :md="16">
        <el-card class="shadow-md border-0 mb-4 profile-edit-card overflow-hidden">
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <el-icon class="mr-2 text-indigo-500"><Edit /></el-icon>
                <span class="font-medium text-indigo-600">个人信息设置</span>
              </div>
              <div>
                <el-button 
                  v-if="isEditing" 
                  @click="cancelEdit" 
                  class="mr-2"
                  plain
                >
                  取消
                </el-button>
                <el-button 
                  v-if="isEditing" 
                  type="primary" 
                  @click="saveProfileChanges"
                  :loading="saving"
                  class="bg-indigo-600 hover:bg-indigo-700"
                >
                  保存
                </el-button>
                <el-button 
                  v-else 
                  type="primary" 
                  @click="startEdit"
                  class="bg-indigo-600 hover:bg-indigo-700"
                >
                  编辑资料
                </el-button>
              </div>
            </div>
          </template>
          
          <el-form 
            ref="profileForm"
            :model="profileData"
            label-width="100px"
            :disabled="!isEditing"
            class="mt-4"
          >
            <el-tabs type="border-card" class="custom-tabs">
              <el-tab-pane label="基本信息">
                <div class="tab-content p-4">
                  <el-row :gutter="20">
                    <el-col :xs="24" :sm="12">
                      <el-form-item label="用户名" prop="username">
                        <el-input v-model="profileData.username" disabled />
                      </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12">
                      <el-form-item label="真实姓名" prop="realName">
                        <el-input v-model="profileData.realName" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  
                  <el-row :gutter="20">
                    <el-col :xs="24" :sm="12">
                      <el-form-item label="邮箱" prop="email">
                        <el-input v-model="profileData.email">
                          <template #prefix>
                            <el-icon><Message /></el-icon>
                          </template>
                        </el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12">
                      <el-form-item label="电话" prop="phone">
                        <el-input v-model="profileData.phone">
                          <template #prefix>
                            <el-icon><Phone /></el-icon>
                          </template>
                        </el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  
                  <el-form-item label="职位头衔" prop="title">
                    <el-input v-model="profileData.title" placeholder="请输入您的职位头衔">
                      <template #prefix>
                        <el-icon><User /></el-icon>
                      </template>
                    </el-input>
                  </el-form-item>
                  
                  <el-form-item label="个人简介" prop="bio">
                    <el-input 
                      v-model="profileData.bio" 
                      type="textarea" 
                      :rows="4"
                      placeholder="请简单介绍一下自己" 
                      resize="none"
                      class="bio-textarea"
                    />
                  </el-form-item>
                </div>
              </el-tab-pane>
              
              <el-tab-pane label="账户信息">
                <div class="tab-content p-4">
                  <el-row :gutter="20">
                    <el-col :xs="24" :sm="12">
                      <div class="info-item mb-4">
                        <div class="info-label text-gray-500 mb-1">账户ID</div>
                        <div class="info-value font-mono bg-gray-50 p-3 rounded-md">{{ userStore.user.id }}</div>
                      </div>
                    </el-col>
                    <el-col :xs="24" :sm="12">
                      <div class="info-item mb-4">
                        <div class="info-label text-gray-500 mb-1">注册时间</div>
                        <div class="info-value bg-gray-50 p-3 rounded-md">
                          {{ formatDate(userStore.user.createTime) }}
                        </div>
                      </div>
                    </el-col>
                  </el-row>
                  
                  <el-row :gutter="20">
                    <el-col :xs="24" :sm="12">
                      <div class="info-item mb-4">
                        <div class="info-label text-gray-500 mb-1">账户状态</div>
                        <div class="info-value p-3">
                          <el-tag :type="userStore.user.status === 1 ? 'success' : 'danger'" class="w-full text-center py-1">
                            {{ userStore.user.status === 1 ? '正常' : '禁用' }}
                          </el-tag>
                        </div>
                      </div>
                    </el-col>
                    <el-col :xs="24" :sm="12">
                      <div class="info-item mb-4">
                        <div class="info-label text-gray-500 mb-1">最后登录</div>
                        <div class="info-value bg-gray-50 p-3 rounded-md">
                          {{ formatDate(new Date()) }}
                        </div>
                      </div>
                    </el-col>
                  </el-row>
                  
                  <div class="account-activity mt-4">
                    <h3 class="text-lg font-medium mb-3 text-gray-700">最近活动</h3>
                    <el-timeline>
                      <el-timeline-item
                        v-for="(activity, index) in recentActivities"
                        :key="index"
                        :timestamp="activity.time"
                        :type="activity.type"
                      >
                        {{ activity.content }}
                      </el-timeline-item>
                    </el-timeline>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 修改密码对话框 -->
    <el-dialog
      v-model="showPasswordDialog"
      title="修改密码"
      width="500px"
      destroy-on-close
      class="password-dialog"
    >
      <el-form 
        ref="passwordForm"
        :model="passwordData"
        :rules="passwordRules"
        label-width="100px"
      >
        <el-form-item label="当前密码" prop="oldPassword">
          <el-input 
            v-model="passwordData.oldPassword" 
            type="password" 
            show-password
            placeholder="请输入当前密码"
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        
        <el-form-item label="新密码" prop="newPassword">
          <el-input 
            v-model="passwordData.newPassword" 
            type="password" 
            show-password
            placeholder="请输入新密码"
          >
            <template #prefix>
              <el-icon><Key /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        
        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input 
            v-model="passwordData.confirmPassword" 
            type="password" 
            show-password
            placeholder="请再次输入新密码"
          >
            <template #prefix>
              <el-icon><Check /></el-icon>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showPasswordDialog = false">取消</el-button>
          <el-button type="primary" @click="changePassword" :loading="changingPassword" class="bg-indigo-600 hover:bg-indigo-700">
            确认修改
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { 
  UserFilled, Connection, DocumentCopy, CircleCheck, Lock, 
  Key, Message, Phone, Edit, User, Medal, Check, Star 
} from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()
const profileForm = ref(null)
const passwordForm = ref(null)
const isEditing = ref(false)
const saving = ref(false)
const showPasswordDialog = ref(false)
const changingPassword = ref(false)

// 表单数据
const profileData = reactive({
  username: '',
  realName: '',
  email: '',
  phone: '',
  title: '',
  bio: ''
})

const passwordData = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 最近活动数据
const recentActivities = [
  { content: '登录系统', time: '2023-06-10 08:30', type: 'primary' },
  { content: '更新个人资料', time: '2023-06-08 16:45', type: 'success' },
  { content: '完成食品安全检查', time: '2023-06-05 14:20', type: 'info' },
  { content: '提交月度报告', time: '2023-06-01 09:15', type: 'warning' }
]

// 表单校验规则
const passwordRules = {
  oldPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' },
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    { 
      validator: (rule, value, callback) => {
        if (value !== passwordData.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      }, 
      trigger: 'blur' 
    }
  ]
}

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

// 初始化数据
onMounted(() => {
  const user = userStore.user
  if (user) {
    profileData.username = user.username || ''
    profileData.realName = user.realName || ''
    profileData.email = user.email || ''
    profileData.phone = user.phone || ''
    profileData.title = user.title || roleText.value
    profileData.bio = user.bio || ''
  }
})

// 格式化日期
const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleString()
}

// 计算使用天数
const formatDays = (createTime) => {
  if (!createTime) return 0
  const created = new Date(createTime)
  const now = new Date()
  const diffTime = Math.abs(now - created)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

// 隐藏邮箱中间部分
const maskEmail = (email) => {
  if (!email) return ''
  const parts = email.split('@')
  if (parts.length !== 2) return email
  
  const name = parts[0]
  const domain = parts[1]
  
  const maskedName = name.length <= 3 
    ? name.charAt(0) + '*'.repeat(name.length - 1)
    : name.charAt(0) + '*'.repeat(name.length - 2) + name.charAt(name.length - 1)
    
  return `${maskedName}@${domain}`
}

// 隐藏手机号中间部分
const maskPhone = (phone) => {
  if (!phone) return ''
  return phone.replace(/(\d{3})\d*(\d{4})/, '$1****$2')
}

// 复制到剪贴板
const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).then(() => {
    ElMessage.success('已复制到剪贴板')
  }).catch(() => {
    ElMessage.error('复制失败')
  })
}

// 开始编辑
const startEdit = () => {
  isEditing.value = true
}

// 取消编辑
const cancelEdit = () => {
  const user = userStore.user
  if (user) {
    profileData.username = user.username || ''
    profileData.realName = user.realName || ''
    profileData.email = user.email || ''
    profileData.phone = user.phone || ''
    profileData.title = user.title || roleText.value
    profileData.bio = user.bio || ''
  }
  isEditing.value = false
}

// 保存个人信息
const saveProfileChanges = async () => {
  saving.value = true
  try {
    // 这里应添加实际的API调用保存数据
    await new Promise(resolve => setTimeout(resolve, 500)) // 模拟API延迟
    
    // 更新用户信息到store
    userStore.user = {
      ...userStore.user,
      realName: profileData.realName,
      email: profileData.email,
      phone: profileData.phone,
      title: profileData.title,
      bio: profileData.bio
    }
    
    isEditing.value = false
    ElMessage.success('个人信息更新成功')
  } catch (error) {
    ElMessage.error('更新失败: ' + (error.message || '未知错误'))
  } finally {
    saving.value = false
  }
}

// 修改密码
const changePassword = async () => {
  await passwordForm.value.validate(async (valid, fields) => {
    if (valid) {
      changingPassword.value = true
      try {
        // 这里应添加实际的API调用修改密码
        await new Promise(resolve => setTimeout(resolve, 500)) // 模拟API延迟
        
        showPasswordDialog.value = false
        passwordData.oldPassword = ''
        passwordData.newPassword = ''
        passwordData.confirmPassword = ''
        
        ElMessage.success('密码修改成功')
      } catch (error) {
        ElMessage.error('密码修改失败: ' + (error.message || '未知错误'))
      } finally {
        changingPassword.value = false
      }
    }
  })
}
</script>

<style scoped>
.profile-container {
  min-height: calc(100vh - 120px);
  background-color: #f9fafb;
}

.user-card {
  overflow: hidden;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.user-card:hover {
  transform: translateY(-5px);
}

.user-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 20px 0;
  position: relative;
}

.bg-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-radius: 8px 8px 0 0;
}

.avatar-wrapper {
  position: relative;
  z-index: 2;
  margin-top: 10px;
}

.avatar-container {
  position: relative;
  display: inline-block;
}

.user-avatar {
  border: 4px solid #fff;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.user-avatar:hover {
  transform: scale(1.05);
}

.avatar-badge {
  position: absolute;
  bottom: 0;
  right: 0;
}

.user-name {
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 10px;
  margin-bottom: 5px;
  color: #374151;
}

.user-title {
  color: #6b7280;
  font-size: 0.9rem;
}

.user-stats {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #f0f0f0;
}

.stat-item {
  text-align: center;
  flex: 1;
}

.stat-divider {
  width: 1px;
  background-color: #f0f0f0;
  margin: 0 20px;
}

.stat-value {
  font-size: 1.3rem;
  font-weight: 600;
  color: #4f46e5;
}

.stat-label {
  font-size: 0.8rem;
  color: #6b7280;
  margin-top: 5px;
}

.info-badges .info-badge {
  background-color: #f3f4f6;
  transition: all 0.3s ease;
  height: 100%;
}

.info-badges .info-badge:hover {
  background-color: #e5e7eb;
  transform: translateY(-2px);
}

.info-badges .el-icon {
  font-size: 1.2rem;
  color: #4f46e5;
}

.info-badges .badge-value {
  font-weight: 600;
  font-size: 1.1rem;
  color: #1f2937;
}

.info-badges .badge-label {
  font-size: 0.7rem;
  color: #6b7280;
}

.blockchain-address .el-input__inner {
  font-family: monospace;
  font-size: 0.8rem;
}

.security-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.profile-edit-card {
  border-radius: 12px;
}

.profile-edit-card .el-card__header {
  background-color: #f9fafb;
  border-bottom: 1px solid #f0f0f0;
}

.custom-tabs .el-tabs__content {
  padding: 0;
}

.tab-content {
  background-color: #fff;
}

.bio-textarea .el-textarea__inner {
  border-radius: 8px;
}

.info-item .info-value {
  font-size: 0.95rem;
}

.account-activity .el-timeline {
  padding-left: 0;
}

.password-dialog .el-input__prefix {
  color: #4f46e5;
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background-color: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background-color: #c1c1c1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: #a8a8a8;
}
</style> 