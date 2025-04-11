import request from '@/utils/request'

export function useProcessingApi() {
  return {
    // 获取加工记录列表
    listProcessings(page, size) {
      return request({
        url: '/api/processings',
        method: 'get',
        params: { page, size }
      })
    },

    // 创建加工记录
    createProcessing(data) {
      return request({
        url: '/api/processings/create',
        method: 'post',
        data
      })
    },

    // 获取加工记录详情
    getProcessingById(id) {
      return request({
        url: `/api/processings/${id}`,
        method: 'get'
      })
    },

    // 根据批次号查询加工记录
    getProcessingByBatchNumber(batchNumber, page, size) {
      return request({
        url: `/api/processings/batch/${batchNumber}`,
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

    // 上传加工图片
    uploadProcessingImage(file) {
      const formData = new FormData()
      formData.append('file', file)
      return request({
        url: '/api/files/upload',
        method: 'post',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    }
  }
}