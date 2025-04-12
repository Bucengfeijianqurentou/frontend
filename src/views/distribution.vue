<template>
  <div class="p-4">
    <el-card class="w-full mb-4">
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <el-icon class="mr-2"><Box /></el-icon>
            <span>食品发放管理</span>
          </div>
          <div>
            <el-button type="primary" size="small" @click="resetSearch">
              <el-icon class="mr-1"><Refresh /></el-icon>重置
            </el-button>
          </div>
        </div>
      </template>
      
      <!-- 搜索区域 -->
      <div class="mb-4">
        <el-form :inline="true" :model="searchForm" class="flex flex-wrap items-end">
          <el-form-item label="时间范围">
            <el-date-picker
              v-model="searchForm.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD HH:mm:ss"
              :shortcuts="dateShortcuts"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">
              <el-icon class="mr-1"><Search /></el-icon>查询
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      
      <!-- 数据表格 -->
      <el-table
        v-loading="loading"
        :data="distributionList"
        border
        stripe
        style="width: 100%"
      >
        <el-table-column
          prop="id"
          label="ID"
          width="80"
        />
        <el-table-column label="菜单信息" min-width="280">
          <template #default="{ row }">
            <div class="flex items-start gap-3">
              <div v-if="row.imagePath" class="flex-shrink-0">
                <el-image
                  :src="getImageUrl(row.imagePath)"
                  fit="cover"
                  style="width: 60px; height: 60px"
                  :preview-src-list="[getImageUrl(row.imagePath)]"
                />
              </div>
              <div class="flex-grow">
                <div class="mb-1">
                  <span class="text-sm font-bold">日期：</span>
                  <span>{{ formatDate(row.menuDate) }}</span>
                  <el-tag class="ml-2" size="small" :type="getMealTypeTag(row.mealType)">
                    {{ row.mealType }}
                  </el-tag>
                </div>
                <div class="text-sm text-gray-700 line-clamp-2">
                  <span class="font-bold">菜品：</span>{{ row.dishes }}
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="distributionTime"
          label="发放时间"
          width="180"
        />
        <el-table-column
          prop="recipient"
          label="发放对象"
          width="240"
        />
        <el-table-column
          prop="distributor"
          label="发放人"
          width="120"
        />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button 
              link 
              type="primary" 
              size="small" 
              @click="handleViewDetail(row.id)"
            >查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <div class="mt-4 flex justify-end">
        <el-pagination
          :current-page="currentPage"
          :page-size="pageSize"
          :page-sizes="[10, 20, 30, 50]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          @update:page-size="pageSize = $event"
          @update:current-page="currentPage = $event"
        />
      </div>
    </el-card>
    
    <!-- 详情对话框 -->
    <el-dialog
      v-model="detailVisible"
      title="发放记录详情"
      width="600px"
      destroy-on-close
    >
      <div v-if="selectedDistribution">
        <div class="mb-4 p-4 bg-gray-50 rounded">
          <h3 class="text-lg font-bold mb-2">菜单信息</h3>
          <el-row :gutter="20" class="mb-3">
            <el-col :span="24" class="text-center mb-2" v-if="selectedDistribution.imagePath">
              <el-image
                :src="getImageUrl(selectedDistribution.imagePath)"
                fit="cover"
                style="max-height: 200px; max-width: 100%"
                :preview-src-list="[getImageUrl(selectedDistribution.imagePath)]"
              />
            </el-col>
            <el-col :span="12">
              <span class="font-bold">日期：</span>
              {{ formatDate(selectedDistribution.menuDate) }}
            </el-col>
            <el-col :span="12">
              <span class="font-bold">餐次：</span>
              <el-tag size="small" :type="getMealTypeTag(selectedDistribution.mealType)">
                {{ selectedDistribution.mealType }}
              </el-tag>
            </el-col>
            <el-col :span="24" class="mt-2">
              <span class="font-bold">菜品列表：</span>
              <div class="mt-1 text-gray-700">{{ selectedDistribution.dishes }}</div>
            </el-col>
            <el-col :span="24" class="mt-2">
              <span class="font-bold">菜单状态：</span>
              <el-tag size="small" :type="getStatusTag(selectedDistribution.menuStatus)">
                {{ getStatusText(selectedDistribution.menuStatus) }}
              </el-tag>
            </el-col>
          </el-row>
        </div>
        
        <div class="p-4 bg-gray-50 rounded">
          <h3 class="text-lg font-bold mb-2">发放信息</h3>
          <el-row :gutter="20" class="mb-3">
            <el-col :span="12">
              <span class="font-bold">发放时间：</span>
              {{ selectedDistribution.distributionTime }}
            </el-col>
            <el-col :span="12">
              <span class="font-bold">发放人：</span>
              {{ selectedDistribution.distributor }}
            </el-col>
            <el-col :span="24" class="mt-2">
              <span class="font-bold">发放对象：</span>
              <div class="mt-1">
                <el-tag 
                  v-for="(item, index) in formatRecipients(selectedDistribution.recipient)" 
                  :key="index"
                  class="mr-2 mb-2" 
                  effect="plain"
                >
                  {{ item }}
                </el-tag>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Box, Search, Refresh } from '@element-plus/icons-vue'
import { useDistributionApi } from '@/api/distribution'

const distributionApi = useDistributionApi()

// 表格数据相关
const loading = ref(false)
const distributionList = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 搜索相关
const searchForm = ref({
  dateRange: []
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
  }
]

// 详情对话框相关
const detailVisible = ref(false)
const selectedDistribution = ref(null)

// 初始化
onMounted(() => {
  fetchDistributionList()
})

// 获取发放记录列表
const fetchDistributionList = async () => {
  loading.value = true
  try {
    const params = {}
    
    if (searchForm.value.dateRange?.length === 2) {
      params.startTime = searchForm.value.dateRange[0]
      params.endTime = searchForm.value.dateRange[1]
    }
    
    const res = await distributionApi.getDistributions(currentPage.value, pageSize.value, params)
    if (res.code === 200 && res.data) {
      distributionList.value = res.data.records || []
      total.value = res.data.total || 0
    }
  } catch (error) {
    console.error('获取发放记录失败:', error)
    ElMessage.error('获取发放记录失败')
  } finally {
    loading.value = false
  }
}

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1
  fetchDistributionList()
}

// 重置搜索
const resetSearch = () => {
  searchForm.value = {
    dateRange: []
  }
  currentPage.value = 1
  fetchDistributionList()
}

// 分页处理
const handleSizeChange = (size) => {
  pageSize.value = size
  fetchDistributionList()
}

const handleCurrentChange = (page) => {
  currentPage.value = page
  fetchDistributionList()
}

// 查看详情
const handleViewDetail = async (id) => {
  try {
    const res = await distributionApi.getDistributionById(id)
    if (res.code === 200 && res.data) {
      selectedDistribution.value = res.data
      detailVisible.value = true
    } else {
      ElMessage.error('获取发放记录详情失败')
    }
  } catch (error) {
    console.error('获取发放记录详情失败:', error)
    ElMessage.error('获取发放记录详情失败')
  }
}

// 工具函数
const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString()
}

const getImageUrl = (path) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${import.meta.env.VITE_API_BASE_URL}${path}`
}

// 将发放对象字符串分割为数组（用于显示多个Tag标签）
const formatRecipients = (recipientStr) => {
  if (!recipientStr) return []
  return recipientStr.split('，').filter(item => item.trim())
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
</script> 