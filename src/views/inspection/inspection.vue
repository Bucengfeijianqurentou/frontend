<template>
  <div class="p-4">
    <el-card class="w-full mb-4">
      <template #header>
        <div class="flex items-center">
          <el-icon class="mr-2 text-blue-500 text-xl"><Search /></el-icon>
          <span class="text-lg font-medium">监管检查</span>
        </div>
      </template>

      <!-- 待审查菜单列表 -->
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
                @click="viewProcessingDetail(row)"
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
          <template #default>
            <el-tag type="info">待审查</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" @click="handleInspect(row)" size="small">
              <el-icon class="mr-1"><Check /></el-icon>审查
            </el-button>
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

    <!-- 审查对话框 -->
    <el-dialog
      v-model="inspectionDialogVisible"
      title="菜单审查"
      width="600px"
      destroy-on-close
    >
      <el-form
        ref="inspectionFormRef"
        :model="inspectionForm"
        :rules="inspectionRules"
        label-width="100px"
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

        <el-form-item label="检查内容" prop="content">
          <el-input
            v-model="inspectionForm.content"
            type="textarea"
            :rows="3"
            placeholder="请输入检查内容"
          />
        </el-form-item>

        <el-form-item label="检查结果" prop="result">
          <el-radio-group v-model="inspectionForm.result">
            <el-radio label="PASS">合格</el-radio>
            <el-radio label="FAIL">不合格</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="发现问题" prop="issues">
          <el-input
            v-model="inspectionForm.issues"
            type="textarea"
            :rows="3"
            placeholder="请输入发现的问题（如无可不填）"
          />
        </el-form-item>

        <el-form-item label="整改建议" prop="suggestions">
          <el-input
            v-model="inspectionForm.suggestions"
            type="textarea"
            :rows="3"
            placeholder="请输入整改建议（如无可不填）"
          />
        </el-form-item>
        
        <el-form-item label="监察凭证" prop="imagePath">
          <el-upload
            class="upload-demo"
            action="#"
            :auto-upload="false"
            :on-change="handleImageChange"
            :limit="1"
            :file-list="fileList"
            list-type="picture"
          >
            <template #trigger>
              <el-button type="primary">选择图片</el-button>
            </template>
            <template #tip>
              <div class="el-upload__tip text-gray-500">
                请上传监察凭证图片，仅支持jpg/png格式，大小不超过5MB
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="inspectionDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitInspection" :loading="submitting">
            提交审查
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
import { Search, Check, Picture } from '@element-plus/icons-vue'
import { useMenuApi } from '@/api/menu'
import { useInspectionApi } from '@/api/inspection'
import { useProcessingApi } from '@/api/processing'
import { useUserStore } from '@/stores/user'

const menuApi = useMenuApi()
const inspectionApi = useInspectionApi()
const processingApi = useProcessingApi()
const userStore = useUserStore()

// 表格数据相关
const loading = ref(false)
const menuList = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 图片预览相关
const previewVisible = ref(false)
const previewImage = ref('')

// 获取用户角色和ID
const userRole = computed(() => userStore.user?.role || '')
const userId = computed(() => userStore.user?.id || '')

// 审查对话框相关
const inspectionDialogVisible = ref(false)
const inspectionFormRef = ref(null)
const submitting = ref(false)
const currentMenu = ref({})
const fileList = ref([])
const inspectionForm = reactive({
  inspectorId: null,
  inspectionTime: null,
  content: '',
  result: 'PASS',
  issues: '',
  suggestions: '',
  menuId: null,
  imagePath: null
})

const inspectionRules = {
  content: [
    { required: true, message: '请输入检查内容', trigger: 'blur' }
  ],
  result: [
    { required: true, message: '请选择检查结果', trigger: 'change' }
  ]
}

// 食品详情相关
const processingDetailVisible = ref(false)
const processingDetailLoading = ref(false)
const selectedProcessings = ref([])

// 初始化
onMounted(() => {
  fetchPendingMenus()
})

// 获取待审查菜单列表
const fetchPendingMenus = async () => {
  loading.value = true
  try {
    const res = await menuApi.searchMenus(
      currentPage.value, 
      pageSize.value, 
      null, 
      null, 
      null, 
      '0'  // 查询status=0的菜单
    )
    
    if (res && res.code === 200 && res.data) {
      menuList.value = res.data.records || []
      total.value = res.data.total || 0
    } else {
      ElMessage.error(res?.message || '获取待审查菜单失败')
    }
  } catch (error) {
    console.error('获取待审查菜单失败:', error)
    ElMessage.error('获取待审查菜单失败')
  } finally {
    loading.value = false
  }
}

// 分页处理
const handleSizeChange = (size) => {
  pageSize.value = size
  fetchPendingMenus()
}

const handleCurrentChange = (page) => {
  currentPage.value = page
  fetchPendingMenus()
}

// 处理审查操作
const handleInspect = (row) => {
  currentMenu.value = row
  
  // 重置表单
  inspectionForm.inspectorId = userId.value
  inspectionForm.inspectionTime = new Date().toISOString()
  inspectionForm.content = ''
  inspectionForm.result = 'PASS'
  inspectionForm.issues = ''
  inspectionForm.suggestions = ''
  inspectionForm.menuId = row.id
  inspectionForm.imagePath = null
  fileList.value = []
  
  inspectionDialogVisible.value = true
}

// 处理图片上传
const handleImageChange = (file) => {
  const isImage = file.raw.type === 'image/jpeg' || file.raw.type === 'image/png';
  const isLt5M = file.raw.size / 1024 / 1024 < 5;

  if (!isImage) {
    ElMessage.error('监察凭证图片只能是JPG或PNG格式!');
    fileList.value = [];
    return false;
  }
  
  if (!isLt5M) {
    ElMessage.error('监察凭证图片大小不能超过5MB!');
    fileList.value = [];
    return false;
  }
  
  fileList.value = [file];
  return true;
}

// 提交审查结果
const submitInspection = async () => {
  if (!inspectionFormRef.value) return
  
  await inspectionFormRef.value.validate(async (valid) => {
    if (!valid) return
    
    submitting.value = true
    
    try {
      // 处理图片上传
      if (fileList.value.length > 0) {
        const file = fileList.value[0].raw;
        const uploadRes = await inspectionApi.uploadInspectionImage(file);
        
        if (uploadRes && uploadRes.data) {
          inspectionForm.imagePath = uploadRes.data;
        } else {
          ElMessage.warning('凭证图片上传失败，将继续提交其他信息');
        }
      }
      
      // 创建检查记录
      const res = await inspectionApi.createInspection(inspectionForm)
      
      if (res) {
        // 更新菜单状态
        const updateRes = await menuApi.updateMenuStatus(currentMenu.value.id, '1')
        
        if (updateRes && updateRes.code === 200 && updateRes.data) {
          ElMessage.success('审查完成，菜单已可发放')
          inspectionDialogVisible.value = false
          fetchPendingMenus() // 刷新列表
        } else {
          ElMessage.error(updateRes?.message || '更新菜单状态失败')
        }
      } else {
        ElMessage.error(res?.message || '提交审查记录失败')
      }
    } catch (error) {
      console.error('提交审查失败:', error)
      ElMessage.error('提交审查失败')
    } finally {
      submitting.value = false
    }
  })
}

// 工具函数
const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString()
}

// 获取餐次标签类型
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

// 获取图片URL
const getImageUrl = (path) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${import.meta.env.VITE_API_BASE_URL}${path}`
}

// 查看食品详情
const viewProcessingDetail = async (row) => {
  if (!row.processIds) return
  
  processingDetailLoading.value = true
  selectedProcessings.value = []
  processingDetailVisible.value = true
  
  try {
    const res = await processingApi.getProcessingsByIds(row.processIds)
    if (res.code === 200 && res.data) {
      selectedProcessings.value = res.data
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

// 格式化加工时间
const formatProcessingTime = (timeStr) => {
  if (!timeStr) return ''
  const date = new Date(timeStr)
  return date.toLocaleString()
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
</script>

<style scoped>
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