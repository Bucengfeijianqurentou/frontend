import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login, register, getUserInfo } from '@/api/user'
import { setToken, removeToken } from '@/utils/auth'
import { ElMessage } from 'element-plus'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const token = ref('')

  // 计算属性：获取用户角色
  const userRole = computed(() => user.value?.role || '')

  // 判断是否具有特定角色
  const hasRole = (role) => userRole.value === role

  // 判断是否为管理员
  const isAdmin = computed(() => userRole.value === 'ADMIN')
  
  // 判断是否为监管人员
  const isInspector = computed(() => userRole.value === 'INSPECTOR')
  
  // 判断是否为食堂工作人员
  const isStaff = computed(() => userRole.value === 'STAFF')

  // 登录
  const userLogin = async (loginForm) => {
    try {
      const res = await login(loginForm)
      if (res.code === 200 && res.data) {
        user.value = res.data.user
        token.value = res.data.token
        setToken(res.data.token)
        return true
      }
      return false
    } catch (error) {
      ElMessage.error(error.response?.data?.message || '登录失败')
      return false
    }
  }

  // 注册
  const userRegister = async (registerForm) => {
    try {
      const res = await register(registerForm)
      if (res.code === 200 && res.data) {
        ElMessage.success('注册成功')
        return true
      }
      return false
    } catch (error) {
      ElMessage.error(error.response?.data?.message || '注册失败')
      return false
    }
  }

  // 获取用户信息
  const getUserInfoAction = async () => {
    try {
      const res = await getUserInfo()
      if (res.code === 200 && res.data) {
        user.value = res.data
        return true
      }
      return false
    } catch (error) {
      ElMessage.error(error.response?.data?.message || '获取用户信息失败')
      return false
    }
  }

  // 登出
  const logout = () => {
    user.value = null
    token.value = ''
    removeToken()
  }

  return {
    user,
    token,
    userRole,
    hasRole,
    isAdmin,
    isInspector,
    isStaff,
    userLogin,
    userRegister,
    getUserInfoAction,
    logout
  }
}) 