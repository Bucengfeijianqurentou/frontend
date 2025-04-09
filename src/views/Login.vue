<template>
  <div class="login-container">
    <div class="login-box glass-effect animate__animated animate__fadeIn">
      <div class="title">
        <img src="../assets/logo.png" alt="logo" class="logo animate__animated animate__bounceIn">
        <h2 class="animate__animated animate__fadeInUp">中小学食堂监管平台</h2>
      </div>
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="用户名"
            prefix-icon="User"
            class="hover-scale"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="密码"
            prefix-icon="Lock"
            show-password
            class="hover-scale"
          />
        </el-form-item>
        <el-form-item prop="role">
          <el-select
            v-model="loginForm.role"
            placeholder="请选择角色"
            class="w-full hover-scale"
          >
            <el-option
              v-for="item in roleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            class="w-full hover-scale"
            :loading="loading"
            @click="handleLogin"
          >
            登录
          </el-button>
        </el-form-item>
        <div class="flex justify-between">
          <el-link type="primary" @click="$router.push('/register')" class="hover-scale">
            注册账号
          </el-link>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import 'animate.css'

const router = useRouter()
const userStore = useUserStore()
const loginFormRef = ref(null)
const loading = ref(false)

const loginForm = reactive({
  username: '',
  password: '',
  role: ''
})

const roleOptions = [
  { label: '管理员', value: 'ADMIN' },
  { label: '监管人员', value: 'INSPECTOR' },
  { label: '食堂工作人员', value: 'STAFF' }
]

const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ]
}

const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  await loginFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      loading.value = true
      try {
        const success = await userStore.userLogin(loginForm)
        if (success) {
          ElMessage.success('登录成功')
          router.push('/')
        }
      } finally {
        loading.value = false
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

.login-container::before {
  content: '';
  position: absolute;
  width: 150%;
  height: 150%;
  background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%);
  animation: rotate 20s linear infinite;
}

.login-box {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  padding: 2.5rem;
  border-radius: 1rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  width: 24rem;
  position: relative;
  z-index: 1;
}

.title {
  text-align: center;
  margin-bottom: 2rem;
}

.logo {
  width: 5rem;
  height: 5rem;
  margin: 0 auto 1rem;
  display: block;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
}

h2 {
  font-size: 1.75rem;
  font-weight: bold;
  background: linear-gradient(120deg, #1a365d 0%, #2563eb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

:deep(.el-input__wrapper) {
  border-radius: 0.75rem;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

:deep(.el-input__wrapper:hover) {
  border-color: #4f46e5;
  box-shadow: 0 0 0 1px rgba(79, 70, 229, 0.1);
}

:deep(.el-button) {
  border-radius: 0.75rem;
  height: 2.75rem;
  font-weight: 500;
  letter-spacing: 0.025em;
  background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
  border: none;
  transition: all 0.3s ease;
}

:deep(.el-button:hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style> 