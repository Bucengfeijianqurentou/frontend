import request from '@/utils/request'

export function usePurchaseApi() {
  return {
    // 创建采购单（同时创建食品和库存记录）
    createPurchase(data) {
      return request({
        url: '/api/purchases/create',
        method: 'post',
        data
      })
    },

    // 获取采购单列表
    listPurchases(page, size, keyword) {
      return request({
        url: '/api/purchases',
        method: 'get',
        params: { page, size, keyword }
      })
    },

    // 获取采购单详情
    getPurchaseById(id) {
      return request({
        url: `/api/purchases/${id}`,
        method: 'get'
      })
    },

    // 根据批次号查询采购记录
    getPurchaseByBatchNumber(batchNumber) {
      return request({
        url: `/api/purchases/batch/${batchNumber}`,
        method: 'get'
      })
    },

    // 根据日期范围查询采购记录
    getPurchaseByDateRange(startDate, endDate, page, size) {
      return request({
        url: '/api/purchases/date',
        method: 'get',
        params: { startDate, endDate, page, size }
      })
    },

    // 根据供应商查询采购记录
    getPurchaseBySupplier(supplier, page, size) {
      return request({
        url: `/api/purchases/supplier/${supplier}`,
        method: 'get',
        params: { page, size }
      })
    },

    //根据id删除采购记录
    deletePurchase(id){
      return request({
        url: `/api/purchases/${id}`,
        method:'delete',
      })
    }

  }
} 