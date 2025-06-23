<template>
  <div class="p-4">
    <el-card class="w-full shadow-md">
      <template #header>
        <div class="flex justify-between items-center py-2">
          <div class="flex items-center">
            <el-icon class="text-blue-500 mr-2 text-xl"><Goods /></el-icon>
            <span class="text-xl font-medium">库存管理</span>
          </div>
          <!-- 扫码入库提示区域 -->
          <div class="flex items-center gap-4">
            <div class="scan-status-indicator" :class="{ 'scanning': isScanning }">
              <el-icon class="text-green-500 mr-1"><Camera /></el-icon>
              <span class="text-sm text-gray-600">{{ scanStatusText }}</span>
            </div>
            <el-button type="success" size="large" @click="toggleScanMode" :icon="isScanning ? 'VideoPause' : 'VideoPlay'">
              {{ isScanning ? '停止扫码' : '开启扫码' }}
            </el-button>
          </div>
        </div>
      </template>

      <!-- 扫码提示区域 -->
      <div v-if="isScanning" class="scan-notice mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
        <div class="flex items-center">
          <el-icon class="text-green-500 mr-2 text-xl animate-pulse"><Camera /></el-icon>
          <div>
            <p class="text-green-700 font-medium mb-1">扫码入库模式已开启</p>
            <p class="text-green-600 text-sm">请直接使用扫码枪扫描商品条码，无需点击任何输入框。扫码完成后会自动处理入库。</p>
          </div>
        </div>
        <div v-if="lastScannedBarcode" class="mt-2 text-sm text-gray-600">
          最近扫描：{{ lastScannedBarcode }}
        </div>
      </div>

      <!-- 搜索区域 -->
      <div class="mb-5 flex gap-4 flex-wrap bg-gray-50 p-4 rounded-md shadow-sm">
        <el-input
          v-model="searchForm.keyword"
          placeholder="搜索批次号"
          class="w-64"
          clearable
          size="large"
          @clear="loadInventoryList"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        
        <el-select
          v-model="searchForm.lowStock"
          placeholder="库存状态"
          clearable
          class="w-64"
          size="large"
        >
          <el-option label="所有库存" :value="''" />
          <el-option label="库存不足" :value="true" />
        </el-select>
        
        <el-button type="primary" size="large" @click="loadInventoryList" class="bg-blue-500 hover:bg-blue-600">
          <el-icon class="mr-1"><Search /></el-icon>搜索
        </el-button>
        <el-button size="large" @click="resetSearch">
          <el-icon class="mr-1"><Refresh /></el-icon>重置
        </el-button>
      </div>

      <!-- 数据表格 -->
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
        <el-table-column prop="totalQuantity" label="总数量" width="100" align="center" />
        <el-table-column label="剩余数量" width="130" align="center">
          <template #default="scope">
            <span :class="scope.row.remainingQuantity < scope.row.totalQuantity * 0.2 ? 'text-red-500 font-bold' : ''">
              {{ scope.row.remainingQuantity }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="库存状态" width="120" align="center">
          <template #default="scope">
            <el-tag 
              :type="scope.row.remainingQuantity < scope.row.totalQuantity * 0.2 ? 'danger' : 'success'" 
              effect="plain"
            >
              {{ scope.row.remainingQuantity < scope.row.totalQuantity * 0.2 ? '库存不足' : '库存充足' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="使用比例" width="200" align="center">
          <template #default="scope">
            <el-progress 
              :percentage="Math.round((1 - scope.row.remainingQuantity / scope.row.totalQuantity) * 100)" 
              :status="scope.row.remainingQuantity < scope.row.totalQuantity * 0.2 ? 'exception' : ''"
            />
          </template>
        </el-table-column>
        <el-table-column label="交易哈希" min-width="200" align="center">
          <template #default="scope">
            <el-tooltip
              v-if="scope.row.transactionHash"
              :content="scope.row.transactionHash"
              placement="top"
              :show-after="500"
            >
              <div class="truncate max-w-full">
                {{ formatTransactionHash(scope.row.transactionHash) }}
              </div>
            </el-tooltip>
            <span v-else class="text-gray-400">-</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right" align="center">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="handleView(scope.row)" class="text-blue-500 hover:text-blue-700 font-medium">
              <el-icon class="mr-1"><View /></el-icon>详情
            </el-button>
            <el-divider direction="vertical" />
            <el-button link type="warning" size="small" @click="handleUpdate(scope.row)" class="text-orange-500 hover:text-orange-700 font-medium">
              <el-icon class="mr-1"><Edit /></el-icon>调整
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
    </el-card>

    <!-- 详情弹窗 -->
    <el-dialog
      v-model="detailVisible"
      width="60%"
      :show-close="true"
      destroy-on-close
    >
      <template #header>
        <div class="flex items-center">
          <el-icon class="text-blue-500 mr-2 text-xl"><InfoFilled /></el-icon>
          <span class="text-xl font-medium">库存详情</span>
        </div>
      </template>
      <div v-if="currentRecord" class="inventory-detail p-2">
        <el-descriptions :column="2" border class="rounded-lg overflow-hidden" :label-style="{ 'background-color': '#f5f7fa', 'font-weight': 'bold' }">
          <el-descriptions-item label="ID" label-align="center" align="center">{{ currentRecord.id }}</el-descriptions-item>
          <el-descriptions-item label="食品名称" label-align="center" align="center">{{ getFoodName(currentRecord.foodId) }}</el-descriptions-item>
          <el-descriptions-item label="批次号" label-align="center" align="center">{{ currentRecord.batchNumber }}</el-descriptions-item>
          <el-descriptions-item label="总数量" label-align="center" align="center">{{ currentRecord.totalQuantity }}</el-descriptions-item>
          <el-descriptions-item label="剩余数量" label-align="center" align="center">{{ currentRecord.remainingQuantity }}</el-descriptions-item>
          <el-descriptions-item label="使用率" label-align="center" align="center">
            {{ Math.round((1 - currentRecord.remainingQuantity / currentRecord.totalQuantity) * 100) }}%
          </el-descriptions-item>
          <el-descriptions-item label="交易哈希" label-align="center" align="center" :span="2">
            <div class="flex items-center justify-center">
              <el-tooltip
                :content="currentRecord.transactionHash || '暂无交易哈希'"
                placement="top"
                :show-after="500"
                :disabled="!currentRecord.transactionHash"
              >
                <div class="truncate max-w-full text-center">
                  {{ currentRecord.transactionHash || '暂无交易哈希' }}
                </div>
              </el-tooltip>
              <el-button 
                v-if="currentRecord.transactionHash" 
                link 
                type="primary" 
                @click="copyTransactionHash" 
                class="ml-2"
              >
                <el-icon><Document /></el-icon>
              </el-button>
            </div>
          </el-descriptions-item>
        </el-descriptions>
        
        <div class="mt-6">
          <div class="text-gray-600 mb-2 font-medium flex items-center">
            <el-icon class="mr-1"><DataLine /></el-icon>
            使用情况:
          </div>
          <div class="flex justify-center">
            <el-progress type="dashboard" 
              :percentage="Math.round((1 - currentRecord.remainingQuantity / currentRecord.totalQuantity) * 100)" 
              :status="currentRecord.remainingQuantity < currentRecord.totalQuantity * 0.2 ? 'exception' : 'success'"
            />
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 调整库存弹窗 -->
    <el-dialog
      v-model="updateVisible"
      width="40%"
      :show-close="true"
      destroy-on-close
    >
      <template #header>
        <div class="flex items-center">
          <el-icon class="text-orange-500 mr-2 text-xl"><Edit /></el-icon>
          <span class="text-xl font-medium">调整库存数量</span>
        </div>
      </template>
      <div v-if="currentRecord" class="p-4">
        <div class="mb-4">
          <div class="text-lg font-medium mb-2">食品名称: {{ getFoodName(currentRecord.foodId) }}</div>
          <div class="text-gray-500">批次号: {{ currentRecord.batchNumber }}</div>
        </div>
        
        <el-form :model="updateForm" label-width="120px">
          <el-form-item label="当前剩余数量">
            <el-input v-model="currentRecord.remainingQuantity" disabled></el-input>
          </el-form-item>
          <el-form-item label="调整后数量" required>
            <el-input-number v-model="updateForm.quantity" :min="0" :max="currentRecord.totalQuantity" class="w-full"></el-input-number>
            <div class="text-gray-500 mt-1 text-sm">调整后的数量不能大于总数量 {{ currentRecord.totalQuantity }}</div>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="updateForm.remark" type="textarea" rows="3" placeholder="请输入调整原因"></el-input>
          </el-form-item>
        </el-form>
        
        <div class="flex justify-center mt-6">
          <el-button type="primary" @click="submitUpdate" :loading="submitLoading" class="mr-4">
            确认调整
          </el-button>
          <el-button @click="updateVisible = false">取消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Goods, Search, Refresh, View, Edit, DataLine, InfoFilled, Document, Camera, VideoPlay, VideoPause } from '@element-plus/icons-vue'
import { useInventoryApi } from '@/api/inventory'
import { useFoodApi } from '@/api/food'

const inventoryApi = useInventoryApi()
const foodApi = useFoodApi()

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
  keyword: '',  // 批次号搜索
  lowStock: ''  // 库存状态
})

// 弹窗控制
const detailVisible = ref(false)
const updateVisible = ref(false)
const currentRecord = ref(null)
const submitLoading = ref(false)

// 更新表单
const updateForm = reactive({
  quantity: 0,
  remark: ''
})

// 扫码相关状态
const isScanning = ref(false)
const lastScannedBarcode = ref('')
const scanStatusText = ref('扫码模式已关闭')
let scannedData = '' // 用于存储连续扫描的字符
let lastScanTime = 0 // 用于判断扫描间隔

// 扫码枪监听函数
function handleKeyDown(event) {
  if (!isScanning.value) return
  
  const currentTime = new Date().getTime()
  
  // 判断是否是扫码枪的快速输入
  // 如果上一次按键时间与当前时间间隔超过50毫秒，则认为是一次新的扫码开始
  if (currentTime - lastScanTime > 50) {
    scannedData = ''
  }
  lastScanTime = currentTime
  
  // 检查是否是回车键
  if (event.key === 'Enter') {
    event.preventDefault() // 阻止回车键的默认行为
    processBarcode(scannedData) // 处理收集到的条码数据
    scannedData = '' // 清空数据，准备下一次扫描
  } else if (event.key.length === 1) { // 收集单个字符
    scannedData += event.key
  }
}

// 处理扫码结果
async function processBarcode(barcode) {
  const trimmedBarcode = barcode.trim()
  
  if (!trimmedBarcode) {
    ElMessage.warning('未扫描到有效条码，请重试！')
    return
  }
  
  lastScannedBarcode.value = trimmedBarcode
  
  try {
    const res = await inventoryApi.scanInventory(trimmedBarcode)
    if (res.code === 200) {
      ElMessage.success(`入库成功！批次号：${trimmedBarcode}`)
      // 刷新库存列表
      loadInventoryList()
    } else {
      ElMessage.error(res.message || '入库失败')
    }
  } catch (error) {
    console.error('扫码入库失败', error)
    ElMessage.error('扫码入库失败，请检查网络或服务器')
  }
}

// 切换扫码模式
function toggleScanMode() {
  isScanning.value = !isScanning.value
  scanStatusText.value = isScanning.value ? '扫码模式已开启，等待扫码...' : '扫码模式已关闭'
  
  if (isScanning.value) {
    ElMessage.success('扫码模式已开启，请使用扫码枪扫描条码')
  } else {
    ElMessage.info('扫码模式已关闭')
    lastScannedBarcode.value = ''
  }
}

// 加载库存列表
async function loadInventoryList() {
  loading.value = true
  try {
    let res
    const params = {
      page: currentPage.value,
      size: pageSize.value
    }
    
    if (searchForm.keyword) {
      // 根据批次号查询
      res = await inventoryApi.getInventoryByBatchNumber(searchForm.keyword)
      if (res.code === 200 && res.data) {
        // 批次号查询返回单个对象，包装成数组
        inventoryList.value = [res.data]
        total.value = 1
      } else {
        inventoryList.value = []
        total.value = 0
      }
    } else if (searchForm.lowStock) {
      // 库存不足查询，阈值设为20%
      res = await inventoryApi.getLowStock(20, params.page, params.size)
      if (res.code === 200) {
        inventoryList.value = res.data.records || []
        total.value = res.data.total || 0
      } else {
        inventoryList.value = []
        total.value = 0
      }
    } else {
      // 获取所有库存列表
      res = await inventoryApi.listInventory(params.page, params.size)
      if (res.code === 200) {
        inventoryList.value = res.data.records || []
        total.value = res.data.total || 0
      } else {
        inventoryList.value = []
        total.value = 0
      }
    }
    
    // 获取食品名称
    if (inventoryList.value.length > 0) {
      const foodIds = [...new Set(inventoryList.value.map(item => item.foodId))]
      console.log('获取到的foodIds列表:', foodIds)
      
      for (const id of foodIds) {
        if (!foodCache.value[id]) {
          try {
            console.log('正在获取食品ID:', id)
            const foodRes = await foodApi.getFoodById(id)
            console.log('获取到的食品信息:', foodRes)
            
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

// 获取食品名称
function getFoodName(foodId) {
  return foodCache.value[foodId] || `加载中...(ID:${foodId})`
}

// 重置搜索条件
function resetSearch() {
  searchForm.keyword = ''
  searchForm.lowStock = ''
  loadInventoryList()
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

// 查看详情
function handleView(row) {
  currentRecord.value = {...row}
  detailVisible.value = true
}

// 更新库存
function handleUpdate(row) {
  currentRecord.value = {...row}
  updateForm.quantity = row.remainingQuantity
  updateForm.remark = ''
  updateVisible.value = true
}

// 提交更新
async function submitUpdate() {
  if (updateForm.quantity === currentRecord.value.remainingQuantity) {
    ElMessage.warning('库存数量未发生变化')
    return
  }
  
  if (updateForm.quantity < 0 || updateForm.quantity > currentRecord.value.totalQuantity) {
    ElMessage.error('库存数量不能小于0或大于总数量')
    return
  }
  
  try {
    submitLoading.value = true
    const res = await inventoryApi.updateQuantity(currentRecord.value.id, updateForm.quantity)
    if (res.code === 200) {
      ElMessage.success('库存调整成功')
      updateVisible.value = false
      loadInventoryList()
    } else {
      ElMessage.error(res.message || '库存调整失败')
    }
  } catch (error) {
    console.error('库存调整失败', error)
    ElMessage.error('库存调整失败')
  } finally {
    submitLoading.value = false
  }
}

// 复制交易哈希
function copyTransactionHash() {
  if (!currentRecord.value?.transactionHash) return;
  
  // 使用navigator.clipboard API复制到剪贴板
  navigator.clipboard.writeText(currentRecord.value.transactionHash)
    .then(() => {
      ElMessage.success('交易哈希已复制到剪贴板');
    })
    .catch(err => {
      console.error('无法复制交易哈希:', err);
      ElMessage.error('复制失败');
    });
}

// 格式化交易哈希，显示前10个和后10个字符，中间使用省略号
function formatTransactionHash(hash) {
  if (!hash) return '';
  if (hash.length <= 25) return hash;
  return `${hash.substring(0, 10)}...${hash.substring(hash.length - 10)}`;
}

// 初始化
onMounted(() => {
  loadInventoryList()
  // 添加键盘事件监听
  document.addEventListener('keydown', handleKeyDown)
})

// 清理
onUnmounted(() => {
  // 移除键盘事件监听
  document.removeEventListener('keydown', handleKeyDown)
})
</script>

<style scoped>
.inventory-detail {
  max-height: 70vh;
  overflow-y: auto;
}

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

/* 扫码状态指示器样式 */
.scan-status-indicator {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 6px;
  background-color: #f5f7fa;
  transition: all 0.3s ease;
}

.scan-status-indicator.scanning {
  background-color: #f0f9ff;
  border: 1px solid #e0f2fe;
}

.scan-notice {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}
</style>