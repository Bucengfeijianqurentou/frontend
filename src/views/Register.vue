<template>
  <div class="register-container">
    <div class="register-box">
      <div class="title">
        <img src="../assets/logo.png" alt="logo" class="logo">
        <h2>注册账号</h2>
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
            prefix-icon="User"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="registerForm.password"
            type="password"
            placeholder="密码"
            prefix-icon="Lock"
            show-password
          />
        </el-form-item>
        <el-form-item prop="confirmPassword">
          <el-input
            v-model="registerForm.confirmPassword"
            type="password"
            placeholder="确认密码"
            prefix-icon="Lock"
            show-password
          />
        </el-form-item>
        <el-form-item prop="role">
          <el-select
            v-model="registerForm.role"
            placeholder="请选择角色"
            class="w-full"
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
            prefix-icon="Message"
          />
        </el-form-item>
        <el-form-item prop="phone">
          <el-input
            v-model="registerForm.phone"
            placeholder="手机号"
            prefix-icon="Phone"
          />
        </el-form-item>
        <el-form-item prop="realName">
          <el-input
            v-model="registerForm.realName"
            placeholder="真实姓名"
            prefix-icon="User"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            class="w-full"
            :loading="loading"
            @click="handleRegister"
          >
            注册
          </el-button>
        </el-form-item>
        <div class="flex justify-center">
          <el-link type="primary" @click="$router.push('/login')">
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
import { User, Lock, Message, Phone } from '@element-plus/icons-vue'

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
  background-color: #f3f4f6;
  background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
}

.register-box {
  background-color: #fff;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  width: 24rem;
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
}

h2 {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

:deep(.el-input__wrapper) {
  border-radius: 0.375rem;
}

:deep(.el-button) {
  border-radius: 0.375rem;
}
</style> 