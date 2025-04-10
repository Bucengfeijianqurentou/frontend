import request from '@/utils/request'

export function useSupplierApi() {
  return {
    // 分页查询供应商列表
    pageSupplier(page, size, name, contact) {
      return request({
        url: '/api/supplier/page',
        method: 'get',
        params: {
          page,
          size,
          name,
          contact
        }
      })
    },

    // 创建供应商
    createSupplier(data) {
      return request({
        url: '/api/supplier',
        method: 'post',
        data
      })
    },

    // 更新供应商
    updateSupplier(id, data) {
      return request({
        url: `/api/supplier/${id}`,
        method: 'put',
        data
      })
    },

    // 删除供应商
    deleteSupplier(id) {
      return request({
        url: `/api/supplier/${id}`,
        method: 'delete'
      })
    }
  }
} 