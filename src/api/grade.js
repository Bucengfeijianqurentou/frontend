import request from '@/utils/request'

export function useGradeApi() {
  return {
    // 分页查询年级列表
    pageGrade(page, size, grade) {
      return request({
        url: '/api/grades',
        method: 'get',
        params: {
          page,
          size,
          grade
        }
      })
    },

    // 获取所有年级列表（不分页）
    getAllGrades() {
      return request({
        url: '/api/grades/all',
        method: 'get'
      })
    },

    // 创建年级
    createGrade(data) {
      return request({
        url: '/api/grades',
        method: 'post',
        data
      })
    },

    // 更新年级
    updateGrade(id, data) {
      return request({
        url: `/api/grades/${id}`,
        method: 'put',
        data
      })
    },

    // 删除年级
    deleteGrade(id) {
      return request({
        url: `/api/grades/${id}`,
        method: 'delete'
      })
    }
  }
} 