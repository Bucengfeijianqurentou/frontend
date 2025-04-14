import request from '@/utils/request'

/**
 * 溯源查询API
 */
export function useTracingApi() {
  return {
    /**
     * 执行溯源查询
     * 
     * @param {Object} data 查询参数，包含日期、餐次和菜品名称
     * @returns {Promise} 查询结果
     */
    queryTracing(data) {
      return request({
        url: '/api/tracing/query',
        method: 'post',
        data
      })
    }
  }
} 