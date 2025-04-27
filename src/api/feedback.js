/**
 * 反馈相关API服务
 */
import request from '@/utils/request'

/**
 * 分页获取反馈列表
 * @param {Object} params 查询参数
 * @param {number} params.current 当前页码
 * @param {number} params.size 每页条数
 * @returns {Promise} 返回结果
 */
export function getFeedbackList(params) {
  return request({
    url: '/api/feedbacks/page',
    method: 'get',
    params
  })
}

/**
 * 根据ID获取反馈详情
 * @param {number} id 反馈ID
 * @returns {Promise} 返回结果
 */
export function getFeedbackDetail(id) {
  return request({
    url: `/api/feedbacks/${id}`,
    method: 'get'
  })
}

/**
 * 根据用户ID获取反馈列表
 * @param {number} userId 用户ID
 * @param {Object} params 查询参数
 * @param {number} params.current 当前页码
 * @param {number} params.size 每页条数
 * @returns {Promise} 返回结果
 */
export function getFeedbackByUserId(userId, params) {
  return request({
    url: `/api/feedbacks/user/${userId}`,
    method: 'get',
    params
  })
}

/**
 * 根据日期范围获取反馈列表
 * @param {Object} params 查询参数
 * @param {string} params.startDate 开始日期 YYYY-MM-DD
 * @param {string} params.endDate 结束日期 YYYY-MM-DD
 * @param {number} params.current 当前页码
 * @param {number} params.size 每页条数
 * @returns {Promise} 返回结果
 */
export function getFeedbackByDateRange(params) {
  return request({
    url: '/api/feedbacks/date-range',
    method: 'get',
    params
  })
}

/**
 * 获取反馈统计数据
 * @returns {Promise} 返回结果
 */
export function getFeedbackStatistics() {
  return request({
    url: '/api/feedbacks/statistics',
    method: 'get'
  })
}

/**
 * 添加反馈
 * @param {Object} data 反馈数据
 * @returns {Promise} 返回结果
 */
export function addFeedback(data) {
  return request({
    url: '/api/feedbacks',
    method: 'post',
    data
  })
}

/**
 * 更新反馈
 * @param {number} id 反馈ID
 * @param {Object} data 反馈数据
 * @returns {Promise} 返回结果
 */
export function updateFeedback(id, data) {
  return request({
    url: `/api/feedbacks/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除反馈
 * @param {number} id 反馈ID
 * @returns {Promise} 返回结果
 */
export function deleteFeedback(id) {
  return request({
    url: `/api/feedbacks/${id}`,
    method: 'delete'
  })
} 