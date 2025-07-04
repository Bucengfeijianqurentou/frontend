<template>
  <div class="p-4">
    <el-card class="w-full shadow-md">
      <template #header>
        <div class="flex justify-between items-center py-2">
          <div class="flex items-center">
            <el-icon class="text-blue-500 mr-2 text-xl"><ShoppingCart /></el-icon>
            <span class="text-xl font-medium">采购管理</span>
          </div>
          <div class="flex items-center gap-4">
            <!-- 扫码入库提示区域 -->
            <div class="scan-status-indicator" :class="{ 'scanning': isScanning }">
              <el-icon class="text-green-500 mr-1"><Camera /></el-icon>
              <span class="text-sm text-gray-600">{{ scanStatusText }}</span>
            </div>
            <el-button type="success" size="large" @click="toggleScanMode" :icon="isScanning ? VideoPause : VideoPlay">
              {{ isScanning ? '停止扫码' : '开启扫码' }}
            </el-button>
            <el-button type="primary" size="large" @click="dialogVisible = true" class="bg-blue-500 hover:bg-blue-600">
              <el-icon class="mr-1"><Plus /></el-icon>新增采购
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
          placeholder="搜索食品名称/批次号"
          class="w-64"
          clearable
          size="large"
          @clear="loadPurchaseList"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        
        <el-date-picker
          v-model="searchForm.dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          class="w-96"
          size="large"
          style="--el-date-editor-width: 100%;"
        />
        
        <el-select
          v-model="searchForm.supplier"
          placeholder="选择供应商"
          clearable
          class="w-64"
          size="large"
        >
          <el-option
            v-for="item in supplierOptions"
            :key="item.id"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
        
        <el-button type="primary" size="large" @click="loadPurchaseList" class="bg-blue-500 hover:bg-blue-600">
          <el-icon class="mr-1"><Search /></el-icon>搜索
        </el-button>
        <el-button size="large" @click="resetSearch">
          <el-icon class="mr-1"><Refresh /></el-icon>重置
        </el-button>
      </div>

      <!-- 数据表格 -->
      <el-table
        v-loading="loading"
        :data="purchaseList"
        border
        stripe
        style="width: 100%"
        class="rounded-md overflow-hidden"
        :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }"
      >
        <el-table-column prop="id" label="ID" width="80" align="center" />
        <el-table-column prop="name" label="食品名称" min-width="120" align="center" />
        <el-table-column prop="supplier" label="供应商" min-width="150" align="center" />
        <el-table-column prop="batchNumber" label="批次号" min-width="180" align="center" />
        <el-table-column prop="quantity" label="数量" width="100" align="center" />
        <el-table-column prop="specification" label="规格" width="100" align="center" />
        <el-table-column label="采购日期" min-width="120" align="center">
          <template #default="scope">
            {{ scope.row.purchaseDate }}
          </template>
        </el-table-column>
        <el-table-column label="图片" width="120" align="center">
          <template #default="scope">
            <el-image
              v-if="scope.row.imagePath"
              :src="`${apiBaseUrl}${scope.row.imagePath}`"
              fit="cover"
              class="w-16 h-16 cursor-pointer rounded-md border border-gray-200 shadow-sm object-cover hover:shadow-md transition-all"
              @click="previewImage(scope.row.imagePath)"
            />
            <span v-else>-</span>
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
        <el-table-column label="操作" width="250" fixed="right" align="center">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="handleView(scope.row)" class="text-blue-500 hover:text-blue-700 font-medium">
              <el-icon class="mr-1"><View /></el-icon>详情
            </el-button>
            <el-divider direction="vertical" />
            <el-button link type="success" size="small" @click="showBarcode(scope.row)" class="text-green-500 hover:text-green-700 font-medium">
              <el-icon class="mr-1"><Picture /></el-icon>条形码
            </el-button>
            <el-divider direction="vertical" />
            <el-button link type="danger" size="small" @click="handleDelete(scope.row)" class="text-red-500 hover:text-red-700 font-medium">
              <el-icon class="mr-1"><Delete /></el-icon>删除
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

      <!-- 图片预览 -->
      <el-image-viewer
        v-if="showViewer"
        :url-list="[`${apiBaseUrl}${currentImage}`]"
        @close="showViewer = false"
      />
    </el-card>

    <!-- 条形码预览弹窗 -->
    <el-dialog
      v-model="barcodeDialogVisible"
      title="条形码"
      width="500px"
      center
    >
      <div class="barcode-container">
        <div class="barcode-info">
          <p><strong>批次号：</strong>{{ currentBatchNumber }}</p>
          <p><strong>食品名称：</strong>{{ currentFoodName }}</p>
        </div>
        <div class="barcode-display">
          <canvas ref="barcodeCanvas" id="barcode-canvas"></canvas>
        </div>
        <div class="barcode-actions">
          <el-button type="primary" @click="downloadBarcode">
            <el-icon><Download /></el-icon>
            下载条形码
          </el-button>
          <el-button @click="printBarcode">
            <el-icon><Printer /></el-icon>
            打印条形码
          </el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 采购单弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      width="60%"
      destroy-on-close
      :show-close="true"
      :close-on-click-modal="false"
    >
      <template #header>
        <div class="flex items-center">
          <el-icon class="text-blue-500 mr-2"><Plus /></el-icon>
          <span class="text-lg font-medium">新增采购</span>
        </div>
      </template>
      <div class="p-4">
        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-width="100px"
          class="mx-auto"
        >
          <!-- 食品基本信息 -->
          <div class="mb-4">
            <div class="flex items-center mb-2">
              <el-icon class="mr-2 text-gray-500"><CircleCheck /></el-icon>
              <span class="text-gray-700 font-medium">食品基本信息</span>
            </div>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="食品名称" prop="name">
                  <el-input v-model="form.name" placeholder="请输入食品名称"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="食品描述" prop="description">
                  <el-input v-model="form.description" placeholder="请输入食品描述"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <!-- 采购信息 -->
          <div class="mb-4">
            <div class="flex items-center mb-2">
              <el-icon class="mr-2 text-gray-500"><ShoppingCart /></el-icon>
              <span class="text-gray-700 font-medium">采购信息</span>
            </div>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="供应商" prop="supplier">
                  <el-select v-model="form.supplier" placeholder="请选择供应商" class="w-full">
                    <el-option
                      v-for="item in supplierOptions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.name"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="批次号">
                  <el-input v-model="form.batchNumber" disabled></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="采购数量" prop="quantity">
                  <el-input-number v-model="form.quantity" :min="1" class="w-full"></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="采购规格" prop="specification">
                  <el-select v-model="form.specification" placeholder="请选择采购规格" class="w-full" @change="handleSpecificationChange">
                    <el-option
                      v-for="item in specificationOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item v-if="showCustomSpecification" label="自定义规格" prop="customSpecification">
                  <el-input v-model="customSpecification" placeholder="请输入自定义规格"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="采购日期" prop="purchaseDate">
                  <el-date-picker
                    v-model="form.purchaseDate"
                    type="date"
                    placeholder="选择采购日期"
                    class="w-full"
                    value-format="YYYY-MM-DD"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="生产日期" prop="productionDate">
                  <el-date-picker
                    v-model="form.productionDate"
                    type="date"
                    placeholder="选择生产日期"
                    class="w-full"
                    value-format="YYYY-MM-DD"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="保质期(天)" prop="shelfLife">
                  <el-input-number v-model="form.shelfLife" :min="1" class="w-full"></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <!-- 此处可以添加其他字段 -->
              </el-col>
            </el-row>
          </div>

          <!-- 图片上传 -->
          <div class="mb-4">
            <div class="flex items-center mb-2">
              <el-icon class="mr-2 text-gray-500"><Picture /></el-icon>
              <span class="text-gray-700 font-medium">相关图片</span>
            </div>
            <el-form-item label="采购凭证" prop="imagePath">
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
          </div>

          <!-- 提交按钮 -->
          <div class="flex justify-center mt-6">
            <el-button type="primary" @click="submitForm" :loading="submitLoading" class="mr-4">
              提交
            </el-button>
            <el-button @click="dialogVisible = false">取消</el-button>
          </div>
        </el-form>
      </div>
    </el-dialog>

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
          <span class="text-xl font-medium">采购详情</span>
        </div>
      </template>
      <div v-if="currentRecord" class="purchase-detail p-2">
        <el-descriptions :column="4" border class="rounded-lg overflow-hidden" :label-style="{ 'background-color': '#f5f7fa', 'font-weight': 'bold' }">
          <el-descriptions-item label="ID" label-align="center" align="center">{{ currentRecord.id }}</el-descriptions-item>
          <el-descriptions-item label="食品名称" label-align="center" align="center">{{ currentRecord.name }}</el-descriptions-item>
          <el-descriptions-item label="供应商" label-align="center" align="center">{{ currentRecord.supplier }}</el-descriptions-item>
          <el-descriptions-item label="批次号" label-align="center" align="center">{{ currentRecord.batchNumber }}</el-descriptions-item>
          <el-descriptions-item label="采购数量" label-align="center" align="center">{{ currentRecord.quantity }}</el-descriptions-item>
          <el-descriptions-item label="采购规格" label-align="center" align="center">{{ currentRecord.specification || '-' }}</el-descriptions-item>
          <el-descriptions-item label="采购日期" label-align="center" align="center">{{ currentRecord.purchaseDate }}</el-descriptions-item>
          <el-descriptions-item label="生产日期" label-align="center" align="center">{{ currentRecord.productionDate }}</el-descriptions-item>
          <el-descriptions-item label="保质期(天)" label-align="center" align="center">{{ currentRecord.shelfLife }}</el-descriptions-item>
          <el-descriptions-item label="采购人员" label-align="center" align="center">{{ purchaserName }}</el-descriptions-item>
          <el-descriptions-item label="联系电话" label-align="center" align="center">{{ purchaserPhone || '-' }}</el-descriptions-item>
          <el-descriptions-item label="交易哈希" label-align="center" align="center" :span="4">
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
        
        <div class="mt-6" v-if="currentRecord.imagePath">
          <div class="text-gray-600 mb-2 font-medium flex items-center">
            <el-icon class="mr-1"><Picture /></el-icon>
            采购凭证:
          </div>
          <div class="flex justify-center">
            <el-image
              :src="`${apiBaseUrl}${currentRecord.imagePath}`"
              fit="contain"
              class="max-h-80 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-all border border-gray-200"
              @click="previewImage(currentRecord.imagePath)"
            />
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ShoppingCart, Plus, Search, Refresh, View, Delete, Check, Upload, Picture, InfoFilled, Food, CircleCheck, Phone, Document, Download, Printer, Camera, VideoPlay, VideoPause } from '@element-plus/icons-vue'
import { getToken } from '@/utils/auth'
import { usePurchaseApi } from '@/api/purchase'
import { useSupplierApi } from '@/api/supplier'
import { useInventoryApi } from '@/api/inventory'
import { useUserStore } from '@/stores/user'
import { getUserById } from '@/api/user'
import JsBarcode from 'jsbarcode'

const purchaseApi = usePurchaseApi()
const supplierApi = useSupplierApi()
const inventoryApi = useInventoryApi()
const userStore = useUserStore()

// API基础URL变量
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || ''

// 列表数据
const loading = ref(false)
const purchaseList = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 搜索表单
const searchForm = reactive({
  keyword: '',
  dateRange: [],
  supplier: ''
})

// 弹窗控制
const dialogVisible = ref(false)
const detailVisible = ref(false)
const currentRecord = ref(null)
const purchaserName = ref('') // 采购人员姓名
const purchaserPhone = ref('') // 采购人员电话

// 图片预览
const showViewer = ref(false)
const currentImage = ref('')

// 扫码相关状态
const isScanning = ref(false)
const lastScannedBarcode = ref('')
const scanStatusText = ref('扫码模式已关闭')
let scannedData = '' // 用于存储连续扫描的字符
let lastScanTime = 0 // 用于判断扫描间隔

// 条形码相关状态
const barcodeDialogVisible = ref(false)
const currentBatchNumber = ref('')
const currentFoodName = ref('')
const barcodeCanvas = ref(null)

// 供应商选项
const supplierOptions = ref([])

// 规格选项
const specificationOptions = [
  { value: '斤', label: '斤' },
  { value: '公斤', label: '公斤' },
  { value: '克', label: '克' },
  { value: '吨', label: '吨' },
  { value: '箱', label: '箱' },
  { value: '瓶', label: '瓶' },
  { value: '袋', label: '袋' },
  { value: '桶', label: '桶' },
  { value: '盒', label: '盒' },
  { value: '包', label: '包' },
  { value: '罐', label: '罐' },
  { value: '杯', label: '杯' },
  { value: '片', label: '片' },
  { value: '个', label: '个' },
  { value: '块', label: '块' },
  { value: '捆', label: '捆' },
  { value: '支', label: '支' },
  { value: '托盘', label: '托盘' },
  { value: '打', label: '打(12个)' },
  { value: '件', label: '件' },
  { value: '其他', label: '其他' }
]

// 是否显示自定义规格输入框
const showCustomSpecification = ref(false)

// 自定义规格
const customSpecification = ref('')

// 处理规格变化
function handleSpecificationChange(value) {
  showCustomSpecification.value = value === '其他'
  if (value !== '其他') {
    customSpecification.value = ''
  }
}

// 表单引用
const formRef = ref(null)
const submitLoading = ref(false)
const fileList = ref([])

// 上传配置
const uploadHeaders = {
  Authorization: getToken()
}

// 表单数据
const form = reactive({
  name: '',
  description: '',
  supplier: '',
  batchNumber: generateBatchNumber(),
  quantity: 1,
  specification: '',
  purchaseDate: new Date().toISOString().split('T')[0],
  productionDate: '',
  shelfLife: 30,
  purchaserId: userStore.user?.id || '',
  imagePath: ''
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入食品名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符之间', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入食品描述', trigger: 'blur' }
  ],
  supplier: [
    { required: true, message: '请选择供应商', trigger: 'change' }
  ],
  quantity: [
    { required: true, message: '请输入采购数量', trigger: 'change' },
    { type: 'number', min: 1, message: '数量必须大于0', trigger: 'change' }
  ],
  specification: [
    { required: true, message: '请输入采购规格', trigger: 'blur' }
  ],
  purchaseDate: [
    { required: true, message: '请选择采购日期', trigger: 'change' }
  ],
  productionDate: [
    { required: true, message: '请选择生产日期', trigger: 'change' }
  ],
  shelfLife: [
    { required: true, message: '请输入保质期', trigger: 'change' },
    { type: 'number', min: 1, message: '保质期必须大于0', trigger: 'change' }
  ],
  imagePath: [
    { required: true, message: '请上传采购凭证图片', trigger: 'change' }
  ]
}

// 加载采购列表
async function loadPurchaseList() {
  loading.value = true
  try {
    let res;
    
    // 构建基本参数
    const params = {
      page: currentPage.value,
      size: pageSize.value
    };
    
    // 处理不同的搜索情况
    if (searchForm.keyword) {
      // 如果关键词像是批次号格式，则使用专门的批次号API
      if (searchForm.keyword.startsWith('PO-')) {
        res = await purchaseApi.getPurchaseByBatchNumber(searchForm.keyword);
        // 批次号API会返回单个对象，需要包装成列表格式
        if (res.code === 200 && res.data) {
          purchaseList.value = [res.data];
          total.value = 1;
        } else {
          purchaseList.value = [];
          total.value = 0;
        }
        loading.value = false;
        return;
      }
    }
    
    // 其他搜索类型
    if (searchForm.supplier) {
      params.supplier = searchForm.supplier;
      res = await purchaseApi.getPurchaseBySupplier(
        params.supplier,
        params.page,
        params.size
      );
    } else if (searchForm.dateRange && searchForm.dateRange.length === 2) {
      params.startDate = searchForm.dateRange[0];
      params.endDate = searchForm.dateRange[1];
      res = await purchaseApi.getPurchaseByDateRange(
        params.startDate,
        params.endDate,
        params.page,
        params.size
      );
    } else if (searchForm.keyword) {
      // 关键词搜索（非批次号格式）- 这里传递keyword参数到通用列表API
      params.keyword = searchForm.keyword;
      res = await purchaseApi.listPurchases(params.page, params.size, params.keyword);
    } else {
      // 无搜索条件，获取所有列表
      res = await purchaseApi.listPurchases(params.page, params.size);
    }
    
    if (res && res.code === 200) {
      purchaseList.value = res.data.records || [];
      total.value = res.data.total || 0;
    } else {
      purchaseList.value = [];
      total.value = 0;
      ElMessage.warning(res?.message || '没有找到匹配的记录');
    }
  } catch (error) {
    console.error('获取采购列表失败', error);
    ElMessage.error('获取采购列表失败');
    purchaseList.value = [];
    total.value = 0;
  } finally {
    loading.value = false;
  }
}

// 重置搜索条件
function resetSearch() {
  searchForm.keyword = ''
  searchForm.dateRange = []
  searchForm.supplier = ''
  loadPurchaseList()
}

// 分页处理
function handleSizeChange(size) {
  pageSize.value = size
  loadPurchaseList()
}

function handleCurrentChange(page) {
  currentPage.value = page
  loadPurchaseList()
}

// 查看详情
async function handleView(row) {
  currentRecord.value = {...row}
  detailVisible.value = true
  
  // 获取采购人员信息
  if (row.purchaserId) {
    try {
      const res = await getUserById(row.purchaserId)
      if (res && res.id) {
        purchaserName.value = res.realName || res.username || `ID:${row.purchaserId}`
        purchaserPhone.value = res.phone || '未知'
      } else {
        purchaserName.value = `未知(ID:${row.purchaserId})`
        purchaserPhone.value = '未知'
      }
    } catch (error) {
      console.error('获取采购人员信息失败', error)
      purchaserName.value = `未知(ID:${row.purchaserId})`
      purchaserPhone.value = '未知'
    }
  } else {
    purchaserName.value = '未知'
    purchaserPhone.value = '未知'
  }
}

// 删除采购记录
function handleDelete(row) {
  ElMessageBox.confirm('确定要删除这条采购记录吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const res = await purchaseApi.deletePurchase(row.id)
      if (res.code === 200) {
        ElMessage.success('删除成功')
        loadPurchaseList()
      } else {
        ElMessage.error(res.msg || '删除失败')
      }
    } catch (error) {
      console.error('删除失败', error)
      ElMessage.error('删除失败')
    }
  }).catch(() => {})
}

// 生成批次号
function generateBatchNumber() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  
  // 添加批次号前缀 PO (Purchase Order)
  return `PO-${year}${month}${day}-${hours}${minutes}${seconds}-${random}`
}

// 获取供应商列表
async function fetchSuppliers() {
  try {
    const res = await supplierApi.getAllSuppliers()
    supplierOptions.value = res.data || []
  } catch (error) {
    console.error('获取供应商列表失败', error)
    ElMessage.error('获取供应商列表失败')
  }
}

// 上传前的验证
function beforeUpload(file) {
  const isImage = /\.(jpg|jpeg|png)$/i.test(file.name)
  const isLt10M = file.size / 1024 / 1024 < 10

  if (!isImage) {
    ElMessage.error('上传图片只能是 JPG/JPEG/PNG 格式!')
    return false
  }
  if (!isLt10M) {
    ElMessage.error('上传图片大小不能超过 10MB!')
    return false
  }
  return true
}

// 上传成功回调
function handleUploadSuccess(response) {
  if (response.code === 200) {
    form.imagePath = response.data
    ElMessage.success('图片上传成功')
  } else {
    ElMessage.error('图片上传失败')
  }
}

// 上传失败回调
function handleUploadError() {
  ElMessage.error('图片上传失败')
}

// 预览图片
function previewImage(imagePath) {
  currentImage.value = imagePath
  showViewer.value = true
}

// 提交表单
async function submitForm() {
  if (!formRef.value) return
  
  // 确保有采购人ID
  if (!form.purchaserId) {
    if (userStore.user?.id) {
      form.purchaserId = userStore.user.id
    } else {
      ElMessage.error('无法获取当前用户信息，请重新登录')
      return
    }
  }

  // 如果选择了"其他"规格但未填写自定义规格
  if (form.specification === '其他' && !customSpecification.value) {
    ElMessage.error('请输入自定义采购规格')
    return
  }
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        submitLoading.value = true

        // 如果选择了"其他"规格，使用自定义规格值
        const submitData = { ...form }
        if (submitData.specification === '其他') {
          submitData.specification = customSpecification.value
        }

        const res = await purchaseApi.createPurchase(submitData)
        if (res.code === 200) {
          ElMessage.success('采购单创建成功')
          dialogVisible.value = false
          resetForm()
          loadPurchaseList() // 刷新列表
        } else {
          ElMessage.error(res.msg || '采购单创建失败')
        }
      } catch (error) {
        console.error('采购单创建失败', error)
        ElMessage.error('采购单创建失败')
      } finally {
        submitLoading.value = false
      }
    }
  })
}

// 重置表单
function resetForm() {
  if (!formRef.value) return
  formRef.value.resetFields()
  form.batchNumber = generateBatchNumber() // 重新生成批次号
  form.purchaseDate = new Date().toISOString().split('T')[0] // 重置采购日期为当天
  fileList.value = [] // 清空文件列表
  customSpecification.value = '' // 清空自定义规格
  showCustomSpecification.value = false // 隐藏自定义规格输入框
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
      // 刷新采购列表
      loadPurchaseList()
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

// 显示条形码
async function showBarcode(row) {
  currentBatchNumber.value = row.batchNumber
  currentFoodName.value = row.name
  barcodeDialogVisible.value = true
  
  // 等待DOM更新后生成条形码
  await nextTick()
  generateBarcode(row.batchNumber)
}

// 生成条形码
function generateBarcode(batchNumber) {
  if (barcodeCanvas.value) {
    try {
      JsBarcode(barcodeCanvas.value, batchNumber, {
        format: "CODE128",
        width: 2,
        height: 100,
        displayValue: true,
        fontSize: 14,
        margin: 10
      })
    } catch (error) {
      console.error('条形码生成失败:', error)
      ElMessage.error('条形码生成失败')
    }
  }
}

// 下载条形码
function downloadBarcode() {
  if (barcodeCanvas.value) {
    const link = document.createElement('a')
    link.download = `barcode_${currentBatchNumber.value}.png`
    link.href = barcodeCanvas.value.toDataURL()
    link.click()
  }
}

// 打印条形码
function printBarcode() {
  if (barcodeCanvas.value) {
    const printWindow = window.open('', '_blank')
    const canvas = barcodeCanvas.value
    const dataURL = canvas.toDataURL()
    
    printWindow.document.write(`
      <html>
        <head>
          <title>打印条形码 - ${currentBatchNumber.value}</title>
          <style>
            body { 
              margin: 0; 
              padding: 20px; 
              text-align: center; 
              font-family: Arial, sans-serif;
            }
            .barcode-info {
              margin-bottom: 20px;
              font-size: 14px;
            }
            img {
              max-width: 100%;
            }
          </style>
        </head>
        <body>
          <div class="barcode-info">
            <p><strong>批次号：</strong>${currentBatchNumber.value}</p>
            <p><strong>食品名称：</strong>${currentFoodName.value}</p>
          </div>
          <img src="${dataURL}" alt="条形码" />
        </body>
      </html>
    `)
    
    printWindow.document.close()
    printWindow.print()
  }
}

// 初始化
onMounted(async () => {
  // 确保有用户信息
  if (!userStore.user) {
    await userStore.getUserInfoAction()
    // 更新表单中的采购人ID
    form.purchaserId = userStore.user?.id || ''
  }
  
  fetchSuppliers()
  loadPurchaseList()
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
.purchase-detail {
  max-height: 70vh;
  overflow-y: auto;
}

.el-divider {
  margin: 16px 0;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}

:deep(.el-input__inner) {
  height: 40px;
}

:deep(.el-upload--picture-card) {
  width: 200px;
  height: 200px;
  line-height: 200px;
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

:deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active) {
  background-color: #409eff;
}

:deep(.el-range-editor.el-input__wrapper) {
  width: 360px !important;
}

:deep(.el-range-editor .el-range-input) {
  width: 42% !important;
}

.barcode-container {
  text-align: center;
}

.barcode-info {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.barcode-info p {
  margin: 5px 0;
  color: #606266;
}

.barcode-display {
  margin: 20px 0;
  padding: 20px;
  border: 1px dashed #dcdfe6;
  border-radius: 4px;
  background-color: #fff;
}

.barcode-actions {
  margin-top: 20px;
}

.barcode-actions .el-button {
  margin: 0 10px;
}

#barcode-canvas {
  max-width: 100%;
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

