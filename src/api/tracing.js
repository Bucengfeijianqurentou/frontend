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
    },
    
    /**
     * 根据日期和餐次获取菜品列表
     * 
     * @param {string} date 日期 (YYYY-MM-DD)
     * @param {string} mealType 餐次类型
     * @returns {Promise} 菜品列表
     */
    getDishes(date, mealType) {
      return request({
        url: '/api/tracing/dishes',
        method: 'get',
        params: {
          date,
          mealType
        }
      })
    }
  }
}