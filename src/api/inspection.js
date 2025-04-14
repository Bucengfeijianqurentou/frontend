import request from '@/utils/request'
import { useUserStore } from '@/stores/user'

export function useInspectionApi() {
  return {
    // 分页获取检查记录
    getInspections(page, size) {
      return request({
        url: '/api/inspections',
        method: 'get',
        params: { page, size }
      })
    },

    // 根据ID获取检查记录
    getInspectionById(id) {
      return request({
        url: `/api/inspections/${id}`,
        method: 'get'
      })
    },

    // 根据监管人员ID获取检查记录
    getInspectionsByInspectorId(inspectorId, page, size) {
      return request({
        url: `/api/inspections/inspector/${inspectorId}`,
        method: 'get',
        params: { page, size }
      })
    },

    // 根据时间范围获取检查记录
    getInspectionsByTimeRange(startTime, endTime, page, size) {
      return request({
        url: '/api/inspections/time-range',
        method: 'get',
        params: { startTime, endTime, page, size }
      })
    },

    // 根据检查结果获取检查记录
    getInspectionsByResult(result, page, size) {
      return request({
        url: `/api/inspections/result/${result}`,
        method: 'get',
        params: { page, size }
      })
    },

    // 根据菜单ID获取检查记录
    getInspectionsByMenuId(menuId, page, size) {
      return request({
        url: `/api/inspections/menu/${menuId}`,
        method: 'get',
        params: { page, size }
      })
    },

    // 创建检查记录
    createInspection(data) {
      return request({
        url: '/api/inspections',
        method: 'post',
        data
      })
    },

    // 更新检查记录
    updateInspection(id, data) {
      return request({
        url: `/api/inspections/${id}`,
        method: 'put',
        data
      })
    },

    // 删除检查记录
    deleteInspection(id) {
      return request({
        url: `/api/inspections/${id}`,
        method: 'delete'
      })
    },

    // 上传监察凭证图片
    uploadInspectionImage(file) {
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