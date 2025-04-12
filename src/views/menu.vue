<template>
  <div class="p-4">
    <el-card class="w-full mb-4">
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <el-icon class="mr-2 text-blue-500 text-xl"><Memo /></el-icon>
            <span class="text-lg font-medium">菜单管理</span>
          </div>
          <el-button type="primary" @click="handleAddMenu">
            <el-icon class="mr-1"><Plus /></el-icon>新增菜单
          </el-button>
        </div>
      </template>

      <!-- 搜索区域 -->
      <div class="mb-4 bg-gray-50 p-4 rounded-md">
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            :shortcuts="dateShortcuts"
            style="width: 100%"
          />
          
          <el-select
            v-model="searchForm.mealType"
            placeholder="餐次类型"
            clearable
            @clear="handleSearch"
            style="width: 100%"
          >
            <el-option label="早餐" value="BREAKFAST" />
            <el-option label="午餐" value="LUNCH" />
            <el-option label="晚餐" value="DINNER" />
          </el-select>
        </div>
        
        <div class="flex justify-end mt-4">
          <el-button type="primary" @click="handleSearch">
            <el-icon class="mr-1"><Search /></el-icon>搜索
          </el-button>
          <el-button @click="resetSearch">
            <el-icon class="mr-1"><Refresh /></el-icon>重置
          </el-button>
        </div>
      </div>

      <!-- 菜单列表 -->
      <el-table
        :data="menuList"
        border
        stripe
        v-loading="loading"
        class="w-full"
        :header-cell-style="{
          background: '#f8fafc',
          color: '#475569',
          fontWeight: 600
        }"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="菜单日期" width="120">
          <template #default="{ row }">
            {{ formatDate(row.menuDate) }}
          </template>
        </el-table-column>
        <el-table-column label="餐次" width="100">
          <template #default="{ row }">
            <el-tag :type="getMealTypeTag(row.mealType)">
              {{ row.mealType }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="dishes" label="菜品列表" min-width="250" show-overflow-tooltip />
        <el-table-column label="菜单图片" width="120">
          <template #default="{ row }">
            <el-image
              v-if="row.imagePath"
              :src="getImageUrl(row.imagePath)"
              fit="cover"
              style="width: 60px; height: 60px"
              :preview-src-list="[getImageUrl(row.imagePath)]"
            />
            <el-icon v-else class="text-gray-400"><Picture /></el-icon>
          </template>
        </el-table-column>
        <el-table-column prop="userRealname" label="创建人" width="120" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '1' ? 'success' : 'warning'">
              {{ row.status === '1' ? '已发放' : '未发放' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <div class="flex gap-2">
              <el-button size="small" type="primary" @click="handleEdit(row)" plain>
                <el-icon><Edit /></el-icon>
                编辑
              </el-button>
              <el-button 
                size="small" 
                :type="row.status === '1' ? 'warning' : 'success'" 
                @click="handleChangeStatus(row)"
                plain
              >
                {{ row.status === '1' ? '撤回' : '发放' }}
              </el-button>
              <el-button size="small" type="danger" @click="handleDelete(row)" plain>
                <el-icon><Delete /></el-icon>
                删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="flex justify-end mt-4">
        <el-pagination
          :current-page="currentPage"
          :page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          background
        />
      </div>
    </el-card>

    <!-- 新增/编辑菜单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增菜单' : '编辑菜单'"
      width="600px"
      destroy-on-close
    >
      <el-form
        ref="menuFormRef"
        :model="menuForm"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="菜单日期" prop="menuDate">
          <el-date-picker
            v-model="menuForm.menuDate"
            type="date"
            placeholder="选择日期"
            style="width: 100%"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>

        <el-form-item label="餐次" prop="mealType">
          <el-select v-model="menuForm.mealType" placeholder="请选择餐次" style="width: 100%">
            <el-option label="早餐" value="BREAKFAST" />
            <el-option label="午餐" value="LUNCH" />
            <el-option label="晚餐" value="DINNER" />
          </el-select>
        </el-form-item>

        <el-form-item label="菜品列表" prop="dishes">
          <el-input
            v-model="menuForm.dishes"
            type="textarea"
            :rows="4"
            placeholder="请输入菜品列表，多个菜品请用逗号或换行分隔"
          />
        </el-form-item>

        <el-form-item label="菜单状态" prop="status">
          <el-radio-group v-model="menuForm.status">
            <el-radio label="0">未发放</el-radio>
            <el-radio label="1">已发放</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="菜单图片">
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="handleUploadSuccess"
            :before-upload="beforeUpload"
            :http-request="customUpload"
          >
            <img v-if="menuForm.imagePath" :src="getImageUrl(menuForm.imagePath)" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm" :loading="submitting">
            {{ dialogType === 'add' ? '新增' : '保存' }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Memo, Plus, Edit, Delete, Search, Refresh, Picture } from '@element-plus/icons-vue'
import { useMenuApi } from '@/api/menu'
import { useUserStore } from '@/stores/user'

const menuApi = useMenuApi()
const userStore = useUserStore()

// 表格数据相关
const loading = ref(false)
const menuList = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 搜索相关
const searchForm = ref({
  dateRange: [],
  mealType: ''
})

const dateShortcuts = [
  {
    text: '最近一周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    }
  },
  {
    text: '最近一个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    }
  },
  {
    text: '最近三个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    }
  }
]

// 对话框相关
const dialogVisible = ref(false)
const dialogType = ref('add')
const menuFormRef = ref(null)
const submitting = ref(false)
const menuForm = reactive({
  id: null,
  menuDate: '',
  mealType: '',
  dishes: '',
  userId: '',
  userRealname: '',
  status: '0',
  imagePath: ''
})

// 上传相关
const uploadUrl = import.meta.env.VITE_API_BASE_URL + '/api/files/upload'

// 表单验证规则
const rules = {
  menuDate: [
    { required: true, message: '请选择菜单日期', trigger: 'change' }
  ],
  mealType: [
    { required: true, message: '请选择餐次', trigger: 'change' }
  ],
  dishes: [
    { required: true, message: '请输入菜品列表', trigger: 'blur' }
  ]
}

// 初始化
onMounted(() => {
  fetchMenuList()
})

// 获取菜单列表
const fetchMenuList = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      size: pageSize.value
    }
    
    let res
    
    if (searchForm.value.dateRange?.length === 2 || searchForm.value.mealType) {
      // 搜索查询
      const searchParams = {
        page: currentPage.value,
        size: pageSize.value,
        mealType: searchForm.value.mealType || undefined
      }
      
      if (searchForm.value.dateRange?.length === 2) {
        searchParams.startDate = searchForm.value.dateRange[0]
        searchParams.endDate = searchForm.value.dateRange[1]
      }
      
      res = await menuApi.searchMenus(
        currentPage.value,
        pageSize.value,
        searchParams.startDate,
        searchParams.endDate,
        searchParams.mealType
      )
    } else {
      // 默认查询
      res = await menuApi.getMenus(currentPage.value, pageSize.value)
    }
    
    if (res && res.data) {
      menuList.value = res.data.records || []
      total.value = res.data.total || 0
    }
  } catch (error) {
    console.error('获取菜单列表失败:', error)
    ElMessage.error('获取菜单列表失败')
  } finally {
    loading.value = false
  }
}

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1
  fetchMenuList()
}

// 重置搜索
const resetSearch = () => {
  searchForm.value = {
    dateRange: [],
    mealType: ''
  }
  currentPage.value = 1
  fetchMenuList()
}

// 分页处理
const handleSizeChange = (size) => {
  pageSize.value = size
  fetchMenuList()
}

const handleCurrentChange = (page) => {
  currentPage.value = page
  fetchMenuList()
}

// 新增菜单
const handleAddMenu = () => {
  dialogType.value = 'add'
  resetForm()
  
  // 设置创建人信息
  if (userStore.user) {
    menuForm.userId = userStore.user.id
    menuForm.userRealname = userStore.user.realName || userStore.user.username
  }
  
  dialogVisible.value = true
}

// 编辑菜单
const handleEdit = (row) => {
  dialogType.value = 'edit'
  resetForm()
  
  // 填充表单数据
  Object.keys(menuForm).forEach(key => {
    if (row[key] !== undefined) {
      menuForm[key] = row[key]
    }
  })
  
  dialogVisible.value = true
}

// 重置表单
const resetForm = () => {
  menuForm.id = null
  menuForm.menuDate = ''
  menuForm.mealType = ''
  menuForm.dishes = ''
  menuForm.userId = ''
  menuForm.userRealname = ''
  menuForm.status = '0'
  menuForm.imagePath = ''
  
  if (menuFormRef.value) {
    menuFormRef.value.resetFields()
  }
}

// 上传处理
const customUpload = async (options) => {
  try {
    const res = await menuApi.uploadMenuImage(options.file)
    if (res.code === 200 && res.data) {
      menuForm.imagePath = res.data
      options.onSuccess(res)
    } else {
      options.onError(new Error(res.message || '上传失败'))
    }
  } catch (error) {
    options.onError(error)
    ElMessage.error('上传图片失败')
  }
}

// 上传成功
const handleUploadSuccess = (res) => {
  if (res.code === 200 && res.data) {
    menuForm.imagePath = res.data
  }
}

// 上传前检查
const beforeUpload = (file) => {
  const isImage = /^image\//.test(file.type)
  const isLt2M = file.size / 1024 / 1024 < 2
  
  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
    return false
  }
  
  return true
}

// 提交表单
const submitForm = async () => {
  if (!menuFormRef.value) return
  
  await menuFormRef.value.validate(async (valid) => {
    if (!valid) {
      return
    }
    
    submitting.value = true
    try {
      let res
      
      // 设置创建人信息
      if (dialogType.value === 'add' && userStore.user) {
        menuForm.userId = userStore.user.id
        menuForm.userRealname = userStore.user.realName || userStore.user.username
      }
      
      if (dialogType.value === 'add') {
        res = await menuApi.createMenu(menuForm)
      } else {
        res = await menuApi.updateMenu(menuForm.id, menuForm)
      }
      
      if (res.code === 200 && res.data) {
        ElMessage.success(dialogType.value === 'add' ? '新增菜单成功' : '更新菜单成功')
        dialogVisible.value = false
        fetchMenuList()
      } else {
        ElMessage.error(res.message || (dialogType.value === 'add' ? '新增菜单失败' : '更新菜单失败'))
      }
    } catch (error) {
      console.error(dialogType.value === 'add' ? '新增菜单失败:' : '更新菜单失败:', error)
      ElMessage.error(dialogType.value === 'add' ? '新增菜单失败' : '更新菜单失败')
    } finally {
      submitting.value = false
    }
  })
}

// 删除菜单
const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该菜单吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const res = await menuApi.deleteMenu(row.id)
      if (res.code === 200 && res.data) {
        ElMessage.success('删除菜单成功')
        fetchMenuList()
      } else {
        ElMessage.error(res.message || '删除菜单失败')
      }
    } catch (error) {
      console.error('删除菜单失败:', error)
      ElMessage.error('删除菜单失败')
    }
  }).catch(() => {})
}

// 修改菜单状态
const handleChangeStatus = (row) => {
  const newStatus = row.status === '1' ? '0' : '1'
  const statusText = newStatus === '1' ? '发放' : '撤回'
  
  ElMessageBox.confirm(`确定要${statusText}该菜单吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const res = await menuApi.updateMenuStatus(row.id, newStatus)
      if (res.code === 200 && res.data) {
        ElMessage.success(`${statusText}菜单成功`)
        fetchMenuList()
      } else {
        ElMessage.error(res.message || `${statusText}菜单失败`)
      }
    } catch (error) {
      console.error(`${statusText}菜单失败:`, error)
      ElMessage.error(`${statusText}菜单失败`)
    }
  }).catch(() => {})
}

// 工具函数
const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString()
}

const getMealTypeTag = (type) => {
  switch (type) {
    case 'BREAKFAST':
    case '早餐':
      return 'success'
    case 'LUNCH':
    case '午餐':
      return 'warning'
    case 'DINNER':
    case '晚餐':
      return 'danger'
    default:
      return 'info'
  }
}

const getImageUrl = (path) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${import.meta.env.VITE_API_BASE_URL}${path}`
}
</script>

<style scoped>
.avatar-uploader {
  width: 178px;
  height: 178px;
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader:hover {
  border-color: var(--el-color-primary);
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
  object-fit: cover;
}
</style> 