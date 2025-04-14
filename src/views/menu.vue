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
            <el-option label="早餐" value="早餐" />
            <el-option label="午餐" value="午餐" />
            <el-option label="晚餐" value="晚餐" />
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
        <el-table-column label="使用食品" width="150">
          <template #default="{ row }">
            <div v-if="row.processIds">
              <el-tag size="small" type="success">{{ row.processIds.split(',').length }}个食品</el-tag>
              <el-button 
                link 
                type="primary" 
                size="small" 
                @click="viewProcessingDetail(row.processIds)"
              >查看详情</el-button>
            </div>
            <span v-else class="text-gray-400">无</span>
          </template>
        </el-table-column>
        <el-table-column label="菜单图片" width="120">
          <template #default="{ row }">
            <div class="flex justify-center">
              <el-image
                v-if="row.imagePath"
                :src="getImageUrl(row.imagePath)"
                fit="cover"
                style="width: 60px; height: 60px; border-radius: 4px; cursor: pointer;"
                @click="handlePreviewImage(row.imagePath)"
              />
              <el-icon v-else class="text-gray-400"><Picture /></el-icon>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="userRealname" label="创建人" width="120" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusTag(row.status)">
              {{ getStatusText(row.status) }}
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
                :type="row.status === '2' ? 'warning' : 'success'" 
                @click="handleChangeStatus(row)"
                plain
                :disabled="row.status === '0'"
                :title="row.status === '0' ? '菜单待审查，无法发放' : ''"
              >
                {{ row.status === '2' ? '撤回' : '发放' }}
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
            <el-option label="早餐" value="早餐" />
            <el-option label="午餐" value="午餐" />
            <el-option label="晚餐" value="晚餐" />
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

        <el-form-item label="食品选择" prop="processIds">
          <div class="mb-2 text-gray-500 text-sm">请选择菜单所使用的食品（可多选）</div>
          <el-select
            v-model="menuForm.processIds"
            multiple
            filterable
            placeholder="请选择食品"
            style="width: 100%"
            :loading="processingListLoading"
          >
            <el-option
              v-for="item in processingList"
              :key="item.id"
              :label="`${item.method} (批次: ${item.batchNumber})`"
              :value="item.id"
            >
              <div class="flex items-center">
                <span class="mr-2">{{ item.method }}</span>
                <el-tag size="small" type="info">批次: {{ item.batchNumber }}</el-tag>
                <span class="ml-auto text-gray-400 text-xs">{{ formatProcessingTime(item.processingTime) }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="使用食品" v-if="dialogType === 'edit' && menuForm.processIds && menuForm.processIds.length > 0">
          <div class="text-gray-500 text-sm mb-1">此菜单使用的食品</div>
          <div class="flex flex-wrap gap-2">
            <el-tag 
              v-for="id in menuForm.processIds" 
              :key="id"
              type="success"
              effect="light"
            >
              {{ getProcessingName(id) }}
            </el-tag>
          </div>
        </el-form-item>

        <el-form-item label="菜单状态" v-if="dialogType === 'edit' && userRole === 'ADMIN'">
          <el-radio-group v-model="menuForm.status">
            <el-radio label="0">待审查</el-radio>
            <el-radio label="1">可发放</el-radio>
            <el-radio label="2">已发放</el-radio>
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
          <el-button type="primary" @click="handleSubmit" :loading="submitting">
            {{ dialogType === 'add' ? '新增' : '保存' }}
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 图片预览对话框 -->
    <el-dialog
      v-model="previewVisible"
      title="图片预览"
      width="50%"
      destroy-on-close
      center
      :close-on-click-modal="true"
      class="preview-dialog"
    >
      <div class="image-preview-container">
        <el-image
          :src="previewImage"
          fit="contain"
          :preview-src-list="[previewImage]"
          :initial-index="0"
          preview-teleported
        />
      </div>
    </el-dialog>

    <!-- 菜单发放对话框 -->
    <el-dialog
      v-model="distributeDialogVisible"
      title="发放菜单"
      width="500px"
      destroy-on-close
    >
      <el-form
        ref="distributeFormRef"
        :model="distributeForm"
        :rules="distributeRules"
        label-width="80px"
      >
        <el-form-item label="菜单信息" class="mb-4">
          <div class="grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded">
            <div>
              <strong>日期：</strong>{{ formatDate(currentMenu.menuDate) }}
            </div>
            <div>
              <strong>餐次：</strong>
              <el-tag :type="getMealTypeTag(currentMenu.mealType)" size="small">
                {{ currentMenu.mealType }}
              </el-tag>
            </div>
            <div class="col-span-2">
              <strong>菜品：</strong>{{ currentMenu.dishes }}
            </div>
          </div>
        </el-form-item>
        <el-form-item label="发放对象" prop="recipients" required>
          <el-select
            v-model="distributeForm.recipients"
            multiple
            filterable
            placeholder="请选择发放年级"
            style="width: 100%"
          >
            <el-option
              v-for="grade in gradeList"
              :key="grade.id"
              :label="grade.grade"
              :value="grade.grade"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="distributeDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitDistributeForm" :loading="distributingMenu">
            确认发放
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 食品详情对话框 -->
    <el-dialog
      v-model="processingDetailVisible"
      title="菜单使用的食品"
      width="700px"
      destroy-on-close
    >
      <div v-loading="processingDetailLoading">
        <el-empty v-if="selectedProcessings.length === 0" description="暂无食品信息" />
        <div v-else class="space-y-4">
          <div v-for="item in selectedProcessings" :key="item.id" 
            class="border rounded-md p-4 hover:shadow-md transition-shadow"
          >
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <h3 class="text-lg font-bold mb-2 flex items-center">
                  <span>{{ item.method }}</span>
                  <el-tag class="ml-2" size="small" type="success">批次号: {{ item.batchNumber }}</el-tag>
                </h3>
                <div class="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <span class="text-gray-500">加工时间:</span>
                    <span class="ml-2">{{ formatProcessingTime(item.processingTime) }}</span>
                  </div>
                  <div>
                    <span class="text-gray-500">加工数量:</span>
                    <span class="ml-2">{{ item.quantity }}</span>
                  </div>
                  <div>
                    <span class="text-gray-500">加工人:</span>
                    <span class="ml-2">{{ item.processorName }}</span>
                  </div>
                  <div>
                    <span class="text-gray-500">卫生条件:</span>
                    <span class="ml-2">
                      <el-tag :type="getHygieneTag(item.hygieneCondition)" size="small">
                        {{ getHygieneText(item.hygieneCondition) }}
                      </el-tag>
                    </span>
                  </div>
                </div>
              </div>
              <div class="w-24 h-24 flex-shrink-0">
                <el-image
                  v-if="item.imagePath"
                  :src="getImageUrl(item.imagePath)"
                  fit="cover"
                  class="w-full h-full rounded-md object-cover"
                  :preview-src-list="[getImageUrl(item.imagePath)]"
                />
                <div v-else class="w-full h-full bg-gray-100 flex items-center justify-center rounded-md">
                  <el-icon class="text-gray-400 text-xl"><Picture /></el-icon>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Memo, Plus, Edit, Delete, Search, Refresh, Picture } from '@element-plus/icons-vue'
import { useMenuApi } from '@/api/menu'
import { useGradeApi } from '@/api/grade'
import { useProcessingApi } from '@/api/processing'
import { useUserStore } from '@/stores/user'

const menuApi = useMenuApi()
const gradeApi = useGradeApi()
const processingApi = useProcessingApi()
const userStore = useUserStore()

// 图片预览相关
const previewVisible = ref(false)
const previewImage = ref('')

// 菜单发放相关
const distributeDialogVisible = ref(false)
const distributeFormRef = ref(null)
const distributingMenu = ref(false)
const distributeForm = reactive({
  recipients: []
})
const distributeRules = {
  recipients: [
    { required: true, message: '请选择发放年级', trigger: 'change' }
  ]
}
const currentMenu = ref({})
const gradeList = ref([])

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
  imagePath: '',
  processIds: []
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

// 获取用户角色
const userRole = computed(() => userStore.user?.role || '')

// 加工记录相关
const processingList = ref([])
const processingListLoading = ref(false)

// 食品详情相关
const processingDetailVisible = ref(false)
const processingDetailLoading = ref(false)
const selectedProcessings = ref([])

// 初始化
onMounted(() => {
  fetchMenuList()
  fetchGradeList()
  fetchProcessingList()
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
  Object.keys(menuForm).forEach(key => {
    if (key in row) {
      menuForm[key] = row[key]
    }
  })
  
  // 处理processIds，将字符串转为数组
  if (typeof menuForm.processIds === 'string' && menuForm.processIds) {
    menuForm.processIds = menuForm.processIds.split(',').map(id => parseInt(id))
  } else {
    menuForm.processIds = []
  }
  
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
  menuForm.processIds = []
  
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
const handleSubmit = async () => {
  if (!menuFormRef.value) return
  
  await menuFormRef.value.validate(async (valid) => {
    if (!valid) return
    
    submitting.value = true
    
    try {
      // 设置创建人信息
      if (dialogType.value === 'add' && userStore.user) {
        menuForm.userId = userStore.user.id
        menuForm.userRealname = userStore.user.realName || userStore.user.username
      }
      
      // 处理processIds，将数组转为逗号分隔的字符串
      if (menuForm.processIds && menuForm.processIds.length > 0) {
        menuForm.processIds = menuForm.processIds.join(',')
      } else {
        menuForm.processIds = ''
      }
      
      // 创建或更新菜单
      const res = dialogType.value === 'add'
        ? await menuApi.createMenu(menuForm)
        : await menuApi.updateMenu(menuForm.id, menuForm)
      
      if (res.code === 200 && res.data) {
        ElMessage.success(dialogType.value === 'add' ? '创建菜单成功' : '更新菜单成功')
        dialogVisible.value = false
        fetchMenuList()
      } else {
        ElMessage.error(res.message || '操作失败')
      }
    } catch (error) {
      console.error('提交菜单失败:', error)
      ElMessage.error('提交菜单失败')
    } finally {
      submitting.value = false
      // 重置为数组形式，防止影响下次操作
      if (typeof menuForm.processIds === 'string') {
        menuForm.processIds = menuForm.processIds ? menuForm.processIds.split(',').map(id => parseInt(id)) : []
      }
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
  // 如果菜单状态是"可发放"，则打开发放对话框
  // 如果菜单状态是"已发放"，则变更为"待审查"
  if (row.status === '1') {
    // 可发放 -> 打开发放对话框
    openDistributeDialog(row)
  } else if (row.status === '2') {
    // 已发放 -> 撤回
    ElMessageBox.confirm(`确定要撤回该菜单吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      try {
        const res = await menuApi.updateMenuStatus(row.id, '0')
        if (res.code === 200 && res.data) {
          ElMessage.success('撤回菜单成功')
          fetchMenuList()
        } else {
          ElMessage.error(res.message || '撤回菜单失败')
        }
      } catch (error) {
        console.error('撤回菜单失败:', error)
        ElMessage.error('撤回菜单失败')
      }
    }).catch(() => {})
  }
}

// 工具函数
const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString()
}

// 获取菜单状态显示文本
const getStatusText = (status) => {
  switch (status) {
    case '0': return '待审查'
    case '1': return '可发放'
    case '2': return '已发放'
    default: return '未知状态'
  }
}

// 获取菜单状态标签类型
const getStatusTag = (status) => {
  switch (status) {
    case '0': return 'info'     // 待审查：灰色
    case '1': return 'warning'  // 可发放：黄色
    case '2': return 'success'  // 已发放：绿色
    default: return 'info'
  }
}

const getMealTypeTag = (type) => {
  switch (type) {
    case '早餐':
      return 'success'
    case '午餐':
      return 'warning'
    case '晚餐':
      return 'danger'
    default:
      return 'info'
  }
}

// 处理图片预览
const handlePreviewImage = (imagePath) => {
  if (!imagePath) return
  previewImage.value = getImageUrl(imagePath)
  previewVisible.value = true
}

// 关闭图片预览
const closePreview = () => {
  previewVisible.value = false
}

const getImageUrl = (path) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${import.meta.env.VITE_API_BASE_URL}${path}`
}

// 菜单发放相关
const openDistributeDialog = (row) => {
  currentMenu.value = row
  distributeForm.recipients = [] // 清空之前的选择
  distributeDialogVisible.value = true
}

const submitDistributeForm = async () => {
  if (!distributeFormRef.value) return
  
  await distributeFormRef.value.validate(async (valid) => {
    if (!valid) {
      return
    }
    
    distributingMenu.value = true
    try {
      // 调用分发接口
      const res = await menuApi.distributeMenu(currentMenu.value.id, distributeForm.recipients)
      if (res.code === 200 && res.data) {
        ElMessage.success('菜单发放成功')
        distributeDialogVisible.value = false
        fetchMenuList() // 刷新菜单列表
      } else {
        ElMessage.error(res.message || '菜单发放失败')
      }
    } catch (error) {
      console.error('菜单发放失败:', error)
      ElMessage.error('菜单发放失败')
    } finally {
      distributingMenu.value = false
    }
  })
}

// 获取年级列表
const fetchGradeList = async () => {
  try {
    const res = await gradeApi.getAllGrades()
    if (res.code === 200 && res.data) {
      gradeList.value = res.data
    }
  } catch (error) {
    console.error('获取年级列表失败:', error)
    ElMessage.error('获取年级列表失败')
  }
}

// 获取加工记录列表
const fetchProcessingList = async () => {
  processingListLoading.value = true
  try {
    const res = await processingApi.getAllProcessings()
    if (res.code === 200 && res.data) {
      processingList.value = res.data
    }
  } catch (error) {
    console.error('获取加工记录失败:', error)
    ElMessage.error('获取加工记录失败')
  } finally {
    processingListLoading.value = false
  }
}

// 格式化加工时间
const formatProcessingTime = (timeStr) => {
  if (!timeStr) return ''
  const date = new Date(timeStr)
  return date.toLocaleString()
}

// 查看加工详情
const viewProcessingDetail = async (processIds) => {
  if (!processIds) return
  
  processingDetailLoading.value = true
  try {
    const res = await processingApi.getProcessingsByIds(processIds)
    if (res.code === 200 && res.data) {
      selectedProcessings.value = res.data
      processingDetailVisible.value = true
    } else {
      ElMessage.error('获取食品详情失败')
    }
  } catch (error) {
    console.error('获取食品详情失败:', error)
    ElMessage.error('获取食品详情失败')
  } finally {
    processingDetailLoading.value = false
  }
}

// 获取食品卫生条件文本
const getHygieneText = (condition) => {
  if (!condition) return '未知'
  
  // 针对不同格式的枚举值处理
  if (typeof condition === 'object' && condition.description) {
    return condition.description
  }
  
  // 根据枚举名匹配
  switch (condition) {
    case 'GOOD': return '良好'
    case 'NORMAL': return '一般'
    case 'POOR': return '差'
    default: return '未知'
  }
}

// 获取食品卫生条件标签类型
const getHygieneTag = (condition) => {
  if (!condition) return 'info'
  
  // 针对不同格式的枚举处理
  const hygiene = typeof condition === 'object' ? condition.name : condition
  
  // 根据枚举名匹配
  switch (hygiene) {
    case 'GOOD': return 'success'
    case 'NORMAL': return 'warning'
    case 'POOR': return 'danger'
    default: return 'info'
  }
}

// 获取加工记录名称
const getProcessingName = (id) => {
  const processing = processingList.value.find(item => item.id === id)
  return processing ? `${processing.method} (批次: ${processing.batchNumber})` : `加工ID: ${id}`
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

.preview-dialog {
  /* Add your styles here */
}

.image-preview-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  max-height: 500px;
  overflow: hidden;
}

.image-preview-container :deep(.el-image) {
  max-width: 100%;
  max-height: 450px;
}
</style> 