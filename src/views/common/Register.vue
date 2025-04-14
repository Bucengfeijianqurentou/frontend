<template>
  <div class="register-container">
    <div class="animated-background">
      <div class="shape shape1"></div>
      <div class="shape shape2"></div>
      <div class="shape shape3"></div>
    </div>
    <div class="register-box glass-effect animate__animated animate__fadeIn">
      <div class="title">
        <div class="icon-wrapper animate__animated animate__bounceIn">
          <el-icon class="platform-icon"><UserFilled /></el-icon>
        </div>
        <h2 class="animate__animated animate__fadeInUp">注册账号</h2>
        <p class="subtitle animate__animated animate__fadeIn animate__delay-1s">加入我们，共同守护校园食品安全</p>
      </div>
      <el-form
        ref="registerFormRef"
        :model="registerForm"
        :rules="registerRules"
        class="register-form"
      >
        <el-form-item prop="username">
          <el-input
            v-model="registerForm.username"
            placeholder="用户名"
            :prefix-icon="User"
            class="hover-scale"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="registerForm.password"
            type="password"
            placeholder="密码"
            :prefix-icon="Lock"
            show-password
            class="hover-scale"
          />
        </el-form-item>
        <el-form-item prop="confirmPassword">
          <el-input
            v-model="registerForm.confirmPassword"
            type="password"
            placeholder="确认密码"
            :prefix-icon="Lock"
            show-password
            class="hover-scale"
          />
        </el-form-item>
        <el-form-item prop="role">
          <el-select
            v-model="registerForm.role"
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
        <el-form-item prop="email">
          <el-input
            v-model="registerForm.email"
            placeholder="邮箱"
            :prefix-icon="Message"
            class="hover-scale"
          />
        </el-form-item>
        <el-form-item prop="phone">
          <el-input
            v-model="registerForm.phone"
            placeholder="手机号"
            :prefix-icon="Phone"
            class="hover-scale"
          />
        </el-form-item>
        <el-form-item prop="realName">
          <el-input
            v-model="registerForm.realName"
            placeholder="真实姓名"
            :prefix-icon="User"
            class="hover-scale"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            class="w-full hover-scale register-button"
            :loading="loading"
            @click="handleRegister"
          >
            <el-icon class="mr-2"><Check /></el-icon>
            注册
          </el-button>
        </el-form-item>
        <div class="flex justify-center">
          <el-link type="primary" @click="$router.push('/login')" class="hover-scale login-link">
            <el-icon class="mr-1"><Back /></el-icon>
            已有账号？返回登录
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
import { 
  User, 
  Lock, 
  Message, 
  Phone, 
  Check, 
  Back,
  UserFilled 
} from '@element-plus/icons-vue'
import 'animate.css'

const router = useRouter()
const userStore = useUserStore()
const registerFormRef = ref(null)
const loading = ref(false)

const registerForm = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  role: '',
  email: '',
  phone: '',
  realName: ''
})

const roleOptions = [
  { label: '监管人员', value: 'INSPECTOR' },
  { label: '食堂工作人员', value: 'STAFF' }
]

const validatePass2 = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== registerForm.password) {
    callback(new Error('两次输入密码不一致!'))
  } else {
    callback()
  }
}

const registerRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, validator: validatePass2, trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  realName: [
    { required: true, message: '请输入真实姓名', trigger: 'blur' }
  ]
}

const handleRegister = async () => {
  if (!registerFormRef.value) return

  await registerFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      loading.value = true
      try {
        // 移除确认密码字段
        const { confirmPassword, ...registerData } = registerForm
        const success = await userStore.userRegister(registerData)
        if (success) {
          router.push('/login')
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
.register-container {
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

.register-box {
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

.register-form {
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

.register-button {
  border-radius: 0.75rem;
  height: 2.75rem;
  font-weight: 500;
  letter-spacing: 0.025em;
  background: linear-gradient(135deg, #60a5fa 0%, #8b5cf6 100%);
  border: none;
  transition: all 0.3s ease;
}

.register-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(96, 165, 250, 0.3);
}

.login-link {
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