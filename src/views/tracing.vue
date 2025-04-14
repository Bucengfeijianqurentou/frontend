<template>
  <div class="p-4">
    <el-card class="w-full mb-4">
      <template #header>
        <div class="flex items-center">
          <el-icon class="mr-2 text-blue-500 text-xl"><Link /></el-icon>
          <span class="text-lg font-medium">溯源查询</span>
        </div>
      </template>
      
      <!-- 查询表单 -->
      <div class="mb-6 max-w-3xl mx-auto">
        <el-form 
          ref="queryFormRef" 
          :model="queryForm" 
          :rules="queryRules" 
          label-width="100px" 
          class="bg-gray-50 p-6 rounded-lg"
        >
          <el-form-item label="日期" prop="date">
            <el-date-picker
              v-model="queryForm.date"
              type="date"
              placeholder="请选择日期"
              value-format="YYYY-MM-DD"
              format="YYYY-MM-DD"
              class="w-full"
            />
          </el-form-item>
          
          <el-form-item label="餐次" prop="mealType">
            <el-radio-group v-model="queryForm.mealType">
              <el-radio :label="'早餐'" value="早餐">早餐</el-radio>
              <el-radio :label="'午餐'" value="午餐">午餐</el-radio>
              <el-radio :label="'晚餐'" value="晚餐">晚餐</el-radio>
            </el-radio-group>
          </el-form-item>
          
          <el-form-item label="菜品名称" prop="dishName">
            <el-input
              v-model="queryForm.dishName"
              placeholder="请输入菜品名称，如：蛋炒饭"
            />
          </el-form-item>
          
          <el-form-item class="mt-6">
            <el-button type="primary" @click="handleQuery" :loading="loading">
              <el-icon class="mr-1"><Search /></el-icon>查询
            </el-button>
            <el-button @click="resetForm">
              <el-icon class="mr-1"><Refresh /></el-icon>重置
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      
      <!-- 查询结果 -->
      <div v-if="showResult">
        <el-divider content-position="center">查询结果</el-divider>
        
        <div v-loading="loading">
          <!-- 未找到结果的提示 -->
          <el-empty 
            v-if="!tracingResult || !tracingResult.found" 
          >
            <template #image>
              <el-icon class="text-6xl text-yellow-400"><WarningFilled /></el-icon>
            </template>
            <template #description>
              <div>
                <p class="text-lg mb-2 text-gray-700">未查询到符合条件的溯源信息</p>
                <p class="text-gray-500">
                  {{ tracingResult && tracingResult.errorMessage ? tracingResult.errorMessage : '请尝试修改查询条件后重新查询' }}
                </p>
              </div>
            </template>
          </el-empty>
          
          <!-- 溯源结果展示 -->
          <div v-else class="max-w-4xl mx-auto">
            <!-- 步骤条 -->
            <el-steps :active="4" finish-status="success" class="mb-8">
              <el-step title="菜品规划" description="菜单设计与编制" />
              <el-step title="食材采购" description="食材来源与供应" />
              <el-step title="食品加工" description="食材加工与烹饪" />
              <el-step title="质量监察" description="安全检查与监督" />
            </el-steps>
            
            <!-- 菜单信息 -->
            <el-collapse v-model="activeCollapse" class="mb-6">
              <el-collapse-item name="1">
                <template #title>
                  <div class="flex items-center">
                    <el-icon class="mr-2 text-blue-500"><Calendar /></el-icon>
                    <span class="font-medium">菜单信息</span>
                  </div>
                </template>
                <el-descriptions 
                  :column="1" 
                  border 
                  class="w-full"
                  label-class-name="bg-gray-50"
                >
                  <el-descriptions-item label="菜单日期">
                    {{ formatDate(tracingResult.menu.menuDate) }}
                  </el-descriptions-item>
                  <el-descriptions-item label="餐次">
                    {{ tracingResult.menu.mealType }}
                  </el-descriptions-item>
                  <el-descriptions-item label="菜品列表">
                    {{ tracingResult.menu.dishes }}
                  </el-descriptions-item>
                  <el-descriptions-item label="创建人员">
                    <div>
                      <span>{{ tracingResult.menu.userRealname }}</span>
                      <span v-if="tracingResult.menuCreatorContact" class="ml-2 text-gray-500">
                        (联系方式: {{ tracingResult.menuCreatorContact }})
                      </span>
                    </div>
                  </el-descriptions-item>
                  <el-descriptions-item label="菜单图片" v-if="tracingResult.menu.imagePath">
                    <el-image
                      :src="getImageUrl(tracingResult.menu.imagePath)"
                      fit="cover"
                      style="width: 120px; height: 120px; border-radius: 4px;"
                      :preview-src-list="[getImageUrl(tracingResult.menu.imagePath)]"
                    />
                  </el-descriptions-item>
                </el-descriptions>
              </el-collapse-item>
            </el-collapse>
            
            <!-- 采购信息 -->
            <el-collapse v-model="activeCollapse" class="mb-6">
              <el-collapse-item name="2">
                <template #title>
                  <div class="flex items-center">
                    <el-icon class="mr-2 text-green-500"><ShoppingCart /></el-icon>
                    <span class="font-medium">采购信息</span>
                  </div>
                </template>
                <div v-if="tracingResult.purchaseList && tracingResult.purchaseList.length > 0">
                  <div
                    v-for="(purchase, index) in tracingResult.purchaseList"
                    :key="purchase.id"
                    class="border rounded-md p-4 mb-4"
                  >
                    <h3 class="text-lg font-medium mb-4 flex items-center">
                      <span>采购记录 #{{ index + 1 }}</span>
                      <el-tag class="ml-2" size="small" type="info">
                        批次号: {{ purchase.batchNumber }}
                      </el-tag>
                    </h3>
                    <el-descriptions 
                      :column="1" 
                      border 
                      class="w-full"
                      label-class-name="bg-gray-50"
                    >
                      <el-descriptions-item label="食品名称">{{ purchase.name }}</el-descriptions-item>
                      <el-descriptions-item label="采购日期">{{ formatDate(purchase.purchaseDate) }}</el-descriptions-item>
                      <el-descriptions-item label="生产日期">{{ formatDate(purchase.productionDate) }}</el-descriptions-item>
                      <el-descriptions-item label="保质期">{{ purchase.shelfLife }}天</el-descriptions-item>
                      <el-descriptions-item label="供应商">{{ purchase.supplier }}</el-descriptions-item>
                      <el-descriptions-item label="采购数量">{{ purchase.quantity }}</el-descriptions-item>
                      <el-descriptions-item label="采购人员">
                        <div>
                          <template v-if="tracingResult.purchaserInfoMap && tracingResult.purchaserInfoMap[purchase.purchaserId]">
                            {{ tracingResult.purchaserInfoMap[purchase.purchaserId].realName || tracingResult.purchaserInfoMap[purchase.purchaserId].username }}
                            <div v-if="tracingResult.purchaserInfoMap[purchase.purchaserId].phone" class="text-gray-500">
                              联系方式: {{ tracingResult.purchaserInfoMap[purchase.purchaserId].phone || '无' }}
                            </div>
                          </template>
                          <template v-else>
                            {{ purchase.purchaserId }}
                          </template>
                        </div>
                      </el-descriptions-item>
                      <el-descriptions-item label="采购凭证" v-if="purchase.imagePath">
                        <el-image
                          :src="getImageUrl(purchase.imagePath)"
                          fit="cover"
                          style="width: 120px; height: 120px; border-radius: 4px;"
                          :preview-src-list="[getImageUrl(purchase.imagePath)]"
                        />
                      </el-descriptions-item>
                    </el-descriptions>
                  </div>
                </div>
                <el-empty v-else description="暂无采购信息" />
              </el-collapse-item>
            </el-collapse>
            
            <!-- 加工信息 -->
            <el-collapse v-model="activeCollapse" class="mb-6">
              <el-collapse-item name="3">
                <template #title>
                  <div class="flex items-center">
                    <el-icon class="mr-2 text-orange-500"><Box /></el-icon>
                    <span class="font-medium">加工信息</span>
                  </div>
                </template>
                <div v-if="tracingResult.processingList && tracingResult.processingList.length > 0">
                  <div
                    v-for="(processing, index) in tracingResult.processingList"
                    :key="processing.id"
                    class="border rounded-md p-4 mb-4"
                  >
                    <h3 class="text-lg font-medium mb-4 flex items-center">
                      <span>加工记录 #{{ index + 1 }}</span>
                      <el-tag class="ml-2" size="small" type="success">
                        批次号: {{ processing.batchNumber }}
                      </el-tag>
                    </h3>
                    <el-descriptions 
                      :column="1" 
                      border 
                      class="w-full"
                      label-class-name="bg-gray-50"
                    >
                      <el-descriptions-item label="加工方法">{{ processing.method }}</el-descriptions-item>
                      <el-descriptions-item label="加工时间">{{ formatDateTime(processing.processingTime) }}</el-descriptions-item>
                      <el-descriptions-item label="加工数量">{{ processing.quantity }}</el-descriptions-item>
                      <el-descriptions-item label="加工人员">{{ processing.processorName }}</el-descriptions-item>
                      <el-descriptions-item label="联系方式">{{ processing.processorPhone }}</el-descriptions-item>
                      <el-descriptions-item label="卫生条件">
                        <el-tag :type="getHygieneConditionTag(processing.hygieneCondition)">
                          {{ getHygieneConditionText(processing.hygieneCondition) }}
                        </el-tag>
                      </el-descriptions-item>
                      <el-descriptions-item label="加工图片" v-if="processing.imagePath">
                        <el-image
                          :src="getImageUrl(processing.imagePath)"
                          fit="cover"
                          style="width: 120px; height: 120px; border-radius: 4px;"
                          :preview-src-list="[getImageUrl(processing.imagePath)]"
                        />
                      </el-descriptions-item>
                    </el-descriptions>
                  </div>
                </div>
                <el-empty v-else description="暂无加工信息" />
              </el-collapse-item>
            </el-collapse>
            
            <!-- 监察信息 -->
            <el-collapse v-model="activeCollapse" class="mb-6">
              <el-collapse-item name="4">
                <template #title>
                  <div class="flex items-center">
                    <el-icon class="mr-2 text-red-500"><Check /></el-icon>
                    <span class="font-medium">监察信息</span>
                  </div>
                </template>
                <div v-if="tracingResult.inspection">
                  <el-descriptions 
                    :column="1" 
                    border 
                    class="w-full"
                    label-class-name="bg-gray-50"
                  >
                    <el-descriptions-item label="检查时间">
                      {{ formatDateTime(tracingResult.inspection.inspectionTime) }}
                    </el-descriptions-item>
                    <el-descriptions-item label="检查内容">
                      {{ tracingResult.inspection.content }}
                    </el-descriptions-item>
                    <el-descriptions-item label="检查结果">
                      <el-tag :type="getInspectionResultTag(tracingResult.inspection.result)">
                        {{ getInspectionResultText(tracingResult.inspection.result) }}
                      </el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item label="发现问题" v-if="tracingResult.inspection.issues">
                      {{ tracingResult.inspection.issues }}
                    </el-descriptions-item>
                    <el-descriptions-item label="整改建议" v-if="tracingResult.inspection.suggestions">
                      {{ tracingResult.inspection.suggestions }}
                    </el-descriptions-item>
                    <el-descriptions-item label="监察人员">
                      <div v-if="tracingResult.inspectorInfo">
                        <div>{{ tracingResult.inspectorInfo.realName || tracingResult.inspectorInfo.username }}</div>
                        <div v-if="tracingResult.inspectorInfo.phone" class="text-gray-500">
                          联系方式: {{ tracingResult.inspectorInfo.phone }}
                        </div>
                      </div>
                      <div v-else>
                        ID: {{ tracingResult.inspection.inspectorId }}
                      </div>
                    </el-descriptions-item>
                    <el-descriptions-item label="监察凭证" v-if="tracingResult.inspection.imagePath">
                      <el-image
                        :src="getImageUrl(tracingResult.inspection.imagePath)"
                        fit="cover"
                        style="width: 120px; height: 120px; border-radius: 4px;"
                        :preview-src-list="[getImageUrl(tracingResult.inspection.imagePath)]"
                      />
                    </el-descriptions-item>
                  </el-descriptions>
                </div>
                <el-empty v-else description="暂无监察信息" />
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, h } from 'vue'
import { ElMessage } from 'element-plus'
import { Link, Search, Refresh, Calendar, ShoppingCart, Box, Check, WarningFilled } from '@element-plus/icons-vue'
import { useTracingApi } from '@/api/tracing'

const tracingApi = useTracingApi()

// 查询表单相关
const queryFormRef = ref(null)
const queryForm = reactive({
  date: '',
  mealType: '午餐',
  dishName: ''
})

// 表单验证规则
const queryRules = {
  date: [{ required: true, message: '请选择日期', trigger: 'change' }],
  mealType: [{ required: true, message: '请选择餐次', trigger: 'change' }],
  dishName: [{ required: true, message: '请输入菜品名称', trigger: 'blur' }]
}

// 加载状态
const loading = ref(false)

// 查询结果相关
const showResult = ref(false)
const tracingResult = ref(null)
const activeCollapse = ref(['1', '2', '3', '4']) // 默认全部展开

// 查询按钮点击事件
const handleQuery = async () => {
  if (!queryFormRef.value) return
  
  await queryFormRef.value.validate(async (valid) => {
    if (!valid) return
    
    loading.value = true
    showResult.value = true // 始终显示结果区域
    tracingResult.value = { found: false, errorMessage: '' } // 默认设置为未找到
    
    try {
      const res = await tracingApi.queryTracing({
        date: queryForm.date,
        mealType: queryForm.mealType,
        dishName: queryForm.dishName
      })
      
      console.log('溯源查询结果:', res)
      
      if (res.code === 200 && res.data) {
        tracingResult.value = res.data
      } else {
        console.log('查询服务异常:', res.message || '未知错误')
        tracingResult.value.errorMessage = '查询服务异常，请稍后重试'
      }
    } catch (error) {
      console.error('溯源查询失败:', error)
      tracingResult.value.errorMessage = '查询服务异常，请稍后重试'
    } finally {
      loading.value = false
    }
  })
}

// 重置表单
const resetForm = () => {
  queryFormRef.value?.resetFields()
  showResult.value = false
  tracingResult.value = null
}

// 工具函数
const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString()
}

const formatDateTime = (dateTimeStr) => {
  if (!dateTimeStr) return '-'
  return new Date(dateTimeStr).toLocaleString()
}

// 获取图片URL
const getImageUrl = (path) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${import.meta.env.VITE_API_BASE_URL}${path}`
}

// 获取卫生条件标签类型
const getHygieneConditionTag = (condition) => {
  if (!condition) return 'info'
  
  const conditionVal = typeof condition === 'object' ? condition.name : condition
  
  switch (conditionVal) {
    case 'GOOD': return 'success'
    case 'NORMAL': return 'warning'
    case 'POOR': return 'danger'
    default: return 'info'
  }
}

// 获取卫生条件文本
const getHygieneConditionText = (condition) => {
  if (!condition) return '未知'
  
  if (typeof condition === 'object' && condition.description) {
    return condition.description
  }
  
  switch (condition) {
    case 'GOOD': return '良好'
    case 'NORMAL': return '一般'
    case 'POOR': return '较差'
    default: return condition
  }
}

// 获取检查结果标签类型
const getInspectionResultTag = (result) => {
  if (!result) return 'info'
  
  const resultVal = typeof result === 'object' ? result.name : result
  
  switch (resultVal) {
    case 'PASS': return 'success'
    case 'FAIL': return 'danger'
    default: return 'info'
  }
}

// 获取检查结果文本
const getInspectionResultText = (result) => {
  if (!result) return '未知'
  
  if (typeof result === 'object' && result.description) {
    return result.description
  }
  
  switch (result) {
    case 'PASS': return '合格'
    case 'FAIL': return '不合格'
    default: return result
  }
}

// 添加一个自定义的警告图标组件
const WarningIcon = () => h('div', { class: 'text-yellow-500 text-xl mb-3' }, [
  h('i', { class: 'el-icon-warning' })
])
</script>

<style scoped>
.el-collapse :deep(.el-collapse-item__header) {
  font-size: 16px;
}

.el-descriptions :deep(.el-descriptions__label) {
  width: 120px;
}
</style> 