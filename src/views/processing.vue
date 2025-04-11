<template>
  <div class="p-4">
    <el-card class="w-full shadow-md">
      <template #header>
        <div class="flex justify-between items-center py-2">
          <div class="flex items-center">
            <el-icon class="text-blue-500 mr-2 text-xl"><KnifeFork /></el-icon>
            <span class="text-xl font-medium">食品加工</span>
          </div>
        </div>
      </template>

      <!-- 搜索区域 -->
      <div class="mb-5 flex gap-4 flex-wrap bg-gray-50 p-4 rounded-md shadow-sm">
        <el-input
          v-model="searchForm.keyword"
          placeholder="搜索批次号/食品名称"
          class="w-64"
          clearable
          size="large"
          @clear="loadInventoryList"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        
        <el-button type="primary" size="large" @click="loadInventoryList" class="bg-blue-500 hover:bg-blue-600">
          <el-icon class="mr-1"><Search /></el-icon>搜索
        </el-button>
        <el-button size="large" @click="resetSearch">
          <el-icon class="mr-1"><Refresh /></el-icon>重置
        </el-button>
      </div>

      <!-- 未加工食品批次列表 -->
      <el-table
        v-loading="loading"
        :data="inventoryList"
        border
        stripe
        style="width: 100%"
        class="rounded-md overflow-hidden"
        :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }"
      >
        <el-table-column prop="id" label="ID" width="80" align="center" />
        <el-table-column label="食品名称" min-width="120" align="center">
          <template #default="scope">
            <span>{{ getFoodName(scope.row.foodId) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="batchNumber" label="批次号" min-width="180" align="center" />
        <el-table-column prop="remainingQuantity" label="可加工数量" width="120" align="center" />
        <el-table-column label="操作" width="120" fixed="right" align="center">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="handleProcess(scope.row)" class="text-blue-500 hover:text-blue-700 font-medium">
              <el-icon class="mr-1"><KnifeFork /></el-icon>加工
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="flex justify-end mt-5">
        <el-pagination
          :current-page="currentPage"
          :page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>

      <!-- 加工记录弹窗 -->
      <el-dialog
        v-model="processingVisible"
        width="50%"
        :show-close="true"
        destroy-on-close
      >
        <template #header>
          <div class="flex items-center">
            <el-icon class="text-blue-500 mr-2 text-xl"><KnifeFork /></el-icon>
            <span class="text-xl font-medium">食品加工</span>
          </div>
        </template>
        
        <div v-if="currentInventory" class="p-4">
          <div class="mb-4 bg-blue-50 p-3 rounded-md">
            <div class="text-lg font-medium">{{ getFoodName(currentInventory.foodId) }}</div>
            <div class="text-gray-600 mt-1">批次号: {{ currentInventory.batchNumber }}</div>
            <div class="text-gray-600">可加工数量: {{ currentInventory.remainingQuantity }}</div>
          </div>
          
          <el-form :model="processingForm" :rules="rules" ref="processingFormRef" label-width="100px">
            <el-form-item label="加工方法" prop="method">
              <el-select v-model="processingForm.method" placeholder="请选择加工方法" class="w-full">
                <el-option label="煮熟" value="煮熟" />
                <el-option label="炒制" value="炒制" />
                <el-option label="蒸制" value="蒸制" />
                <el-option label="烤制" value="烤制" />
                <el-option label="煎制" value="煎制" />
                <el-option label="凉拌" value="凉拌" />
                <el-option label="油炸" value="油炸" />
                <el-option label="腌制" value="腌制" />
              </el-select>
            </el-form-item>
            
            <el-form-item label="加工数量" prop="quantity">
              <el-input-number 
                v-model="processingForm.quantity" 
                :min="1" 
                :max="currentInventory.remainingQuantity" 
                class="w-full"
              />
              <div class="text-gray-500 mt-1 text-sm">加工数量不能超过可加工数量 {{ currentInventory.remainingQuantity }}</div>
            </el-form-item>
            
            <el-form-item label="卫生条件" prop="hygieneCondition">
              <el-radio-group v-model="processingForm.hygieneCondition">
                <el-radio label="GOOD">良好</el-radio>
                <el-radio label="NORMAL">一般</el-radio>
                <el-radio label="POOR">差</el-radio>
              </el-radio-group>
            </el-form-item>
            
            <el-form-item label="加工时间" prop="processingTime">
              <el-date-picker
                v-model="processingForm.processingTime"
                type="datetime"
                placeholder="选择加工时间"
                class="w-full"
                value-format="YYYY-MM-DD HH:mm:ss"
                :disabled="true"
              />
            </el-form-item>
            
            <el-form-item label="图片上传" prop="imagePath">
              <el-upload
                class="upload-demo"
                :action="`${apiBaseUrl}/api/files/upload`"
                :headers="uploadHeaders"
                :on-success="handleUploadSuccess"
                :on-error="handleUploadError"
                :before-upload="beforeUpload"
                :limit="1"
                :file-list="fileList"
              >
                <el-button type="primary">点击上传</el-button>
                <template #tip>
                  <div class="el-upload__tip text-gray-500 mt-1">
                    只能上传jpg/png/jpeg文件，且不超过10MB
                  </div>
                </template>
              </el-upload>
            </el-form-item>
          </el-form>
          
          <div class="flex justify-center mt-6">
            <el-button type="primary" @click="submitProcessing" :loading="submitLoading" class="mr-4">
              提交
            </el-button>
            <el-button @click="processingVisible = false">取消</el-button>
          </div>
        </div>
      </el-dialog>
      
      <!-- 加工记录列表弹窗 -->
      <el-dialog
        v-model="historyVisible"
        width="80%"
        :show-close="true"
        destroy-on-close
      >
        <template #header>
          <div class="flex items-center">
            <el-icon class="text-blue-500 mr-2 text-xl"><List /></el-icon>
            <span class="text-xl font-medium">加工记录列表</span>
          </div>
        </template>
        
        <el-table
          v-loading="processingListLoading"
          :data="processingList"
          border
          stripe
          style="width: 100%"
          class="rounded-md overflow-hidden"
          :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }"
        >
          <el-table-column prop="id" label="ID" width="80" align="center" />
          <el-table-column prop="purchaseId" label="采购ID" width="100" align="center" />
          <el-table-column prop="method" label="加工方法" min-width="120" align="center" />
          <el-table-column prop="quantity" label="加工数量" width="100" align="center" />
          <el-table-column label="卫生条件" width="120" align="center">
            <template #default="scope">
              <el-tag :type="getHygieneTagType(scope.row.hygieneCondition)">
                {{ getHygieneText(scope.row.hygieneCondition) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="processingTime" label="加工时间" min-width="180" align="center" />
          <el-table-column label="操作" width="120" fixed="right" align="center">
            <template #default="scope">
              <el-button link type="primary" size="small" @click="viewProcessDetail(scope.row)" class="text-blue-500 hover:text-blue-700 font-medium">
                <el-icon class="mr-1"><View /></el-icon>详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        
        <!-- 分页 -->
        <div class="flex justify-end mt-5">
          <el-pagination
            :current-page="processingCurrentPage"
            :page-size="processingPageSize"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="processingTotal"
            background
            @size-change="handleProcessingSizeChange"
            @current-change="handleProcessingCurrentChange"
          />
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { KnifeFork, Search, Refresh, View, List } from '@element-plus/icons-vue'
import { useInventoryApi } from '@/api/inventory'
import { useFoodApi } from '@/api/food'
import { useProcessingApi } from '@/api/processing'
import { usePurchaseApi } from '@/api/purchase'
import { getToken } from '@/utils/auth'
import { useUserStore } from '@/stores/user'

const inventoryApi = useInventoryApi()
const foodApi = useFoodApi()
const processingApi = useProcessingApi()
const purchaseApi = usePurchaseApi()
const userStore = useUserStore()

// API基础URL变量
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || ''

// 食品名称缓存
const foodCache = ref({})

// 库存列表数据
const loading = ref(false)
const inventoryList = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 搜索表单
const searchForm = reactive({
  keyword: ''
})

// 弹窗控制
const processingVisible = ref(false)
const historyVisible = ref(false)
const currentInventory = ref(null)
const submitLoading = ref(false)
const processingFormRef = ref(null)

// 上传配置
const uploadHeaders = {
  Authorization: getToken()
}
const fileList = ref([])

// 加工记录表单
const processingForm = reactive({
  purchaseId: null,
  processorId: userStore.user?.id,
  processingTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
  method: '',
  quantity: 1,
  hygieneCondition: 'GOOD',
  imagePath: ''
})

// 表单验证规则
const rules = {
  method: [
    { required: true, message: '请选择加工方法', trigger: 'change' }
  ],
  quantity: [
    { required: true, message: '请输入加工数量', trigger: 'change' },
    { type: 'number', min: 1, message: '数量必须大于0', trigger: 'change' }
  ],
  hygieneCondition: [
    { required: true, message: '请选择卫生条件', trigger: 'change' }
  ],
  imagePath: [
    { required: true, message: '请上传加工凭证图片', trigger: 'change' }
  ]
}

// 加工记录列表数据
const processingListLoading = ref(false)
const processingList = ref([])
const processingCurrentPage = ref(1)
const processingPageSize = ref(10)
const processingTotal = ref(0)

// 加载库存列表（未加工的食品批次）
async function loadInventoryList() {
  loading.value = true
  try {
    let res
    const params = {
      page: currentPage.value,
      size: pageSize.value
    }
    
    if (searchForm.keyword) {
      // 根据批次号或名称查询
      res = await inventoryApi.listInventory(params.page, params.size)
      if (res.code === 200) {
        // 过滤出有剩余数量的库存
        inventoryList.value = (res.data.records || []).filter(item => item.remainingQuantity > 0)
        total.value = inventoryList.value.length
      } else {
        inventoryList.value = []
        total.value = 0
      }
    } else {
      // 获取所有库存列表
      res = await inventoryApi.listInventory(params.page, params.size)
      if (res.code === 200) {
        // 过滤出有剩余数量的库存
        inventoryList.value = (res.data.records || []).filter(item => item.remainingQuantity > 0)
        total.value = inventoryList.value.length
      } else {
        inventoryList.value = []
        total.value = 0
      }
    }
    
    // 获取食品名称
    if (inventoryList.value.length > 0) {
      const foodIds = [...new Set(inventoryList.value.map(item => item.foodId))]
      for (const id of foodIds) {
        if (!foodCache.value[id]) {
          try {
            const foodRes = await foodApi.getFoodById(id)
            if (foodRes && foodRes.code === 200 && foodRes.data) {
              foodCache.value[id] = foodRes.data.name
            } else {
              foodCache.value[id] = `未知食品(ID:${id})`
            }
          } catch (error) {
            console.error(`获取食品名称失败: ${id}`, error)
            foodCache.value[id] = `未知食品(ID:${id})`
          }
        }
      }
    }
  } catch (error) {
    console.error('获取库存列表失败', error)
    ElMessage.error('获取库存列表失败')
    inventoryList.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

// 加载加工记录列表
async function loadProcessingList() {
  processingListLoading.value = true
  try {
    const res = await processingApi.listProcessings(
      processingCurrentPage.value,
      processingPageSize.value
    )
    
    if (res.code === 200) {
      processingList.value = res.data.records || []
      processingTotal.value = res.data.total || 0
    } else {
      processingList.value = []
      processingTotal.value = 0
      ElMessage.warning(res?.message || '获取加工记录失败')
    }
  } catch (error) {
    console.error('获取加工记录失败', error)
    ElMessage.error('获取加工记录失败')
    processingList.value = []
    processingTotal.value = 0
  } finally {
    processingListLoading.value = false
  }
}

// 查看加工记录
function viewProcessDetail(row) {
  ElMessage.info('查看加工详情功能开发中...')
  console.log('加工记录详情:', row)
}

// 获取食品名称
function getFoodName(foodId) {
  return foodCache.value[foodId] || `加载中...(ID:${foodId})`
}

// 重置搜索条件
function resetSearch() {
  searchForm.keyword = ''
  loadInventoryList()
}

// 选择食品批次进行加工
function handleProcess(row) {
  currentInventory.value = {...row}
  processingForm.purchaseId = row.id
  processingForm.quantity = 1
  processingForm.method = ''
  processingForm.hygieneCondition = 'GOOD'
  processingForm.imagePath = ''
  fileList.value = []
  processingVisible.value = true
}

// 处理上传成功
function handleUploadSuccess(response) {
  if (response.code === 200) {
    processingForm.imagePath = response.data
    ElMessage.success('上传成功')
  } else {
    ElMessage.error(response.message || '上传失败')
  }
}

// 处理上传失败
function handleUploadError() {
  ElMessage.error('上传失败')
}

// 上传前校验
function beforeUpload(file) {
  const isImage = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'
  const isLt10M = file.size / 1024 / 1024 < 10
  
  if (!isImage) {
    ElMessage.error('上传图片只能是JPG/PNG/JPEG格式!')
  }
  if (!isLt10M) {
    ElMessage.error('上传图片大小不能超过10MB!')
  }
  
  return isImage && isLt10M
}

// 提交加工记录
async function submitProcessing() {
  if (!processingFormRef.value) return
  
  processingFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        submitLoading.value = true
        
        // 通过批次号获取采购记录ID
        const batchNumber = currentInventory.value.batchNumber
        let purchaseId = null
        
        try {
          const purchaseRes = await purchaseApi.getPurchaseByBatchNumber(batchNumber)
          if (purchaseRes && purchaseRes.code === 200 && purchaseRes.data) {
            purchaseId = purchaseRes.data.id
          } else {
            ElMessage.error('无法获取采购记录，请确认批次号正确')
            submitLoading.value = false
            return
          }
        } catch (error) {
          console.error('获取采购记录失败:', error)
          ElMessage.error('获取采购记录失败')
          submitLoading.value = false
          return
        }
        
        // 构建加工记录数据
        const processingData = {
          purchaseId: purchaseId, // 使用正确的采购ID
          processorId: userStore.user?.id,
          processingTime: processingForm.processingTime,
          method: processingForm.method,
          quantity: processingForm.quantity,
          hygieneCondition: processingForm.hygieneCondition,
          imagePath: processingForm.imagePath
        }
        
        // 提交加工记录
        const res = await processingApi.createProcessing(processingData)
        
        if (res.code === 200) {
          // 更新库存剩余数量
          const newQuantity = currentInventory.value.remainingQuantity - processingForm.quantity
          await inventoryApi.updateQuantity(currentInventory.value.id, newQuantity)
          
          ElMessage.success('加工记录提交成功')
          processingVisible.value = false
          loadInventoryList() // 重新加载库存列表
        } else {
          ElMessage.error(res.message || '提交失败')
        }
      } catch (error) {
        console.error('提交加工记录失败', error)
        ElMessage.error('提交加工记录失败')
      } finally {
        submitLoading.value = false
      }
    } else {
      ElMessage.warning('请完善表单信息')
    }
  })
}

// 分页处理
function handleSizeChange(size) {
  pageSize.value = size
  loadInventoryList()
}

function handleCurrentChange(page) {
  currentPage.value = page
  loadInventoryList()
}

function handleProcessingSizeChange(size) {
  processingPageSize.value = size
  loadProcessingList()
}

function handleProcessingCurrentChange(page) {
  processingCurrentPage.value = page
  loadProcessingList()
}

// 获取卫生条件文本
function getHygieneText(condition) {
  const map = {
    'GOOD': '良好',
    'NORMAL': '一般',
    'POOR': '差'
  }
  return map[condition] || condition
}

// 获取卫生条件标签类型
function getHygieneTagType(condition) {
  const map = {
    'GOOD': 'success',
    'NORMAL': 'warning',
    'POOR': 'danger'
  }
  return map[condition] || 'info'
}

// 初始化
onMounted(() => {
  loadInventoryList()
})
</script>

<style scoped>
:deep(.el-form-item__label) {
  font-weight: 500;
}

:deep(.el-dialog__header) {
  padding: 15px 20px;
  margin-right: 0;
  border-bottom: 1px solid #f0f0f0;
}

:deep(.el-dialog__body) {
  padding: 20px;
}

:deep(.el-table th) {
  background-color: #f5f7fa !important;
}
</style> 