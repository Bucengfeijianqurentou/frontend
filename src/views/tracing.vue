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
            
            <!-- 导出PDF按钮 -->
            <div class="flex justify-end mb-6" id="pdfExportButton">
              <el-button 
                type="primary" 
                @click="exportToPDF"
                :loading="exportLoading"
                class="!flex items-center"
              >
                <el-icon class="mr-1"><Document /></el-icon>
                导出PDF
              </el-button>
            </div>
            
            <!-- 要导出的内容区域 -->
            <div id="pdfContent" class="pdf-content">
              <!-- PDF标题 -->
              <div class="pdf-title">
                <h1>{{ getPDFTitle() }}</h1>
                <p class="pdf-subtitle">生成时间: {{ getCurrentDateTime() }}</p>
              </div>
              
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
                          <!-- 隐藏的标签，专为PDF导出使用 -->
                          <span class="hidden-tag pdf-tag" :class="'pdf-tag-' + getHygieneConditionTag(processing.hygieneCondition)">
                            {{ getHygieneConditionText(processing.hygieneCondition) }}
                          </span>
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
                        <!-- 隐藏的标签，专为PDF导出使用 -->
                        <span class="hidden-tag pdf-tag" :class="'pdf-tag-' + getInspectionResultTag(tracingResult.inspection.result)">
                          {{ getInspectionResultText(tracingResult.inspection.result) }}
                        </span>
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
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, h, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Link, Search, Refresh, Calendar, ShoppingCart, Box, Check, WarningFilled, Document } from '@element-plus/icons-vue'
import { useTracingApi } from '@/api/tracing'
import html2pdf from 'html2pdf.js'

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
const exportLoading = ref(false)

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
  if (!condition) return '良好'
  
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
  if (!result) return '合格'
  
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

// 导出PDF按钮点击事件
const exportToPDF = async () => {
  if (!tracingResult.value || !tracingResult.value.found) {
    ElMessage.warning('没有可导出的溯源信息')
    return
  }
  
  exportLoading.value = true
  
  try {
    // 保存当前折叠状态
    const originalCollapse = [...activeCollapse.value]
    
    // 确保所有折叠面板在导出前都展开
    activeCollapse.value = ['1', '2', '3', '4']
    
    // 等待DOM更新
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 获取要导出的元素
    const pdfContent = document.getElementById('pdfContent')
    if (!pdfContent) {
      throw new Error('找不到导出内容元素')
    }
    
    // 创建PDF内容的克隆，避免修改原始DOM
    const pdfClone = pdfContent.cloneNode(true)
    
    // 在body中创建一个临时容器来放置克隆的内容
    const tempContainer = document.createElement('div')
    tempContainer.id = 'temp-pdf-container'
    tempContainer.style.position = 'absolute'
    tempContainer.style.left = '-9999px'
    tempContainer.style.top = '-9999px'
    tempContainer.appendChild(pdfClone)
    document.body.appendChild(tempContainer)
    
    // 隐藏不需要导出的元素
    const exportButton = document.getElementById('pdfExportButton')
    if (exportButton) exportButton.style.display = 'none'
    
    // 处理克隆的内容中的图片
    const elImages = pdfClone.querySelectorAll('.el-image')
    const imagePromises = []
    
    elImages.forEach(elImage => {
      const img = elImage.querySelector('img')
      if (!img) return
      
      // 创建新的img标签替代el-image
      const newImg = document.createElement('img')
      newImg.src = img.src
      newImg.style.width = '300px'
      newImg.style.maxHeight = '250px'
      newImg.style.objectFit = 'contain'
      newImg.style.borderRadius = '4px'
      newImg.style.display = 'block'
      newImg.style.margin = '10px 0'
      
      const imgPromise = new Promise(resolve => {
        newImg.onload = resolve
        newImg.onerror = resolve
      })
      imagePromises.push(imgPromise)
      
      // 替换原有元素
      elImage.parentNode.replaceChild(newImg, elImage)
    })
    
    // 处理标签
    const elTags = pdfClone.querySelectorAll('.el-tag')
    elTags.forEach(elTag => {
      const type = elTag.getAttribute('type') || 'info'
      const text = elTag.textContent.trim()
      
      const tagSpan = document.createElement('span')
      tagSpan.textContent = text
      tagSpan.className = 'pdf-tag pdf-tag-' + type
      tagSpan.style.display = 'inline-block'
      tagSpan.style.padding = '2px 8px'
      tagSpan.style.fontSize = '12px'
      tagSpan.style.borderRadius = '4px'
      tagSpan.style.margin = '0 2px'
      tagSpan.style.fontWeight = '500'
      
      // 根据类型设置颜色
      switch (type) {
        case 'success':
          tagSpan.style.backgroundColor = '#f0f9eb'
          tagSpan.style.color = '#67c23a'
          tagSpan.style.border = '1px solid #e1f3d8'
          break
        case 'warning':
          tagSpan.style.backgroundColor = '#fdf6ec'
          tagSpan.style.color = '#e6a23c'
          tagSpan.style.border = '1px solid #faecd8'
          break
        case 'danger':
          tagSpan.style.backgroundColor = '#fef0f0'
          tagSpan.style.color = '#f56c6c'
          tagSpan.style.border = '1px solid #fde2e2'
          break
        default: // info
          tagSpan.style.backgroundColor = '#f4f4f5'
          tagSpan.style.color = '#909399'
          tagSpan.style.border = '1px solid #e9e9eb'
          break
      }
      
      elTag.parentNode.replaceChild(tagSpan, elTag)
    })
    
    // 处理描述项
    const descriptions = pdfClone.querySelectorAll('.el-descriptions-item')
    descriptions.forEach(item => {
      const label = item.querySelector('.el-descriptions-item__label')
      if (!label) return
      
      const labelText = label.textContent.trim()
      const content = item.querySelector('.el-descriptions-item__content')
      if (!content) return
      
      // 检查是否有空的卫生条件或检查结果
      if ((labelText === '卫生条件' || labelText === '检查结果') && content.textContent.trim() === '') {
        const span = document.createElement('span')
        span.textContent = labelText === '卫生条件' ? '良好' : '合格'
        span.className = 'pdf-tag pdf-tag-success'
        span.style.display = 'inline-block'
        span.style.padding = '2px 8px'
        span.style.fontSize = '12px'
        span.style.borderRadius = '4px'
        span.style.backgroundColor = '#f0f9eb'
        span.style.color = '#67c23a'
        span.style.border = '1px solid #e1f3d8'
        content.appendChild(span)
      }
    })
    
    // 展开所有折叠面板
    const collapsePanels = pdfClone.querySelectorAll('.el-collapse-item')
    collapsePanels.forEach(panel => {
      panel.classList.add('is-active')
      
      const header = panel.querySelector('.el-collapse-item__header')
      if (header) header.style.display = 'block'
      
      const content = panel.querySelector('.el-collapse-item__wrap')
      if (content) {
        content.style.display = 'block'
        content.style.height = 'auto'
      }
      
      const body = panel.querySelector('.el-collapse-item__content')
      if (body) {
        body.style.display = 'block'
        body.style.padding = '20px'
      }
    })
    
    // 等待所有图片加载完成
    await Promise.all(imagePromises)
    
    // 再次等待一会以确保DOM更新完成
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 配置选项
    const options = {
      margin: [15, 15, 15, 15],
      filename: `溯源信息_${queryForm.date}_${queryForm.mealType}_${queryForm.dishName}.pdf`,
      image: { 
        type: 'jpeg', 
        quality: 1.0 
      },
      html2canvas: { 
        scale: 2, 
        useCORS: true,
        logging: false,
        letterRendering: true,
        allowTaint: true,
        imageTimeout: 0
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait',
        compress: false
      }
    }
    
    // 生成PDF
    await html2pdf().from(pdfClone).set(options).save()
    
    // 清理：移除临时容器
    document.body.removeChild(tempContainer)
    
    // 恢复原始折叠状态
    activeCollapse.value = originalCollapse
    
    // 恢复隐藏的元素
    if (exportButton) exportButton.style.display = 'flex'
    
    ElMessage.success('溯源信息已成功导出为PDF')
  } catch (error) {
    console.error('PDF导出失败:', error)
    ElMessage.error('PDF导出失败，请稍后重试')
    
    // 清理：移除可能存在的临时容器
    const tempContainer = document.getElementById('temp-pdf-container')
    if (tempContainer) document.body.removeChild(tempContainer)
  } finally {
    exportLoading.value = false
    // 确保恢复隐藏的元素
    const exportButton = document.getElementById('pdfExportButton')
    if (exportButton) exportButton.style.display = 'flex'
  }
}

// 添加一个标题，用于PDF导出
const getPDFTitle = () => {
  return `${queryForm.date} ${queryForm.mealType} ${queryForm.dishName} 溯源信息`
}

// 获取当前日期时间格式化字符串
const getCurrentDateTime = () => {
  const now = new Date()
  return now.toLocaleString()
}
</script>

<style scoped>
.el-collapse :deep(.el-collapse-item__header) {
  font-size: 16px;
}

.el-descriptions :deep(.el-descriptions__label) {
  width: 120px;
}

/* PDF导出相关样式 */
.pdf-content {
  background: white;
  padding: 10px;
}

.pdf-title {
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 2px solid #409EFF;
}

.pdf-title h1 {
  font-size: 24px;
  color: #333;
  margin-bottom: 8px;
}

.pdf-subtitle {
  font-size: 14px;
  color: #666;
}

/* PDF图片样式 */
.pdf-image {
  max-width: 300px;
  max-height: 250px;
  object-fit: contain;
  border-radius: 4px;
  margin: 10px 0;
}

/* PDF标签样式 */
.pdf-tag {
  display: inline-block;
  padding: 2px 8px;
  font-size: 12px;
  border-radius: 4px;
  margin: 0 2px;
  font-weight: 500;
  line-height: 1.5;
}

.pdf-tag-success {
  background-color: #f0f9eb;
  color: #67c23a;
  border: 1px solid #e1f3d8;
}

.pdf-tag-warning {
  background-color: #fdf6ec;
  color: #e6a23c;
  border: 1px solid #faecd8;
}

.pdf-tag-danger {
  background-color: #fef0f0;
  color: #f56c6c;
  border: 1px solid #fde2e2;
}

.pdf-tag-info {
  background-color: #f4f4f5;
  color: #909399;
  border: 1px solid #e9e9eb;
}

:deep(.el-descriptions__content .el-image img) {
  max-width: 300px !important;
  max-height: 250px !important;
}

/* 确保在导出PDF时折叠面板内容可见 */
:deep(.exporting-pdf .el-collapse-item__wrap) {
  display: block !important;
  height: auto !important;
  overflow: visible !important;
}

:deep(.exporting-pdf .el-collapse-item__content) {
  display: block !important;
  height: auto !important;
  overflow: visible !important;
}

:deep(.exporting-pdf .el-collapse-item__header) {
  display: block !important;
}

@media print {
  .el-collapse :deep(.el-collapse-item__header),
  .el-collapse :deep(.el-collapse-item__wrap) {
    display: block !important;
  }
  
  .el-collapse-item :deep(.el-collapse-item__content) {
    display: block !important;
    height: auto !important;
  }
  
  img, .el-image img {
    max-width: 300px !important;
    max-height: 250px !important;
  }
}

/* 隐藏的PDF标签 */
.hidden-tag {
  display: none;
}

/* 导出PDF时显示隐藏标签 */
:deep(.exporting-pdf .hidden-tag) {
  display: inline-block !important;
}

:deep(.exporting-pdf .el-tag) {
  display: none !important;
}
</style> 