import request from '@/utils/request'

/**
 * 获取区块高度
 * @returns {Promise<any>}
 */
export function getBlockNumber() {
  return request({
    url: '/chain/getBlockNumber',
    method: 'get'
  })
}

/**
 * 获取交易总数
 * @returns {Promise<any>}
 */
export function getTransactionTotal() {
  return request({
    url: '/chain/getTransactionTotal',
    method: 'get'
  })
}

/**
 * 获取所有员工信息
 * @returns {Promise<any>}
 */
export function getAllStaff() {
  return request({
    url: '/api/user',
    method: 'get',
    params: {
      role: 'STAFF',
      size: 100  // 获取较多记录以便轮播
    }
  })
} 