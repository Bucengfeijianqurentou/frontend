<template>
  <div class="menu-recommend-container">
    <h1 class="text-2xl font-bold mb-6">基于大数据分析与AI大模型的智能菜单推荐及营养雷达图展示</h1>
    
    <!-- 输入参数区域 -->
    <el-card class="mb-6">
      <template #header>
        <div class="card-header">
          <span class="font-bold">菜单推荐参数设置</span>
        </div>
      </template>
      
      <el-form :model="formData" label-position="top">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="学校类型">
              <el-select v-model="formData.schoolType" placeholder="请选择学校类型">
                <el-option label="小学" value="primary" />
                <el-option label="初中" value="junior" />
                <el-option label="高中" value="senior" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="学生年龄段">
              <el-select v-model="formData.ageRange" placeholder="请选择年龄段">
                <el-option label="6-9岁" value="6-9" />
                <el-option label="10-12岁" value="10-12" />
                <el-option label="13-15岁" value="13-15" />
                <el-option label="16-18岁" value="16-18" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="季节">
              <el-select v-model="formData.season" placeholder="请选择季节">
                <el-option label="春季" value="spring" />
                <el-option label="夏季" value="summer" />
                <el-option label="秋季" value="autumn" />
                <el-option label="冬季" value="winter" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="特殊膳食需求">
              <el-checkbox-group v-model="formData.dietaryRequirements">
                <el-checkbox label="清真" value="halal" />
                <el-checkbox label="素食" value="vegetarian" />
                <el-checkbox label="低糖" value="lowSugar" />
                <el-checkbox label="低盐" value="lowSalt" />
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="推荐周期">
              <el-radio-group v-model="formData.period">
                <el-radio value="day">单日菜单</el-radio>
                <el-radio value="week">一周菜单</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="营养偏好">
              <el-select v-model="formData.nutritionFocus" placeholder="请选择营养偏好">
                <el-option label="均衡营养" value="balanced" />
                <el-option label="增强免疫" value="immune" />
                <el-option label="促进发育" value="growth" />
                <el-option label="预防肥胖" value="obesity" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row>
          <el-col :span="24" class="flex justify-center">
            <el-button type="primary" @click="generateMenu" :loading="loading">
              生成智能推荐菜单
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    
    <!-- 分析过程展示 -->
    <div v-if="processingSteps.length > 0">
      <el-card class="mb-6">
        <template #header>
          <div class="card-header">
            <span class="font-bold">数据分析处理过程</span>
          </div>
        </template>
        
        <el-timeline>
          <el-timeline-item
            v-for="(step, index) in processingSteps"
            :key="index"
            :timestamp="step.time"
            :type="step.type"
            :hollow="step.hollow"
          >
            <div class="step-content">
              <h4 class="font-bold mb-2">{{ step.title }}</h4>
              <p>{{ step.description }}</p>
              <div v-if="step.progress !== undefined" class="mt-2">
                <el-progress 
                  :percentage="step.progress" 
                  :status="step.progress === 100 ? 'success' : ''"
                  :striped="step.progress < 100"
                  :striped-flow="step.progress < 100"
                ></el-progress>
              </div>
            </div>
          </el-timeline-item>
        </el-timeline>
      </el-card>
    </div>
    
    <!-- 推荐菜单展示 -->
    <div v-if="menuGenerated">
      <!-- 菜单选项卡 -->
      <el-card class="mb-6">
        <template #header>
          <div class="card-header">
            <span class="font-bold">{{ formData.period === 'day' ? '每日' : '每周' }}推荐菜单</span>
            <el-button type="success" size="small">
              <el-icon><component is="IconDownload" /></el-icon>
              导出菜单
            </el-button>
          </div>
        </template>
        
        <div v-if="formData.period === 'day'">
          <!-- 单日菜单展示 -->
          <div class="day-menu">
            <h3 class="text-lg font-bold mb-4">{{ currentDate }} 推荐菜单</h3>
            
            <el-row :gutter="20">
              <el-col v-for="(meal, index) in dayMenu" :key="index" :span="8">
                <el-card class="meal-card mb-4">
                  <template #header>
                    <div class="meal-header">
                      <span class="font-bold">{{ meal.title }}</span>
                      <el-tag size="small" :type="meal.type">{{ meal.time }}</el-tag>
                    </div>
                  </template>
                  <div class="meal-content">
                    <div v-for="(dish, dishIndex) in meal.dishes" :key="dishIndex" class="dish-item">
                      <div class="dish-icon" :style="{ backgroundColor: getDishColor(dish.category) }">
                        {{ dish.emoji }}
                      </div>
                      <div class="dish-details">
                        <div class="dish-name">{{ dish.name }}</div>
                        <div class="dish-nutrition">
                          <el-tag size="small" effect="plain">{{ dish.nutrition }}</el-tag>
                        </div>
                      </div>
                    </div>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </div>
        </div>
        
        <div v-else>
          <!-- 一周菜单展示 -->
          <el-tabs v-model="activeDay" tab-position="left" class="week-menu-tabs">
            <el-tab-pane v-for="(day, index) in weekMenu" :key="index" :label="day.day" :name="day.key">
              <h3 class="text-lg font-bold mb-4">{{ day.date }} 推荐菜单</h3>
              
              <el-row :gutter="20">
                <el-col v-for="(meal, mealIndex) in day.meals" :key="mealIndex" :span="8">
                  <el-card class="meal-card mb-4">
                    <template #header>
                      <div class="meal-header">
                        <span class="font-bold">{{ meal.title }}</span>
                        <el-tag size="small" :type="meal.type">{{ meal.time }}</el-tag>
                      </div>
                    </template>
                    <div class="meal-content">
                      <div v-for="(dish, dishIndex) in meal.dishes" :key="dishIndex" class="dish-item">
                        <div class="dish-icon" :style="{ backgroundColor: getDishColor(dish.category) }">
                          {{ dish.emoji }}
                        </div>
                        <div class="dish-details">
                          <div class="dish-name">{{ dish.name }}</div>
                          <div class="dish-nutrition">
                            <el-tag size="small" effect="plain">{{ dish.nutrition }}</el-tag>
                          </div>
                        </div>
                      </div>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-card>
      
      <!-- 营养分析 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card class="mb-6">
            <template #header>
              <div class="card-header">
                <span class="font-bold">营养雷达图分析</span>
              </div>
            </template>
            <div class="chart-container">
              <div id="nutritionRadarChart" style="width: 100%; height: 400px;"></div>
            </div>
          </el-card>
        </el-col>
        
        <el-col :span="12">
          <el-card class="mb-6">
            <template #header>
              <div class="card-header">
                <span class="font-bold">营养摄入评估</span>
              </div>
            </template>
            <div class="nutrition-assessment">
              <div v-for="(item, index) in nutritionAssessment" :key="index" class="nutrition-item">
                <div class="nutrition-header">
                  <span class="nutrition-name">{{ item.name }}</span>
                  <el-tag :type="item.status === '适宜' ? 'success' : item.status === '偏低' ? 'warning' : 'danger'" size="small">
                    {{ item.status }}
                  </el-tag>
                </div>
                <el-progress 
                  :percentage="item.percentage" 
                  :color="getProgressColor(item.percentage, item.status)"
                  :format="(percentage) => `${percentage}%`"
                  :stroke-width="12"
                ></el-progress>
                <div class="nutrition-description">
                  {{ item.description }}
                </div>
              </div>
              
              <div class="mt-4">
                <h4 class="font-bold mb-2">AI营养建议</h4>
                <div class="ai-suggestion">
                  <p>{{ aiSuggestion }}</p>
                  <div class="mt-2">
                    <el-button type="primary" size="small" @click="adjustNutrition">
                      <el-icon><component is="IconRefreshRight" /></el-icon>
                      调整营养配比
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      
      <!-- 学生反馈预测 -->
      <el-card class="mb-6">
        <template #header>
          <div class="card-header">
            <span class="font-bold">学生接受度预测</span>
          </div>
        </template>
        <div class="feedback-prediction">
          <el-row :gutter="20">
            <el-col :span="8">
              <div id="satisfactionChart" style="width: 100%; height: 300px;"></div>
            </el-col>
            <el-col :span="8">
              <div id="wasteRateChart" style="width: 100%; height: 300px;"></div>
            </el-col>
            <el-col :span="8">
              <div class="prediction-summary">
                <h4 class="font-bold mb-2">AI预测总结</h4>
                <div class="prediction-item" v-for="(item, index) in predictionSummary" :key="index">
                  <el-icon><component is="IconDataAnalysis" /></el-icon>
                  <span>{{ item }}</span>
                </div>
                <div class="history-comparison mt-4">
                  <div class="comparison-header">
                    <span>与历史推荐对比</span>
                    <el-tag type="success">提升8.7%</el-tag>
                  </div>
                  <p class="comparison-text">当前菜单较上周菜单预测满意度提升8.7%，较上月平均提升12.3%。</p>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, nextTick } from 'vue'
import * as echarts from 'echarts'
import { 
  Download as IconDownload, 
  DataAnalysis as IconDataAnalysis, 
  RefreshRight as IconRefreshRight 
} from '@element-plus/icons-vue'

// 表单数据
const formData = reactive({
  schoolType: 'primary',
  ageRange: '6-9',
  season: 'autumn',
  dietaryRequirements: [],
  period: 'week',
  nutritionFocus: 'balanced'
})

// 加载状态
const loading = ref(false)

// 处理步骤
const processingSteps = ref([])

// 菜单是否已生成
const menuGenerated = ref(false)

// 当前日期
const currentDate = computed(() => {
  const date = new Date()
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
})

// 单日菜单数据
const dayMenu = ref([])

// 周菜单数据
const weekMenu = ref([])

// 当前选中的星期
const activeDay = ref('monday')

// 营养评估数据
const nutritionAssessment = ref([
  { 
    name: '蛋白质',
    percentage: 85,
    status: '适宜',
    description: '当前菜单蛋白质摄入达到中国营养学会推荐标准的85%，符合学生生长发育需求。'
  },
  { 
    name: '碳水化合物',
    percentage: 92,
    status: '适宜',
    description: '碳水化合物摄入合理，以复合碳水为主，可提供持续稳定的能量。'
  },
  { 
    name: '脂肪',
    percentage: 78,
    status: '适宜',
    description: '脂肪摄入适中，不饱和脂肪酸占比大，有助于心脑血管健康。'
  },
  { 
    name: '维生素',
    percentage: 68,
    status: '偏低',
    description: '维生素总体摄入偏低，特别是维生素D和维生素E可适当增加。'
  },
  { 
    name: '矿物质',
    percentage: 75,
    status: '适宜',
    description: '矿物质摄入基本达标，钙和铁的摄入可再稍微增加。'
  },
  { 
    name: '膳食纤维',
    percentage: 62,
    status: '偏低',
    description: '膳食纤维摄入略低于推荐量，可增加全谷物和蔬果摄入。'
  }
])

// AI营养建议
const aiSuggestion = ref('根据当前学生群体特点和季节性因素，建议适当增加富含维生素D的食物（如蛋黄、菌菇类）和膳食纤维（如全谷物、豆类），并考虑每周添加1-2次深海鱼类，补充必要的Omega-3脂肪酸，有助于大脑发育和免疫力提升。')

// 预测总结
const predictionSummary = ref([
  '预测本周菜单学生总体满意度为92.5%，较上周提升8.7%',
  '剩余率预计降低至6.3%，较平均水平降低3.1%',
  '学生对清蒸龙利鱼和山药排骨汤接受度最高',
  '建议增加新鲜水果种类，进一步提高满意度',
  '当前菜单营养素搭配适合6-9岁学生群体生长发育需求'
])

// 获取进度条颜色
const getProgressColor = (percentage, status) => {
  if (status === '适宜') return '#67C23A'
  if (status === '偏低') return '#E6A23C'
  return '#F56C6C'
}

// 调整营养配比
const adjustNutrition = () => {
  // 模拟调整
  nutritionAssessment.value.forEach(item => {
    if (item.status === '偏低') {
      item.percentage += 10
      if (item.percentage > 80) {
        item.status = '适宜'
      }
    }
  })
  
  // 更新雷达图
  nextTick(() => {
    initNutritionRadarChart()
  })
  
  // 更新AI建议
  aiSuggestion.value = '营养配比已调整，当前菜单更加均衡。建议增加红薯、菠菜等深色蔬菜，并适量增加豆制品，进一步优化维生素和矿物质摄入。'
}

// 添加处理步骤
const addProcessingStep = (step) => {
  processingSteps.value.push({
    ...step,
    time: new Date().toLocaleTimeString()
  })
}

// 更新处理步骤进度
const updateStepProgress = (index, progress) => {
  if (processingSteps.value[index]) {
    processingSteps.value[index].progress = progress
    if (progress === 100) {
      processingSteps.value[index].hollow = false
    }
  }
}

// 获取菜品类别对应的颜色
const getDishColor = (category) => {
  const colors = {
    staple: '#FFC107', // 主食
    meat: '#F44336',   // 肉类
    vegetable: '#4CAF50', // 蔬菜
    soup: '#2196F3',   // 汤
    fruit: '#FF9800',  // 水果
    dessert: '#E91E63', // 甜点
    beverage: '#9C27B0' // 饮品
  }
  return colors[category] || '#607D8B'
}

// 生成菜单
const generateMenu = () => {
  loading.value = true
  processingSteps.value = [] // 清空之前的处理步骤
  menuGenerated.value = false // 重置菜单生成状态
  
  // 第一步：数据收集
  addProcessingStep({
    title: '数据收集',
    description: '正在收集学生信息、食材库存及营养标准数据...',
    type: 'primary',
    hollow: true,
    progress: 0
  })
  
  // 模拟数据收集进度
  let currentStep = 0
  const dataCollectionInterval = setInterval(() => {
    updateStepProgress(currentStep, Math.min(100, processingSteps.value[currentStep].progress + 10))
    
    if (processingSteps.value[currentStep].progress === 100) {
      clearInterval(dataCollectionInterval)
      
      // 第二步：AI分析
      setTimeout(() => {
        addProcessingStep({
          title: 'AI大模型分析',
          description: '基于Grok 3大模型对多维数据进行深度分析，预测学生群体对菜品的接受度...',
          type: 'success',
          hollow: true,
          progress: 0
        })
        currentStep++
        
        // 模拟AI分析进度
        const aiAnalysisInterval = setInterval(() => {
          updateStepProgress(currentStep, Math.min(100, processingSteps.value[currentStep].progress + 5))
          
          if (processingSteps.value[currentStep].progress === 100) {
            clearInterval(aiAnalysisInterval)
            
            // 第三步：菜单优化
            setTimeout(() => {
              addProcessingStep({
                title: '菜单优化',
                description: '根据营养均衡原则，优化菜品搭配，生成每日/每周菜单...',
                type: 'warning',
                hollow: true,
                progress: 0
              })
              currentStep++
              
              // 模拟菜单优化进度
              const menuOptimizationInterval = setInterval(() => {
                updateStepProgress(currentStep, Math.min(100, processingSteps.value[currentStep].progress + 7))
                
                if (processingSteps.value[currentStep].progress === 100) {
                  clearInterval(menuOptimizationInterval)
                  
                  // 第四步：营养评估
                  setTimeout(() => {
                    addProcessingStep({
                      title: '营养评估',
                      description: '根据菜品营养数据库，计算菜单的营养素分布，生成雷达图...',
                      type: 'danger',
                      hollow: true,
                      progress: 0
                    })
                    currentStep++
                    
                    // 模拟营养评估进度
                    const nutritionAssessmentInterval = setInterval(() => {
                      updateStepProgress(currentStep, Math.min(100, processingSteps.value[currentStep].progress + 10))
                      
                      if (processingSteps.value[currentStep].progress === 100) {
                        clearInterval(nutritionAssessmentInterval)
                        
                        // 完成所有处理步骤
                        setTimeout(() => {
                          addProcessingStep({
                            title: '推荐完成',
                            description: '智能菜单推荐已完成，可以查看详细菜单和营养分析结果。',
                            type: 'info',
                            hollow: false
                          })
                          loading.value = false
                          
                          // 在这里添加显示结果的逻辑
                          showResults()
                        }, 500)
                      }
                    }, 200)
                  }, 300)
                }
              }, 150)
            }, 300)
          }
        }, 200)
      }, 300)
    }
  }, 150)
}

// 显示结果
const showResults = () => {
  menuGenerated.value = true
  
  // 生成单日菜单数据
  dayMenu.value = [
    {
      title: '早餐',
      time: '7:00-8:00',
      type: 'success',
      dishes: [
        { name: '牛奶麦片粥', category: 'staple', emoji: '🥣', nutrition: '钙质+碳水' },
        { name: '鸡蛋三明治', category: 'meat', emoji: '🥪', nutrition: '蛋白质+碳水' },
        { name: '香蕉', category: 'fruit', emoji: '🍌', nutrition: '维生素B6+钾' }
      ]
    },
    {
      title: '午餐',
      time: '12:00-13:00',
      type: 'warning',
      dishes: [
        { name: '五谷米饭', category: 'staple', emoji: '🍚', nutrition: '复合碳水+膳食纤维' },
        { name: '清蒸龙利鱼', category: 'meat', emoji: '🐟', nutrition: 'Omega-3+蛋白质' },
        { name: '西兰花炒胡萝卜', category: 'vegetable', emoji: '🥦', nutrition: '维生素C+胡萝卜素' },
        { name: '紫菜蛋花汤', category: 'soup', emoji: '🍲', nutrition: '碘+植物蛋白' }
      ]
    },
    {
      title: '晚餐',
      time: '18:00-19:00',
      type: 'danger',
      dishes: [
        { name: '杂粮馒头', category: 'staple', emoji: '🍞', nutrition: '碳水+B族维生素' },
        { name: '清炒鸡肉', category: 'meat', emoji: '🍗', nutrition: '优质蛋白质' },
        { name: '上汤娃娃菜', category: 'vegetable', emoji: '🥬', nutrition: '膳食纤维+钙' },
        { name: '山药排骨汤', category: 'soup', emoji: '🍲', nutrition: '蛋白质+微量元素' },
        { name: '酸奶', category: 'dessert', emoji: '🥛', nutrition: '益生菌+钙' }
      ]
    }
  ]
  
  // 生成周菜单数据
  const weekdays = [
    { key: 'monday', day: '星期一', date: '2023年10月16日' },
    { key: 'tuesday', day: '星期二', date: '2023年10月17日' },
    { key: 'wednesday', day: '星期三', date: '2023年10月18日' },
    { key: 'thursday', day: '星期四', date: '2023年10月19日' },
    { key: 'friday', day: '星期五', date: '2023年10月20日' }
  ]
  
  weekMenu.value = weekdays.map(day => {
    return {
      ...day,
      meals: generateRandomMeals()
    }
  })
  
  // 初始化图表
  nextTick(() => {
    initNutritionRadarChart()
    initSatisfactionChart()
    initWasteRateChart()
  })
}

// 生成随机菜单（模拟不同天数的菜单）
const generateRandomMeals = () => {
  const breakfastOptions = [
    [
      { name: '牛奶麦片粥', category: 'staple', emoji: '🥣', nutrition: '钙质+碳水' },
      { name: '鸡蛋三明治', category: 'meat', emoji: '🥪', nutrition: '蛋白质+碳水' },
      { name: '香蕉', category: 'fruit', emoji: '🍌', nutrition: '维生素B6+钾' }
    ],
    [
      { name: '小米粥', category: 'staple', emoji: '🥣', nutrition: '碳水+B族维生素' },
      { name: '手抓饼', category: 'staple', emoji: '🥞', nutrition: '碳水+脂肪' },
      { name: '鸡蛋煎饺', category: 'meat', emoji: '🥟', nutrition: '蛋白质+铁' },
      { name: '橙子', category: 'fruit', emoji: '🍊', nutrition: '维生素C' }
    ],
    [
      { name: '黑米粥', category: 'staple', emoji: '🥣', nutrition: '膳食纤维+矿物质' },
      { name: '鲜肉包子', category: 'meat', emoji: '🥟', nutrition: '蛋白质+碳水' },
      { name: '蒸红薯', category: 'vegetable', emoji: '🍠', nutrition: '复合碳水+β胡萝卜素' },
      { name: '苹果', category: 'fruit', emoji: '🍎', nutrition: '膳食纤维+抗氧化物' }
    ]
  ]
  
  const lunchOptions = [
    [
      { name: '五谷米饭', category: 'staple', emoji: '🍚', nutrition: '复合碳水+膳食纤维' },
      { name: '清蒸龙利鱼', category: 'meat', emoji: '🐟', nutrition: 'Omega-3+蛋白质' },
      { name: '西兰花炒胡萝卜', category: 'vegetable', emoji: '🥦', nutrition: '维生素C+胡萝卜素' },
      { name: '紫菜蛋花汤', category: 'soup', emoji: '🍲', nutrition: '碘+植物蛋白' }
    ],
    [
      { name: '糙米饭', category: 'staple', emoji: '🍚', nutrition: '膳食纤维+B族维生素' },
      { name: '红烧排骨', category: 'meat', emoji: '🍖', nutrition: '蛋白质+铁' },
      { name: '清炒小白菜', category: 'vegetable', emoji: '🥬', nutrition: '叶酸+抗氧化物' },
      { name: '豆腐番茄汤', category: 'soup', emoji: '🍲', nutrition: '蛋白质+番茄红素' }
    ],
    [
      { name: '玉米蒸饭', category: 'staple', emoji: '🌽', nutrition: '复合碳水+维生素E' },
      { name: '香煎鸡胸', category: 'meat', emoji: '🍗', nutrition: '优质蛋白质+低脂' },
      { name: '蒜蓉油麦菜', category: 'vegetable', emoji: '🥬', nutrition: '维生素K+矿物质' },
      { name: '冬瓜排骨汤', category: 'soup', emoji: '🍲', nutrition: '低卡+蛋白质' }
    ]
  ]
  
  const dinnerOptions = [
    [
      { name: '杂粮馒头', category: 'staple', emoji: '🍞', nutrition: '碳水+B族维生素' },
      { name: '清炒鸡肉', category: 'meat', emoji: '🍗', nutrition: '优质蛋白质' },
      { name: '上汤娃娃菜', category: 'vegetable', emoji: '🥬', nutrition: '膳食纤维+钙' },
      { name: '山药排骨汤', category: 'soup', emoji: '🍲', nutrition: '蛋白质+微量元素' },
      { name: '酸奶', category: 'dessert', emoji: '🥛', nutrition: '益生菌+钙' }
    ],
    [
      { name: '燕麦面条', category: 'staple', emoji: '🍜', nutrition: '膳食纤维+复合碳水' },
      { name: '番茄炒牛肉', category: 'meat', emoji: '🥩', nutrition: '优质蛋白+番茄红素' },
      { name: '蒜香西葫芦', category: 'vegetable', emoji: '🥒', nutrition: '低卡+维生素A' },
      { name: '菌菇豆腐汤', category: 'soup', emoji: '🍲', nutrition: '植物蛋白+维生素D' }
    ],
    [
      { name: '南瓜小米饭', category: 'staple', emoji: '🍚', nutrition: '复合碳水+胡萝卜素' },
      { name: '蒸鱼块', category: 'meat', emoji: '🐟', nutrition: 'Omega-3+优质蛋白' },
      { name: '凉拌菠菜', category: 'vegetable', emoji: '🥗', nutrition: '铁+叶酸' },
      { name: '紫菜虾皮汤', category: 'soup', emoji: '🍲', nutrition: '碘+钙' },
      { name: '鲜果拼盘', category: 'fruit', emoji: '🍎', nutrition: '多种维生素' }
    ]
  ]
  
  return [
    {
      title: '早餐',
      time: '7:00-8:00',
      type: 'success',
      dishes: breakfastOptions[Math.floor(Math.random() * breakfastOptions.length)]
    },
    {
      title: '午餐',
      time: '12:00-13:00',
      type: 'warning',
      dishes: lunchOptions[Math.floor(Math.random() * lunchOptions.length)]
    },
    {
      title: '晚餐',
      time: '18:00-19:00',
      type: 'danger',
      dishes: dinnerOptions[Math.floor(Math.random() * dinnerOptions.length)]
    }
  ]
}

// 初始化营养雷达图
const initNutritionRadarChart = () => {
  const chartDom = document.getElementById('nutritionRadarChart')
  if (!chartDom) return
  
  const myChart = echarts.init(chartDom)
  
  const option = {
    title: {
      text: '营养素平衡分析'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      data: ['当前菜单', '推荐标准', '上周菜单']
    },
    radar: {
      indicator: [
        { name: '蛋白质', max: 100 },
        { name: '碳水化合物', max: 100 },
        { name: '脂肪', max: 100 },
        { name: '维生素', max: 100 },
        { name: '矿物质', max: 100 },
        { name: '膳食纤维', max: 100 }
      ]
    },
    series: [
      {
        name: '营养素分布',
        type: 'radar',
        data: [
          {
            value: nutritionAssessment.value.map(item => item.percentage),
            name: '当前菜单',
            areaStyle: {
              color: 'rgba(58, 162, 254, 0.3)'
            }
          },
          {
            value: [90, 90, 80, 85, 85, 80],
            name: '推荐标准',
            lineStyle: {
              type: 'dashed'
            }
          },
          {
            value: [80, 95, 75, 60, 70, 50],
            name: '上周菜单',
            lineStyle: {
              type: 'dotted'
            }
          }
        ]
      }
    ]
  }
  
  myChart.setOption(option)
  
  window.addEventListener('resize', () => {
    myChart.resize()
  })
}

// 初始化满意度图表
const initSatisfactionChart = () => {
  const chartDom = document.getElementById('satisfactionChart')
  if (!chartDom) return
  
  const myChart = echarts.init(chartDom)
  
  const option = {
    title: {
      text: '预测满意度分布',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}%'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'center'
    },
    series: [
      {
        name: '满意度',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 55.7, name: '非常满意' },
          { value: 36.8, name: '满意' },
          { value: 5.2, name: '一般' },
          { value: 2.3, name: '不满意' }
        ]
      }
    ]
  }
  
  myChart.setOption(option)
  
  window.addEventListener('resize', () => {
    myChart.resize()
  })
}

// 初始化剩余率图表
const initWasteRateChart = () => {
  const chartDom = document.getElementById('wasteRateChart')
  if (!chartDom) return
  
  const myChart = echarts.init(chartDom)
  
  const option = {
    title: {
      text: '食物剩余率预测',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      max: 15,
      axisLabel: {
        formatter: '{value}%'
      }
    },
    yAxis: {
      type: 'category',
      data: ['早餐', '午餐', '晚餐', '平均']
    },
    series: [
      {
        name: '剩余率',
        type: 'bar',
        data: [
          {
            value: 5.1,
            itemStyle: { color: '#91CC75' }
          },
          {
            value: 7.2,
            itemStyle: { color: '#FAC858' }
          },
          {
            value: 6.5,
            itemStyle: { color: '#73C0DE' }
          },
          {
            value: 6.3,
            itemStyle: { color: '#FC8452' },
            emphasis: {
              itemStyle: { color: '#FC8452' }
            }
          }
        ],
        label: {
          show: true,
          position: 'right',
          formatter: '{c}%'
        }
      }
    ]
  }
  
  myChart.setOption(option)
  
  window.addEventListener('resize', () => {
    myChart.resize()
  })
}
</script>

<style scoped>
.menu-recommend-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.step-content {
  padding: 10px;
}

.week-menu-tabs {
  min-height: 400px;
}

.meal-card {
  height: 100%;
}

.meal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.meal-content {
  padding: 10px 0;
}

.dish-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.dish-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 12px;
  font-size: 20px;
}

.dish-details {
  flex: 1;
}

.dish-name {
  font-weight: bold;
  margin-bottom: 4px;
}

.dish-nutrition {
  font-size: 12px;
}

.chart-container {
  width: 100%;
  height: 400px;
}

.nutrition-assessment {
  padding: 0 10px;
}

.nutrition-item {
  margin-bottom: 16px;
}

.nutrition-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.nutrition-name {
  font-weight: bold;
}

.nutrition-description {
  font-size: 12px;
  color: #606266;
  margin-top: 4px;
}

.ai-suggestion {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
}

.prediction-summary {
  padding: 20px;
  height: 300px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.prediction-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;
  font-size: 14px;
}

.prediction-item i {
  margin-right: 8px;
  color: #409EFF;
  margin-top: 3px;
}

.history-comparison {
  border-top: 1px dashed #dcdfe6;
  padding-top: 12px;
}

.comparison-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-weight: bold;
}

.comparison-text {
  font-size: 14px;
  color: #606266;
}
</style>