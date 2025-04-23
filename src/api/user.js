import request from '../utils/request'

// 用户登录
export function login(data) {
  return request({
    url: '/api/user/login',
    method: 'post',
    data
  })
}

// 用户注册
export function register(data) {
  return request({
    url: '/api/user/register',
    method: 'post',
    data
  })
}

// 获取用户信息
export function getUserInfo() {
  return request({
    url: '/api/user/info',
    method: 'get'
  })
}

// 根据ID获取用户信息
export function getUserById(id) {
  return request({
    url: `/api/user/${id}`,
    method: 'get'
  })
}

// 获取用户列表
export function getUserList(params) {
  return request({
    url: '/api/user',
    method: 'get',
    params
  })
}

// 获取用户总数
export function getUserCount() {
  return request({
    url: '/api/user/count',
    method: 'get'
  })
}

// 切换用户状态（启用/禁用）
export function toggleUserStatus(id, status) {
  return request({
    url: `/api/user/${id}/status/${status}`,
    method: 'put'
  })
}

// 更新用户信息
export function updateUser(id, data) {
  return request({
    url: `/api/user/${id}`,
    method: 'put',
    data
  })
}

// 删除用户
export function deleteUser(id) {
  return request({
    url: `/api/user/${id}`,
    method: 'delete'
  })
} 