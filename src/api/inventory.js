import request from '@/utils/request'

export function useInventoryApi() {
  return {
    // 获取库存列表
    listInventory(page, size) {
      return request({
        url: '/api/inventory',
        method: 'get',
        params: { page, size }
      })
    },

    // 获取库存详情
    getInventoryById(id) {
      return request({
        url: `/api/inventory/${id}`,
        method: 'get'
      })
    },

    // 根据批次号查询库存
    getInventoryByBatchNumber(batchNumber) {
      return request({
        url: `/api/inventory/batch/${batchNumber}`,
        method: 'get'
      })
    },
    
    // 获取库存详情（包含食品名称）
    getInventoryDetail(batchNumber) {
      return request({
        url: `/api/inventory/detail/${batchNumber}`,
        method: 'get'
      })
    },

    // 根据食品ID查询库存
    getInventoryByFoodId(foodId, page, size) {
      return request({
        url: `/api/inventory/food/${foodId}`,
        method: 'get',
        params: { page, size }
      })
    },

    // 更新库存数量
    updateQuantity(id, quantity) {
      return request({
        url: `/api/inventory/${id}/quantity/${quantity}`,
        method: 'put'
      })
    },

    // 获取库存不足的记录
    getLowStock(threshold, page, size) {
      return request({
        url: '/api/inventory/low-stock',
        method: 'get',
        params: { threshold, page, size }
      })
    },

    // 获取所有有效库存记录（剩余数量大于0）
    getAvailableInventory() {
      return request({
        url: '/api/inventory/available',
        method: 'get'
      })
    },

    // 扫码入库接口
    scanInventory(batchNumber) {
      return request({
        url: '/api/inventory/scan',
        method: 'post',
        data: { batchNumber }
      })
    }
  }
}