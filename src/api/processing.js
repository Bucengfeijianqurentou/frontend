import request from '@/utils/request'

export function useProcessingApi() {
  return {
    // 创建加工记录
    createProcessing(data) {
      return request({
        url: '/api/processings/create',
        method: 'post',
        data
      })
    },

    // 获取加工记录列表
    listProcessings(page, size) {
      return request({
        url: '/api/processings',
        method: 'get',
        params: { page, size }
      })
    },

    // 获取加工记录详情
    getProcessingById(id) {
      return request({
        url: `/api/processings/${id}`,
        method: 'get'
      })
    },

    // 根据采购记录ID查询加工记录
    getProcessingByPurchaseId(purchaseId, page, size) {
      return request({
        url: `/api/processings/purchase/${purchaseId}`,
        method: 'get',
        params: { page, size }
      })
    },

    // 根据加工人员ID查询加工记录
    getProcessingByProcessorId(processorId, page, size) {
      return request({
        url: `/api/processings/processor/${processorId}`,
        method: 'get',
        params: { page, size }
      })
    },

    // 根据时间范围查询加工记录
    getProcessingByTimeRange(startTime, endTime, page, size) {
      return request({
        url: '/api/processings/time',
        method: 'get',
        params: { startTime, endTime, page, size }
      })
    },

    // 根据卫生条件查询加工记录
    getProcessingByHygieneCondition(condition, page, size) {
      return request({
        url: `/api/processings/hygiene/${condition}`,
        method: 'get',
        params: { page, size }
      })
    },

    // 根据加工方法查询加工记录
    getProcessingByMethod(method, page, size) {
      return request({
        url: '/api/processings/method',
        method: 'get',
        params: { method, page, size }
      })
    },

    // 更新加工记录
    updateProcessing(id, data) {
      return request({
        url: `/api/processings/${id}`,
        method: 'put',
        data
      })
    },

    // 删除加工记录
    deleteProcessing(id) {
      return request({
        url: `/api/processings/${id}`,
        method: 'delete'
      })
    }
  }
} 