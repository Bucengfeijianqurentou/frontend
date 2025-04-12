import request from '@/utils/request'

export function useMenuApi() {
  return {
    // 分页获取菜单列表
    getMenus(page, size) {
      return request({
        url: '/api/menu',
        method: 'get',
        params: { page, size }
      })
    },

    // 搜索菜单
    searchMenus(page, size, startDate, endDate, mealType) {
      return request({
        url: '/api/menu/search',
        method: 'get',
        params: {
          page,
          size,
          startDate,
          endDate,
          mealType
        }
      })
    },

    // 根据日期获取菜单
    getMenusByDate(date, mealType) {
      return request({
        url: '/api/menu/date',
        method: 'get',
        params: {
          date,
          mealType
        }
      })
    },

    // 根据ID获取菜单详情
    getMenuById(id) {
      return request({
        url: `/api/menu/${id}`,
        method: 'get'
      })
    },

    // 创建菜单
    createMenu(data) {
      return request({
        url: '/api/menu',
        method: 'post',
        data
      })
    },

    // 更新菜单
    updateMenu(id, data) {
      return request({
        url: `/api/menu/${id}`,
        method: 'put',
        data
      })
    },

    // 删除菜单
    deleteMenu(id) {
      return request({
        url: `/api/menu/${id}`,
        method: 'delete'
      })
    },

    // 更新菜单状态
    updateMenuStatus(id, status) {
      return request({
        url: `/api/menu/${id}/status`,
        method: 'put',
        params: { status }
      })
    },
    
    // 上传菜单图片
    uploadMenuImage(file) {
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