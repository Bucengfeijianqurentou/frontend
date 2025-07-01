<template>
  <div class="login-container">
    <div class="food-pattern-bg"></div>

    <div class="content-wrapper">
      <!-- 左侧部分内容 -->
      <div class="illustration-pane">
        <div class="illustration-content">
          <img src="/public/undraw_breakfast_rgx5.svg" alt="中小学食堂监管平台插画"
            class="main-illustration animate__animated animate__fadeInUp" />

          <div class="features-icons">
            <div class="feature-icon animate__animated animate__fadeIn animate__delay-1s">
              <el-icon>
                <Monitor />
              </el-icon>
              <span>实时监控</span>
            </div>
            <div class="feature-icon animate__animated animate__fadeIn animate__delay-1s">
              <el-icon>
                <DataAnalysis />
              </el-icon>
              <span>数据分析</span>
            </div>
            <div class="feature-icon animate__animated animate__fadeIn animate__delay-1s">
              <el-icon>
                <Bell />
              </el-icon>
              <span>预警提醒</span>
            </div>
          </div>

          <div class="illustration-text animate__animated animate__fadeInUp animate__delay-1s">
            <h3>智慧监管，食安护航</h3>
            <p>科技赋能中小学食堂安全管理新篇章</p>
          </div>
        </div>
      </div>

      <!-- 右侧表单部分 -->
      <div class="form-pane">
        <div class="themed-login-box animate__animated animate__fadeInRight">
          <div class="title-section">
            <div class="icon-container">
              <el-icon class="platform-logo">
                <School />
              </el-icon>
            </div>
            <h2 class="main-title">智膳云</h2>
          </div>

          <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" class="login-form-content"
            label-position="top" @submit.prevent="handleLogin">
            <el-form-item prop="username" label="用户名">
              <el-input v-model="loginForm.username" placeholder="请输入用户名" :prefix-icon="User" size="large" clearable />
            </el-form-item>
            <el-form-item prop="password" label="密码">
              <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" :prefix-icon="Lock" show-password
                size="large" clearable />
            </el-form-item>
            <el-form-item prop="role" label="角色">
              <el-select v-model="loginForm.role" placeholder="请选择您的角色" class="w-full" size="large">
                <el-option v-for="item in roleOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="w-full login-submit-button" :loading="loading" native-type="submit"
                size="large">
                <el-icon class="mr-1">
                  <Right />
                </el-icon>
                登 录
              </el-button>
            </el-form-item>
            <div class="form-links">
              <el-link type="primary" @click="$router.push('/register')">
                <el-icon class="mr-1">
                  <Plus />
                </el-icon>
                注册新账号
              </el-link>
              <el-link type="info">
                <el-icon class="mr-1">
                  <QuestionFilled />
                </el-icon>
                忘记密码?
              </el-link>
            </div>
          </el-form>
          <footer class="page-footer-form">
            © {{ new Date().getFullYear() }} 中小学食堂监管平台
          </footer>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// --- Script 部分 ---
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import {
  User,
  Lock,
  School,
  Right,
  Plus,
  QuestionFilled,
  Monitor,
  DataAnalysis,
  Bell
} from '@element-plus/icons-vue'
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
  if (!loginFormRef.value) return;
  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      try {
        const success = await userStore.userLogin(loginForm);
        if (success) {
          ElMessage.success('登录成功');
          router.push('/');
        }
      } catch (error) {
        console.error('Login failed:', error);
      } finally {
        loading.value = false;
      }
    }
  });
};
// --- Script 部分结束 ---
</script>

<style scoped>
/* --- 主题颜色变量 --- */
:root {
  --primary-color: #F9A825;
  /* 主色调：金黄色 */
  --primary-light: #FFF8E1;
  /* 浅色调 */
  --primary-dark: #F57F17;
  /* 深色调 */
  --accent-color: #6C63FF;
  /* 强调色：紫色 */
  --text-primary: #333333;
  /* 主要文字颜色 */
  --text-secondary: #666666;
  /* 次要文字颜色 */
  --background-light: #F5F1E6;
  /* 轻背景：更暖和的象牙色 */
  --background-gradient-start: #F0E5CA;
  /* 渐变起始色：温暖的米色 */
  --background-gradient-end: #FBF0E4;
  /* 渐变结束色：淡桃色 */
  --shadow-color: rgba(249, 168, 37, 0.2);
  /* 阴影颜色：稍微加深 */
}

/* --- 全局容器样式 --- */
.login-container {
  position: relative;
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
  background: linear-gradient(120deg, var(--background-gradient-start), var(--background-gradient-end));
}

.food-pattern-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image:
    radial-gradient(circle at 10% 20%, rgba(249, 168, 37, 0.1) 0%, transparent 8%),
    radial-gradient(circle at 90% 30%, rgba(108, 99, 255, 0.1) 0%, transparent 8%),
    radial-gradient(circle at 30% 70%, rgba(249, 168, 37, 0.1) 0%, transparent 8%),
    radial-gradient(circle at 70% 80%, rgba(108, 99, 255, 0.1) 0%, transparent 8%);
  z-index: 0;
  opacity: 0.9;
}

.content-wrapper {
  position: relative;
  display: flex;
  min-height: 100vh;
  z-index: 1;
}

/* --- 左侧插图区域样式 --- */
.illustration-pane {
  flex: 1.2;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 3rem;
  background-color: rgba(240, 229, 202, 0.5);
}

.illustration-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 90%;
}

.main-illustration {
  max-width: 80%;
  height: auto;
  object-fit: contain;
  margin-bottom: 2.5rem;
  filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.1));
  transform-origin: center;
  transition: transform 0.5s ease;
}

.main-illustration:hover {
  transform: scale(1.02);
}

.features-icons {
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 400px;
  margin-bottom: 2rem;
}

.feature-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  background-color: rgba(255, 253, 245, 0.85);
  border-radius: 12px;
  box-shadow: 0 4px 12px var(--shadow-color);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-icon:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px var(--shadow-color);
}

.feature-icon .el-icon {
  font-size: 28px;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.feature-icon span {
  font-size: 14px;
  color: var(--text-primary);
  font-weight: 500;
}

.illustration-text {
  text-align: center;
  padding: 2rem;
  background: rgba(255, 253, 245, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 450px;
  border: 1px solid rgba(249, 168, 37, 0.2);
}

.illustration-text h3 {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.illustration-text p {
  font-size: 1.1rem;
  line-height: 1.6;
  color: var(--text-secondary);
}

/* --- 右侧表单区域样式 --- */
.form-pane {
  flex: 0.8;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  background-color: #F4E9D6;
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 2;
}

.themed-login-box {
  width: 100%;
  max-width: 400px;
  animation-duration: 0.6s;
  background-color: rgba(255, 253, 245, 0.8);
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.title-section {
  text-align: center;
  margin-bottom: 2.5rem;
}

.icon-container {
  width: 70px;
  height: 70px;
  margin: 0 auto 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-light);
  border: 2px solid var(--primary-color);
  border-radius: 16px;
  box-shadow: 0 6px 12px rgba(249, 168, 37, 0.2);
  transform-origin: center;
  transition: transform 0.3s ease;
}

.icon-container:hover {
  transform: rotate(5deg);
}

.platform-logo {
  font-size: 32px;
  color: var(--primary-color);
}

.main-title {
  font-size: 1.9rem;
  font-weight: 700;
  background: linear-gradient(to right, var(--primary-color), var(--primary-dark));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
}

/* 表单样式 */
.login-form-content {
  display: flex;
  flex-direction: column;
  gap: 1.3rem;
}

:deep(.el-form-item__label) {
  color: var(--text-primary);
  font-weight: 500;
  font-size: 0.95rem;
}

:deep(.el-input__wrapper),
:deep(.el-select .el-input__wrapper) {
  background-color: rgba(255, 255, 255, 0.85);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border-radius: 10px;
  border: 1px solid #e0e0e0;
  transition: all 0.25s ease;
  padding: 5px 12px;
}

:deep(.el-input__wrapper.is-focus),
:deep(.el-select .el-input__wrapper.is-focus) {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(249, 168, 37, 0.2);
}

:deep(.el-input__icon) {
  color: var(--primary-color);
}

/* 按钮样式 */
.login-submit-button {
  border-radius: 12px;
  height: 48px;
  font-weight: 600;
  font-size: 1.05rem;
  letter-spacing: 1px;
  background: linear-gradient(to right, var(--primary-color), var(--primary-dark));
  border: none;
  box-shadow: 0 4px 12px rgba(249, 168, 37, 0.3);
  transition: all 0.3s ease;
}

.login-submit-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(249, 168, 37, 0.4);
}

.login-submit-button:active {
  transform: translateY(0);
}

.form-links {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.2rem;
}

.form-links .el-link {
  font-size: 0.9rem;
  font-weight: 500;
}

.form-links .el-link--primary {
  color: var(--primary-color);
}

.form-links .el-link--primary:hover {
  color: var(--primary-dark);
}

.form-links .el-link--info {
  color: var(--text-secondary);
}

.form-links .el-link--info:hover {
  color: var(--text-primary);
}

.page-footer-form {
  text-align: center;
  margin-top: 3rem;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

/* 响应式设计 */
@media (max-width: 1100px) {
  .content-wrapper {
    flex-direction: column;
  }

  .illustration-pane {
    flex: initial;
    padding: 3rem 1.5rem;
    min-height: auto;
  }

  .features-icons {
    max-width: 350px;
  }

  .form-pane {
    flex: initial;
    width: 100%;
    padding: 2.5rem 1.5rem;
  }
}

@media (max-width: 576px) {
  .illustration-pane {
    padding: 2rem 1rem;
  }

  .main-illustration {
    max-width: 85%;
  }

  .features-icons {
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }

  .feature-icon {
    width: 80%;
  }

  .illustration-text {
    padding: 1.5rem;
  }

  .illustration-text h3 {
    font-size: 1.5rem;
  }

  .form-pane {
    padding: 2rem 1rem;
  }

  .main-title {
    font-size: 1.6rem;
  }
}</style>