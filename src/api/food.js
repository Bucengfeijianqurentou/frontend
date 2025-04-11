import request from '@/utils/request'

export function useFoodApi() {
  return {
    // 获取食品列表
    listFoods(page, size) {
      return request({
        url: '/api/foods',
        method: 'get',
        params: { page, size }
      })
    },

    // 获取食品详情
    getFoodById(id) {
      return request({
        url: `/api/foods/${id}`,
        method: 'get'
      }).then(response => {
        // 包装响应为统一格式
        return {
          code: 200,
          data: response
        }
      }).catch(error => {
        return {
          code: 500,
          message: error.message
        }
      })
    },

    // 根据名称查询食品
    getFoodByName(name) {
      return request({
        url: `/api/foods/name/${name}`,
        method: 'get'
      }).then(response => {
        // 包装响应为统一格式
        return {
          code: 200,
          data: response
        }
      }).catch(error => {
        return {
          code: 500,
          message: error.message
        }
      })
    }
  }
} 