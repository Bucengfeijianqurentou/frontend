import request from '@/utils/request'

export function useDistributionApi() {
  return {
    // 获取发放记录列表（带菜单信息）
    getDistributions(page, size, params = {}) {
      return request({
        url: '/api/distributions/with-menu',
        method: 'get',
        params: {
          page,
          size,
          ...params
        }
      })
    },

    // 根据ID获取发放记录详情（带菜单信息）
    getDistributionById(id) {
      return request({
        url: `/api/distributions/with-menu/${id}`,
        method: 'get'
      })
    },

    // 创建发放记录
    createDistribution(data) {
      return request({
        url: '/api/distributions',
        method: 'post',
        data
      })
    },

    // 更新发放记录
    updateDistribution(id, data) {
      return request({
        url: `/api/distributions/${id}`,
        method: 'put',
        data
      })
    },

    // 删除发放记录
    deleteDistribution(id) {
      return request({
        url: `/api/distributions/${id}`,
        method: 'delete'
      })
    },

    // 根据时间范围查询发放记录
    searchByTimeRange(page, size, startTime, endTime) {
      return request({
        url: '/api/distributions/with-menu',
        method: 'get',
        params: {
          page,
          size,
          startTime,
          endTime
        }
      })
    },

    // 根据菜单ID查询发放记录
    searchByMenuId(page, size, menuId) {
      return request({
        url: '/api/distributions/with-menu',
        method: 'get',
        params: {
          page,
          size,
          menuId
        }
      })
    }
  }
} 