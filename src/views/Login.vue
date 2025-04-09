<template>
  <div class="login-container">
    <div class="login-box">
      <div class="title">
        <img src="../assets/logo.png" alt="logo" class="logo">
        <h2>中小学食堂监管平台</h2>
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
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="密码"
            prefix-icon="Lock"
            show-password
          />
        </el-form-item>
        <el-form-item prop="role">
          <el-select
            v-model="loginForm.role"
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
        <el-form-item>
          <el-button
            type="primary"
            class="w-full"
            :loading="loading"
            @click="handleLogin"
          >
            登录
          </el-button>
        </el-form-item>
        <div class="flex justify-between">
          <el-link type="primary" @click="$router.push('/register')">
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
  background-color: #f3f4f6;
  background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
}

.login-box {
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

.login-form {
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