<template>
  <div class="p-4">
    <el-card class="w-full">
      <template #header>
        <div class="flex justify-between items-center">
          <div class="flex items-center">
            <el-icon class="mr-2"><ShoppingCart /></el-icon>
            <span>采购管理</span>
          </div>
          <el-button type="primary" @click="dialogVisible = true">
            <el-icon class="mr-1"><Plus /></el-icon>新增采购
          </el-button>
        </div>
      </template>

      <!-- 搜索区域 -->
      <div class="mb-4 flex gap-4 flex-wrap">
        <el-input
          v-model="searchForm.keyword"
          placeholder="搜索食品名称/批次号"
          class="w-60"
          clearable
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
          class="w-80"
        />
        
        <el-select
          v-model="searchForm.supplier"
          placeholder="选择供应商"
          clearable
          class="w-60"
        >
          <el-option
            v-for="item in supplierOptions"
            :key="item.id"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
        
        <el-button type="primary" @click="loadPurchaseList">
          <el-icon class="mr-1"><Search /></el-icon>搜索
        </el-button>
        <el-button @click="resetSearch">
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
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="食品名称" min-width="120" />
        <el-table-column prop="supplier" label="供应商" min-width="120" />
        <el-table-column prop="batchNumber" label="批次号" min-width="180" />
        <el-table-column prop="quantity" label="数量" width="100" />
        <el-table-column label="采购日期" min-width="120">
          <template #default="scope">
            {{ scope.row.purchaseDate }}
          </template>
        </el-table-column>
        <el-table-column label="图片" width="100">
          <template #default="scope">
            <el-image
              v-if="scope.row.imagePath"
              :src="`${apiBaseUrl}${scope.row.imagePath}`"
              fit="cover"
              class="w-12 h-12 cursor-pointer"
              @click="previewImage(scope.row.imagePath)"
            />
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="scope">
            <el-button link type="primary" @click="handleView(scope.row)">
              详情
            </el-button>
            <el-divider direction="vertical" />
            <el-button link type="danger" @click="handleDelete(scope.row)">
              删除
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
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
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

    <!-- 采购单弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      title="新增采购"
      width="70%"
      destroy-on-close
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
        class="max-w-4xl mx-auto"
      >
        <!-- 食品基本信息 -->
        <el-divider content-position="left">食品基本信息</el-divider>
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

        <!-- 采购信息 -->
        <el-divider content-position="left">采购信息</el-divider>
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
            <el-form-item label="批次号" prop="batchNumber">
              <el-input v-model="form.batchNumber" placeholder="系统自动生成" disabled></el-input>
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
        </el-row>
        <el-row :gutter="20">
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
          <el-col :span="12">
            <el-form-item label="保质期(天)" prop="shelfLife">
              <el-input-number v-model="form.shelfLife" :min="1" class="w-full"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 图片上传 -->
        <el-divider content-position="left">相关图片</el-divider>
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
            list-type="picture"
          >
            <el-button type="primary">点击上传</el-button>
            <template #tip>
              <div class="el-upload__tip text-gray-500 mt-1">
                只能上传jpg/png/jpeg文件，且不超过10MB
              </div>
            </template>
          </el-upload>
        </el-form-item>

        <!-- 提交按钮 -->
        <el-form-item>
          <el-button type="primary" @click="submitForm" :loading="submitLoading">提交</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 详情弹窗 -->
    <el-dialog
      v-model="detailVisible"
      title="采购详情"
      width="60%"
    >
      <div v-if="currentRecord" class="purchase-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="ID">{{ currentRecord.id }}</el-descriptions-item>
          <el-descriptions-item label="食品名称">{{ currentRecord.name }}</el-descriptions-item>
          <el-descriptions-item label="供应商">{{ currentRecord.supplier }}</el-descriptions-item>
          <el-descriptions-item label="批次号">{{ currentRecord.batchNumber }}</el-descriptions-item>
          <el-descriptions-item label="采购数量">{{ currentRecord.quantity }}</el-descriptions-item>
          <el-descriptions-item label="采购日期">{{ currentRecord.purchaseDate }}</el-descriptions-item>
          <el-descriptions-item label="生产日期">{{ currentRecord.productionDate }}</el-descriptions-item>
          <el-descriptions-item label="保质期(天)">{{ currentRecord.shelfLife }}</el-descriptions-item>
        </el-descriptions>
        
        <div class="mt-4" v-if="currentRecord.imagePath">
          <div class="text-gray-600 mb-2">采购凭证:</div>
          <el-image
            :src="`${apiBaseUrl}${currentRecord.imagePath}`"
            fit="contain"
            class="max-h-60 cursor-pointer"
            @click="previewImage(currentRecord.imagePath)"
          />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ShoppingCart, Plus, Search, Refresh } from '@element-plus/icons-vue'
import { getToken } from '@/utils/auth'
import { usePurchaseApi } from '@/api/purchase'
import { useSupplierApi } from '@/api/supplier'
import { useUserStore } from '@/stores/user'

const purchaseApi = usePurchaseApi()
const supplierApi = useSupplierApi()
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

// 图片预览
const showViewer = ref(false)
const currentImage = ref('')

// 供应商选项
const supplierOptions = ref([])

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
    // 处理日期范围
    const params = {
      page: currentPage.value,
      size: pageSize.value
    }
    
    if (searchForm.keyword) {
      params.keyword = searchForm.keyword
    }
    
    if (searchForm.supplier) {
      params.supplier = searchForm.supplier
    }
    
    if (searchForm.dateRange && searchForm.dateRange.length === 2) {
      params.startDate = searchForm.dateRange[0]
      params.endDate = searchForm.dateRange[1]
      const res = await purchaseApi.getPurchaseByDateRange(
        params.startDate,
        params.endDate,
        params.page,
        params.size
      )
      purchaseList.value = res.data.records || []
      total.value = res.data.total || 0
    } else {
      const res = await purchaseApi.listPurchases(params.page, params.size)
      purchaseList.value = res.data.records || []
      total.value = res.data.total || 0
    }
  } catch (error) {
    console.error('获取采购列表失败', error)
    ElMessage.error('获取采购列表失败')
  } finally {
    loading.value = false
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
function handleView(row) {
  currentRecord.value = row
  detailVisible.value = true
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
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        submitLoading.value = true
        const res = await purchaseApi.createPurchase(form)
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
})
</script>

<style scoped>
.purchase-detail {
  max-height: 70vh;
  overflow-y: auto;
}
</style> 