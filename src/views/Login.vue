<template>
  <div class="login-container">
    <div class="animated-background">
      <div class="shape shape1"></div>
      <div class="shape shape2"></div>
      <div class="shape shape3"></div>
    </div>
    <div class="login-box glass-effect animate__animated animate__fadeIn">
      <div class="title">
        <div class="icon-wrapper animate__animated animate__bounceIn">
          <el-icon class="platform-icon"><School /></el-icon>
        </div>
        <h2 class="animate__animated animate__fadeInUp">中小学食堂监管平台</h2>
        <p class="subtitle animate__animated animate__fadeIn animate__delay-1s">安全、规范、智能化的食堂管理系统</p>
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
            :prefix-icon="User"
            class="hover-scale"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="密码"
            :prefix-icon="Lock"
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
            class="w-full hover-scale login-button"
            :loading="loading"
            @click="handleLogin"
          >
            <el-icon class="mr-2"><Right /></el-icon>
            登录
          </el-button>
        </el-form-item>
        <div class="flex justify-between items-center">
          <el-link type="primary" @click="$router.push('/register')" class="hover-scale register-link">
            <el-icon class="mr-1"><Plus /></el-icon>
            注册账号
          </el-link>
          <el-link type="info" class="hover-scale forgot-link">
            <el-icon class="mr-1"><QuestionFilled /></el-icon>
            忘记密码
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
import { User, Lock, School, Right, Plus, QuestionFilled } from '@element-plus/icons-vue'
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
  background: #0f172a;
  position: relative;
  overflow: hidden;
}

.animated-background {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.shape {
  position: absolute;
  filter: blur(90px);
  opacity: 0.4;
  animation: float 10s infinite;
}

.shape1 {
  background: #60a5fa;
  width: 500px;
  height: 500px;
  top: -250px;
  right: -100px;
}

.shape2 {
  background: #8b5cf6;
  width: 400px;
  height: 400px;
  bottom: -200px;
  left: -100px;
  animation-delay: -2s;
}

.shape3 {
  background: #34d399;
  width: 300px;
  height: 300px;
  bottom: 50%;
  right: 20%;
  animation-delay: -5s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-20px) scale(1.05);
  }
}

.login-box {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  padding: 2.5rem;
  border-radius: 1rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  width: 24rem;
  position: relative;
  z-index: 1;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.title {
  text-align: center;
  margin-bottom: 2rem;
}

.icon-wrapper {
  width: 4rem;
  height: 4rem;
  margin: 0 auto 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(96, 165, 250, 0.2), rgba(139, 92, 246, 0.2));
  border-radius: 1rem;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.platform-icon {
  font-size: 2rem;
  color: #fff;
}

h2 {
  font-size: 1.75rem;
  font-weight: bold;
  color: #fff;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.subtitle {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

:deep(.el-input__wrapper) {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.75rem;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: none;
}

:deep(.el-input__wrapper:hover) {
  border-color: rgba(96, 165, 250, 0.5);
  box-shadow: 0 0 0 1px rgba(96, 165, 250, 0.1);
}

:deep(.el-input__inner) {
  color: #fff;
}

:deep(.el-input__inner::placeholder) {
  color: rgba(255, 255, 255, 0.5);
}

:deep(.el-select .el-input__inner) {
  color: rgba(255, 255, 255, 0.9);
}

:deep(.el-icon) {
  color: rgba(255, 255, 255, 0.7);
}

.login-button {
  border-radius: 0.75rem;
  height: 2.75rem;
  font-weight: 500;
  letter-spacing: 0.025em;
  background: linear-gradient(135deg, #60a5fa 0%, #8b5cf6 100%);
  border: none;
  transition: all 0.3s ease;
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(96, 165, 250, 0.3);
}

.register-link, .forgot-link {
  font-size: 0.875rem;
  display: flex;
  align-items: center;
}

:deep(.el-select-dropdown) {
  background: rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

:deep(.el-select-dropdown__item) {
  color: rgba(255, 255, 255, 0.9);
}

:deep(.el-select-dropdown__item.hover),
:deep(.el-select-dropdown__item:hover) {
  background: rgba(96, 165, 250, 0.1);
}

:deep(.el-select-dropdown__item.selected) {
  background: rgba(96, 165, 250, 0.2);
  color: #60a5fa;
}
</style> 