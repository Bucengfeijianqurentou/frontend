<template>
  <div class="p-4">
    <el-card class="w-full mb-4">
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <el-icon class="mr-2">
              <KnifeFork />
            </el-icon>
            <span>食品加工</span>
          </div>
          <el-button type="primary" @click="handleAddProcessing">
            <el-icon class="mr-1"><Plus /></el-icon>新增加工
          </el-button>
        </div>
      </template>
      
      <!-- 加工记录表格 -->
      <el-table v-loading="loading" :data="processingList" stripe border>
        <el-table-column label="批次号" prop="batchNumber" min-width="120" />
        <el-table-column label="食品名称" min-width="120">
          <template #default="{ row }">
            {{ row.foodName || '未知食品' }}
          </template>
        </el-table-column>
        <el-table-column label="加工时间" min-width="150">
          <template #default="{ row }">
            {{ formatDateTime(row.processingTime) }}
          </template>
        </el-table-column>
        <el-table-column label="加工方法" prop="method" min-width="100" />
        <el-table-column label="加工数量" prop="quantity" min-width="80" />
        <el-table-column label="加工人" prop="processorName" min-width="100" />
        <el-table-column label="卫生条件" min-width="80">
          <template #default="{ row }">
            <el-tag :type="getHygieneTagType(row.hygieneCondition)">
              {{ getHygieneLabel(row.hygieneCondition) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="加工图片" min-width="120">
          <template #default="{ row }">
            <el-image 
              v-if="row.imagePath" 
              :src="getImageUrl(row.imagePath)" 
              style="width: 50px; height: 50px;"
              :preview-src-list="[getImageUrl(row.imagePath)]"
              fit="cover"
            />
            <span v-else>无图片</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="120">
          <template #default="{ row }">
            <el-button link type="primary" @click="viewProcessingDetail(row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <div class="flex justify-end mt-4">
        <el-pagination
          background
          layout="total, prev, pager, next"
          :total="total"
          :current-page="currentPage"
          :page-size="pageSize"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>
    
    <!-- 新增加工对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="食品加工"
      width="600px"
    >
      <el-form :model="processingForm" :rules="rules" ref="processingFormRef" label-width="100px">
        <el-form-item label="批次号" prop="batchNumber">
          <el-select
            v-model="processingForm.batchNumber"
            filterable
            placeholder="请选择批次号"
            style="width: 100%"
            @change="handleBatchChange"
          >
            <el-option
              v-for="item in inventoryOptions"
              :key="item.batchNumber"
              :label="item.batchNumber"
              :value="item.batchNumber"
            >
              <div class="flex items-center justify-between">
                <span>{{ item.batchNumber }}</span>
                <span class="text-gray-500 ml-2">可加工数量: {{ item.remainingQuantity }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="食品名称">
          <el-input v-model="selectedFoodName" disabled />
        </el-form-item>
        
        <el-form-item label="可加工数量">
          <el-input v-model="availableQuantity" disabled />
        </el-form-item>
        
        <el-form-item label="加工数量" prop="quantity">
          <el-input-number
            v-model="processingForm.quantity"
            :min="1"
            :max="availableQuantity ? parseInt(availableQuantity) : 1"
            :disabled="!processingForm.batchNumber"
          />
        </el-form-item>
        
        <el-form-item label="加工方法" prop="method">
          <el-select v-model="processingForm.method" placeholder="请选择加工方法">
            <el-option label="蒸制" value="蒸制" />
            <el-option label="炒制" value="炒制" />
            <el-option label="煮制" value="煮制" />
            <el-option label="烤制" value="烤制" />
            <el-option label="煎制" value="煎制" />
            <el-option label="烙制" value="烙制" />
            <el-option label="炸制" value="炸制" />
            <el-option label="腌制" value="腌制" />
            <el-option label="烟熏" value="烟熏" />
            <el-option label="风干" value="风干" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="卫生条件" prop="hygieneCondition">
          <el-radio-group v-model="processingForm.hygieneCondition">
            <el-radio label="GOOD">良好</el-radio>
            <el-radio label="NORMAL">一般</el-radio>
            <el-radio label="POOR">差</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="加工图片" prop="imagePath">
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="handleUploadSuccess"
            :before-upload="beforeUpload"
            :http-request="customUpload"
          >
            <img v-if="processingForm.imagePath" :src="getImageUrl(processingForm.imagePath)" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitProcessing">提交</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 查看详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="加工详情"
      width="650px"
      top="5vh"
    >
      <div v-if="processingDetail" class="processing-detail">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="detail-item">
            <span class="font-bold">批次号:</span> {{ processingDetail.batchNumber }}
          </div>
          <div class="detail-item">
            <span class="font-bold">食品名称:</span> {{ processingDetail.foodName || '未知食品' }}
          </div>
          <div class="detail-item">
            <span class="font-bold">加工时间:</span> {{ formatDateTime(processingDetail.processingTime) }}
          </div>
          <div class="detail-item">
            <span class="font-bold">加工方法:</span> {{ processingDetail.method }}
          </div>
          <div class="detail-item">
            <span class="font-bold">加工数量:</span> {{ processingDetail.quantity }}
          </div>
          <div class="detail-item">
            <span class="font-bold">加工人姓名:</span> {{ processingDetail.processorName || '未知' }}
          </div>
          <div class="detail-item">
            <span class="font-bold">加工人联系方式:</span> {{ processingDetail.processorPhone || '无' }}
          </div>
          <div class="detail-item">
            <span class="font-bold">卫生条件:</span> 
            <el-tag :type="getHygieneTagType(processingDetail.hygieneCondition)">
              {{ getHygieneLabel(processingDetail.hygieneCondition) }}
            </el-tag>
          </div>
        </div>
        
        <div class="mt-4">
          <div class="font-bold mb-2">加工图片:</div>
          <div class="image-container">
            <el-image 
              v-if="processingDetail.imagePath" 
              :src="getImageUrl(processingDetail.imagePath)" 
              style="max-width: 100%; max-height: 300px;"
              :preview-src-list="[getImageUrl(processingDetail.imagePath)]"
            />
            <div v-else class="no-image">无图片</div>
          </div>
        </div>

        <div class="mt-4" v-if="processingDetail.transactionHash">
          <div class="font-bold mb-2">交易哈希:</div>
          <div class="transaction-hash-container">
            <el-input
              v-model="processingDetail.transactionHash"
              readonly
              class="hash-input"
            >
              <template #append>
                <el-button @click="copyTransactionHash">
                  <el-icon><Document /></el-icon>
                </el-button>
              </template>
            </el-input>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
 
<script setup>
import { ref, onMounted, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { KnifeFork, Plus, Document } from '@element-plus/icons-vue'
import { useProcessingApi } from '@/api/processing'
import { useInventoryApi } from '@/api/inventory'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const processingApi = useProcessingApi()
const inventoryApi = useInventoryApi()

// 表格数据
const loading = ref(false)
const processingList = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

// 对话框控制
const dialogVisible = ref(false)
const detailDialogVisible = ref(false)
const processingDetail = ref(null)

// 库存选项
const inventoryOptions = ref([])
const selectedFoodName = ref('')
const availableQuantity = ref('')

// 表单引用和数据
const processingFormRef = ref(null)
const processingForm = reactive({
  batchNumber: '',
  quantity: 1,
  method: '',
  hygieneCondition: 'GOOD',
  processorId: null,
  processorName: '',
  processorPhone: '',
  imagePath: '',
  inventoryId: null // 选中的库存ID，用于后续更新库存
})

// 表单验证规则
const rules = {
  batchNumber: [{ required: true, message: '请选择批次号', trigger: 'change' }],
  quantity: [{ required: true, message: '请输入加工数量', trigger: 'blur' }],
  method: [{ required: true, message: '请选择加工方法', trigger: 'change' }],
  hygieneCondition: [{ required: true, message: '请选择卫生条件', trigger: 'change' }]
}

// 上传相关
const uploadUrl = import.meta.env.VITE_API_BASE_URL + '/api/files/upload'

// 初始化数据
onMounted(() => {
  fetchProcessingList()
  loadInventoryOptions()
  
  // 获取当前用户信息
  if (userStore.user) {
    // 设置处理人信息
    processingForm.processorId = userStore.user.id
    processingForm.processorName = userStore.user.realName || userStore.user.username
    processingForm.processorPhone = userStore.user.phone || ''
    
    console.log('初始化用户信息:', {
      id: processingForm.processorId,
      name: processingForm.processorName,
      phone: processingForm.processorPhone
    })
  } else {
    // 如果没有用户信息，尝试获取
    userStore.getUserInfoAction().then(() => {
      processingForm.processorId = userStore.user?.id
      processingForm.processorName = userStore.user?.realName || userStore.user?.username
      processingForm.processorPhone = userStore.user?.phone || ''
    })
  }
})

// 获取加工记录列表
const fetchProcessingList = async () => {
  loading.value = true
  try {
    const res = await processingApi.listProcessings(currentPage.value, pageSize.value)
    processingList.value = res.data.records || []
    total.value = res.data.total || 0
    
    // 获取每条记录对应的食品名称
    for (const record of processingList.value) {
      if (!record.foodName && record.batchNumber) {
        try {
          const inventoryRes = await inventoryApi.getInventoryDetail(record.batchNumber)
          if (inventoryRes.code === 200 && inventoryRes.data) {
            record.foodName = inventoryRes.data.foodName
          }
        } catch (error) {
          console.error('获取食品名称失败:', error)
        }
      }
    }
  } catch (error) {
    console.error('获取加工记录失败:', error)
    ElMessage.error('获取加工记录失败')
  } finally {
    loading.value = false
  }
}

// 加载可用库存选项
const loadInventoryOptions = async () => {
  try {
    const res = await inventoryApi.getAvailableInventory()
    if (res.data && res.data.length > 0) {
      inventoryOptions.value = res.data
    }
  } catch (error) {
    console.error('获取可用库存失败:', error)
    ElMessage.error('获取可用库存失败')
  }
}

// 处理页码变化
const handlePageChange = (page) => {
  currentPage.value = page
  fetchProcessingList()
}

// 处理新增加工
const handleAddProcessing = () => {
  // 重置表单
  if (processingFormRef.value) {
    processingFormRef.value.resetFields()
  }
  
  processingForm.batchNumber = ''
  processingForm.quantity = 1
  processingForm.method = ''
  processingForm.hygieneCondition = 'GOOD'
  processingForm.imagePath = ''
  processingForm.inventoryId = null
  
  selectedFoodName.value = ''
  availableQuantity.value = ''
  
  // 获取当前用户信息
  if (userStore.user) {
    processingForm.processorId = userStore.user.id
    processingForm.processorName = userStore.user.realName || userStore.user.username
    processingForm.processorPhone = userStore.user.phone || ''
  } else {
    userStore.getUserInfoAction().then(() => {
      processingForm.processorId = userStore.user?.id
      processingForm.processorName = userStore.user?.realName || userStore.user?.username
      processingForm.processorPhone = userStore.user?.phone || ''
    })
  }
  
  dialogVisible.value = true
}

// 处理批次号变化
const handleBatchChange = async (value) => {
  if (!value) {
    selectedFoodName.value = ''
    availableQuantity.value = ''
    processingForm.inventoryId = null
    return
  }
  
  try {
    // 使用新的API获取库存详情（包含食品名称）
    const res = await inventoryApi.getInventoryDetail(value)
    if (res.code === 200 && res.data) {
      // 更新表单中的库存ID
      processingForm.inventoryId = res.data.id
      
      // 显示食品名称和剩余数量
      selectedFoodName.value = res.data.foodName || '未知食品'
      availableQuantity.value = res.data.remainingQuantity
    } else {
      ElMessage.error('获取库存详情失败')
    }
  } catch (error) {
    console.error('获取库存详情失败:', error)
    ElMessage.error('获取库存详情失败')
    selectedFoodName.value = '未知食品'
    availableQuantity.value = '0'
  }
}

// 提交加工记录
const submitProcessing = async () => {
  if (!processingFormRef.value) return
  
  processingFormRef.value.validate(async (valid) => {
    if (!valid) {
      ElMessage.error('请填写完整信息')
      return
    }
    
    // 确保processorId已设置
    if (!processingForm.processorId) {
      processingForm.processorId = userStore.user?.id
      if (!processingForm.processorId) {
        ElMessage.error('未能获取用户ID，请重新登录')
        return
      }
    }
    
    // 确保processorName和processorPhone已设置
    if (!processingForm.processorName) {
      processingForm.processorName = userStore.user?.realName || userStore.user?.username || '未知'
    }
    
    if (!processingForm.processorPhone) {
      processingForm.processorPhone = userStore.user?.phone || ''
    }
    
    try {
      console.log('提交的表单数据:', JSON.stringify(processingForm)) // 添加日志便于调试
      // 创建加工记录
      const response = await processingApi.createProcessing(processingForm)
      if (response.code === 200) {
        ElMessage.success('加工记录已保存，库存已更新')
        dialogVisible.value = false
        
        // 刷新列表
        fetchProcessingList()
        // 刷新库存选项
        loadInventoryOptions()
      } else {
        ElMessage.error(response.message || '创建加工记录失败')
      }
    } catch (error) {
      console.error('创建加工记录失败:', error)
      ElMessage.error('创建加工记录失败: ' + (error.message || '未知错误'))
    }
  })
}

// 自定义上传
const customUpload = async (options) => {
  try {
    const res = await processingApi.uploadProcessingImage(options.file)
    processingForm.imagePath = res.data
    options.onSuccess(res)
  } catch (error) {
    console.error('上传图片失败:', error)
    options.onError(error)
    ElMessage.error('上传图片失败')
  }
}

// 上传成功
const handleUploadSuccess = (res) => {
  processingForm.imagePath = res.data
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

// 查看加工详情
const viewProcessingDetail = async (row) => {
  processingDetail.value = row
  
  // 如果没有食品名称，获取食品名称
  if (!processingDetail.value.foodName && processingDetail.value.batchNumber) {
    try {
      const res = await inventoryApi.getInventoryDetail(processingDetail.value.batchNumber)
      if (res.code === 200 && res.data) {
        processingDetail.value.foodName = res.data.foodName
      }
    } catch (error) {
      console.error('获取食品名称失败:', error)
    }
  }
  
  detailDialogVisible.value = true
}

// 格式化时间
const formatDateTime = (dateTimeStr) => {
  if (!dateTimeStr) return '-'
  
  const date = new Date(dateTimeStr)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

// 获取卫生条件标签类型
const getHygieneTagType = (condition) => {
  switch (condition) {
    case 'GOOD': return 'success'
    case 'NORMAL': return 'warning'
    case 'POOR': return 'danger'
    default: return 'info'
  }
}

// 获取卫生条件标签文本
const getHygieneLabel = (condition) => {
  switch (condition) {
    case 'GOOD': return '良好'
    case 'NORMAL': return '一般'
    case 'POOR': return '差'
    default: return '未知'
  }
}

// 获取图片URL
const getImageUrl = (path) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${import.meta.env.VITE_API_BASE_URL}${path}`
}

// 复制交易哈希
const copyTransactionHash = () => {
  if (!processingDetail.value?.transactionHash) return;
  
  navigator.clipboard.writeText(processingDetail.value.transactionHash)
    .then(() => {
      ElMessage.success('交易哈希已复制到剪贴板');
    })
    .catch(err => {
      console.error('无法复制交易哈希:', err);
      ElMessage.error('复制失败');
    });
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

/* 详情页样式 */
.processing-detail {
  padding: 10px;
}

.detail-item {
  padding: 8px;
  margin-bottom: 8px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f8f9fa;
  border-radius: 4px;
  padding: 10px;
  min-height: 200px;
}

.no-image {
  color: #909399;
  font-size: 14px;
}

.transaction-hash-container {
  display: flex;
  align-items: center;
}

.hash-input {
  flex: 1;
}
</style> 