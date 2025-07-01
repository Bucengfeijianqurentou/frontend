<template>
  <div class="login-container">
    <div class="food-pattern-bg"></div>
    <div class="floating-elements">
      <div class="floating-food food-1">🍎</div>
      <div class="floating-food food-2">🥕</div>
      <div class="floating-food food-3">🥛</div>
      <div class="floating-food food-4">🍞</div>
      <div class="floating-food food-5">🥗</div>
    </div>

    <div class="content-wrapper">
      <!-- 左侧部分内容 -->
      <div class="illustration-pane">
        <div class="illustration-content">
          <div class="welcome-badge animate__animated animate__bounceIn">
            <span class="badge-emoji">🎓</span>
            <span class="badge-text">欢迎来到智膳云</span>
          </div>
          
          <img src="/public/undraw_breakfast_rgx5.svg" alt="中小学食堂监管平台插画"
            class="main-illustration animate__animated animate__fadeInUp" />

          <div class="features-icons">
            <div class="feature-icon animate__animated animate__fadeIn animate__delay-1s">
              <div class="icon-wrapper">
                <el-icon>
                  <Monitor />
                </el-icon>
              </div>
              <span>实时监控</span>
              <div class="feature-desc">24小时守护</div>
            </div>
            <div class="feature-icon animate__animated animate__fadeIn animate__delay-1s">
              <div class="icon-wrapper">
                <el-icon>
                  <DataAnalysis />
                </el-icon>
              </div>
              <span>数据分析</span>
              <div class="feature-desc">智能统计</div>
            </div>
            <div class="feature-icon animate__animated animate__fadeIn animate__delay-1s">
              <div class="icon-wrapper">
                <el-icon>
                  <Bell />
                </el-icon>
              </div>
              <span>预警提醒</span>
              <div class="feature-desc">及时通知</div>
            </div>
          </div>

          <div class="illustration-text animate__animated animate__fadeInUp animate__delay-1s">
            <h3>🌟 智慧监管，食安护航 🌟</h3>
            <p>为中小学生打造安全、健康、美味的校园食堂体验</p>
            <div class="safety-badges">
              <span class="safety-badge">🛡️ 安全第一</span>
              <span class="safety-badge">💚 营养健康</span>
              <span class="safety-badge">😊 美味可口</span>
            </div>
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
              <div class="sparkles">
                <span class="sparkle sparkle-1">✨</span>
                <span class="sparkle sparkle-2">⭐</span>
                <span class="sparkle sparkle-3">💫</span>
              </div>
            </div>
            <h2 class="main-title">🍽️ 智膳云 🍽️</h2>
            <p class="subtitle">让每一餐都安心美味</p>
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
                <span v-if="!loading">🚀 开始探索</span>
                <span v-else>正在登录中...</span>
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
            <div class="footer-content">
              <span>© {{ new Date().getFullYear() }} 中小学食堂监管平台</span>
              <div class="footer-icons">
                <span>🏫</span>
                <span>🍎</span>
                <span>👨‍🍳</span>
                <span>👩‍🎓</span>
              </div>
            </div>
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
  --success-color: #4CAF50;
  /* 成功色：绿色 */
  --info-color: #2196F3;
  /* 信息色：蓝色 */
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
  --cute-pink: #FFB6C1;
  /* 可爱粉色 */
  --cute-blue: #87CEEB;
  /* 可爱蓝色 */
  --cute-green: #98FB98;
  /* 可爱绿色 */
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
    radial-gradient(circle at 70% 80%, rgba(108, 99, 255, 0.1) 0%, transparent 8%),
    radial-gradient(circle at 50% 50%, rgba(255, 182, 193, 0.08) 0%, transparent 12%);
  z-index: 0;
  opacity: 0.9;
}

/* --- 浮动食物元素 --- */
.floating-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

.floating-food {
  position: absolute;
  font-size: 2rem;
  opacity: 0.6;
  animation: float 6s ease-in-out infinite;
}

.food-1 {
  top: 10%;
  left: 5%;
  animation-delay: 0s;
}

.food-2 {
  top: 20%;
  right: 8%;
  animation-delay: 1s;
}

.food-3 {
  top: 60%;
  left: 3%;
  animation-delay: 2s;
}

.food-4 {
  top: 70%;
  right: 5%;
  animation-delay: 3s;
}

.food-5 {
  top: 40%;
  left: 50%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  25% {
    transform: translateY(-20px) rotate(5deg);
  }
  50% {
    transform: translateY(-10px) rotate(-3deg);
  }
  75% {
    transform: translateY(-15px) rotate(2deg);
  }
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
  padding: 1.5rem;
  background-color: rgba(240, 229, 202, 0.5);
}

.illustration-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 90%;
}

/* --- 欢迎徽章 --- */
.welcome-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, var(--cute-pink), var(--cute-blue));
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 25px;
  font-weight: 600;
  font-size: 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.2rem;
  animation-duration: 1s;
}

.badge-emoji {
  font-size: 1.3rem;
  animation: bounce 2s infinite;
}

.badge-text {
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  font-weight: 700;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

.main-illustration {
  max-width: 70%;
  height: auto;
  object-fit: contain;
  margin-bottom: 1.5rem;
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
  max-width: 350px;
  margin-bottom: 1.2rem;
}

.feature-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.8rem;
  background: linear-gradient(145deg, rgba(255, 253, 245, 0.9), rgba(255, 248, 225, 0.8));
  border-radius: 12px;
  box-shadow: 0 4px 15px var(--shadow-color);
  transition: all 0.3s ease;
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
}

.feature-icon::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.5s;
}

.feature-icon:hover {
  transform: translateY(-8px) scale(1.05);
  box-shadow: 0 12px 25px var(--shadow-color);
  border-color: var(--primary-color);
}

.feature-icon:hover::before {
  left: 100%;
}

.icon-wrapper {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
  box-shadow: 0 3px 8px rgba(249, 168, 37, 0.3);
  transition: transform 0.3s ease;
}

.feature-icon:hover .icon-wrapper {
  transform: rotate(360deg);
}

.feature-icon .el-icon {
  font-size: 20px;
  color: white;
}

.feature-icon > span {
  font-size: 13px;
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 0.2rem;
}

.feature-desc {
  font-size: 11px;
  color: var(--text-secondary);
  font-weight: 400;
  opacity: 0.8;
}

.illustration-text {
  text-align: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(255, 253, 245, 0.8), rgba(255, 248, 225, 0.7));
  backdrop-filter: blur(15px);
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 420px;
  border: 2px solid rgba(249, 168, 37, 0.3);
  position: relative;
  overflow: hidden;
}

.illustration-text::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: conic-gradient(from 0deg, transparent, rgba(249, 168, 37, 0.1), transparent);
  animation: rotate 10s linear infinite;
}

.illustration-text > * {
  position: relative;
  z-index: 1;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

.illustration-text h3 {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--primary-dark);
  margin-bottom: 0.8rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.illustration-text p {
  font-size: 1rem;
  line-height: 1.5;
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

/* --- 安全徽章 --- */
.safety-badges {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.safety-badge {
  background: var(--success-color);
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
  transition: transform 0.3s ease;
  cursor: default;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.safety-badge:hover {
  transform: scale(1.1);
}

/* --- 右侧表单区域样式 --- */
.form-pane {
  flex: 0.8;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 1.5rem;
  background-color: #F4E9D6;
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 2;
}

.themed-login-box {
  width: 100%;
  max-width: 380px;
  animation-duration: 0.6s;
  background-color: rgba(255, 253, 245, 0.8);
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.title-section {
  text-align: center;
  margin-bottom: 1.5rem;
}

.icon-container {
  width: 60px;
  height: 60px;
  margin: 0 auto 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary-light), #FFF);
  border: 2px solid var(--primary-color);
  border-radius: 16px;
  box-shadow: 0 6px 15px rgba(249, 168, 37, 0.3);
  transform-origin: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.icon-container:hover {
  transform: rotate(10deg) scale(1.1);
  box-shadow: 0 12px 30px rgba(249, 168, 37, 0.4);
}

.platform-logo {
  font-size: 28px;
  color: var(--primary-color);
  z-index: 2;
  position: relative;
}

/* --- 闪烁星星效果 --- */
.sparkles {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.sparkle {
  position: absolute;
  font-size: 12px;
  animation: sparkle 2s infinite;
}

.sparkle-1 {
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.sparkle-2 {
  top: 20%;
  right: 15%;
  animation-delay: 0.7s;
}

.sparkle-3 {
  bottom: 15%;
  left: 20%;
  animation-delay: 1.4s;
}

@keyframes sparkle {
  0%, 100% {
    opacity: 0;
    transform: scale(0.5);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

.main-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--primary-dark);
  margin-bottom: 0.3rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.subtitle {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 0.8rem;
  font-weight: 500;
}

/* 表单样式 */
.login-form-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
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
  margin-top: 1.5rem;
}

.footer-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.footer-content > span {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.footer-icons {
  display: flex;
  gap: 0.5rem;
  font-size: 1.2rem;
}

.footer-icons span {
  animation: bounce 2s infinite;
}

.footer-icons span:nth-child(1) { animation-delay: 0s; }
.footer-icons span:nth-child(2) { animation-delay: 0.2s; }
.footer-icons span:nth-child(3) { animation-delay: 0.4s; }
.footer-icons span:nth-child(4) { animation-delay: 0.6s; }

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