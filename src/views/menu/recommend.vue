<template>
  <div class="menu-recommend-container">
    <div class="header-section">
      <h1 class="page-title">
        <span class="title-icon">🍽️</span>
        <span class="title-text">基于大数据分析与AI大模型的智能菜单推荐</span>
      </h1>
      <div class="subtitle">科学搭配膳食，促进健康成长</div>
    </div>
    
    <!-- 输入参数区域 -->
    <el-card class="param-card mb-6 animate__animated animate__fadeIn">
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <el-icon class="header-icon"><IconSetting /></el-icon>
            <span class="font-bold">菜单推荐参数设置</span>
          </div>
          <el-tag effect="dark" type="info" size="small" class="header-tag">个性化定制</el-tag>
        </div>
      </template>
      
      <el-form :model="formData" label-position="top" class="param-form">
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="学校类型">
              <el-select v-model="formData.schoolType" placeholder="请选择学校类型" class="custom-select">
                <el-option label="小学" value="primary" />
                <el-option label="初中" value="junior" />
                <el-option label="高中" value="senior" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="学生年龄段">
              <el-select v-model="formData.ageRange" placeholder="请选择年龄段" class="custom-select">
                <el-option label="6-9岁" value="6-9" />
                <el-option label="10-12岁" value="10-12" />
                <el-option label="13-15岁" value="13-15" />
                <el-option label="16-18岁" value="16-18" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="季节">
              <el-select v-model="formData.season" placeholder="请选择季节" class="custom-select">
                <el-option label="春季" value="spring">
                  <div class="select-option-with-icon">
                    <span class="option-icon">🌱</span>
                    <span>春季</span>
                  </div>
                </el-option>
                <el-option label="夏季" value="summer">
                  <div class="select-option-with-icon">
                    <span class="option-icon">☀️</span>
                    <span>夏季</span>
                  </div>
                </el-option>
                <el-option label="秋季" value="autumn">
                  <div class="select-option-with-icon">
                    <span class="option-icon">🍂</span>
                    <span>秋季</span>
                  </div>
                </el-option>
                <el-option label="冬季" value="winter">
                  <div class="select-option-with-icon">
                    <span class="option-icon">❄️</span>
                    <span>冬季</span>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="特殊膳食需求">
              <el-checkbox-group v-model="formData.dietaryRequirements" class="checkbox-group-vertical">
                <el-checkbox label="清真" value="halal">
                  <span class="checkbox-with-icon">
                    <span class="checkbox-icon">🕌</span>
                    <span>清真</span>
                  </span>
                </el-checkbox>
                <el-checkbox label="素食" value="vegetarian">
                  <span class="checkbox-with-icon">
                    <span class="checkbox-icon">🥬</span>
                    <span>素食</span>
                  </span>
                </el-checkbox>
                <el-checkbox label="低糖" value="lowSugar">
                  <span class="checkbox-with-icon">
                    <span class="checkbox-icon">🍯</span>
                    <span>低糖</span>
                  </span>
                </el-checkbox>
                <el-checkbox label="低盐" value="lowSalt">
                  <span class="checkbox-with-icon">
                    <span class="checkbox-icon">🧂</span>
                    <span>低盐</span>
                  </span>
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="推荐周期">
              <el-radio-group v-model="formData.period" class="custom-radio-group">
                <el-radio value="day" class="custom-radio">
                  <div class="radio-with-icon">
                    <span class="radio-icon">📅</span>
                    <span>单日菜单</span>
                  </div>
                </el-radio>
                <el-radio value="week" class="custom-radio">
                  <div class="radio-with-icon">
                    <span class="radio-icon">📆</span>
                    <span>一周菜单</span>
                  </div>
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="营养偏好">
              <el-select v-model="formData.nutritionFocus" placeholder="请选择营养偏好" class="custom-select">
                <el-option label="均衡营养" value="balanced">
                  <div class="select-option-with-icon">
                    <span class="option-icon">⚖️</span>
                    <span>均衡营养</span>
                  </div>
                </el-option>
                <el-option label="增强免疫" value="immune">
                  <div class="select-option-with-icon">
                    <span class="option-icon">🛡️</span>
                    <span>增强免疫</span>
                  </div>
                </el-option>
                <el-option label="促进发育" value="growth">
                  <div class="select-option-with-icon">
                    <span class="option-icon">📏</span>
                    <span>促进发育</span>
                  </div>
                </el-option>
                <el-option label="预防肥胖" value="obesity">
                  <div class="select-option-with-icon">
                    <span class="option-icon">🏃</span>
                    <span>预防肥胖</span>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row>
          <el-col :span="24" class="flex justify-center">
            <el-button 
              type="primary" 
              @click="generateMenu" 
              :loading="loading"
              class="generate-btn"
              :disabled="loading"
            >
              <span class="btn-icon">{{ loading ? '⏳' : '✨' }}</span>
              <span>{{ loading ? '生成中...' : '生成智能推荐菜单' }}</span>
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    
    <!-- 分析过程展示 -->
    <transition-group name="fade-up" tag="div">
      <div v-if="processingSteps.length > 0" :key="'process-section'" class="mb-6">
        <el-card class="process-card animate__animated animate__fadeIn">
          <template #header>
            <div class="card-header">
              <div class="header-left">
                <el-icon class="header-icon"><IconDataAnalysis /></el-icon>
                <span class="font-bold">数据分析处理过程</span>
              </div>
              <div class="processing-badge" v-if="loading">
                <span class="badge-dot"></span>
                <span>处理中</span>
              </div>
            </div>
          </template>
          
          <el-timeline class="custom-timeline">
            <el-timeline-item
              v-for="(step, index) in processingSteps"
              :key="index"
              :timestamp="step.time"
              :type="step.type"
              :hollow="step.hollow"
              class="animate__animated animate__fadeInUp"
              :style="{ animationDelay: index * 0.2 + 's' }"
            >
              <div class="step-content">
                <h4 class="step-title">
                  <span class="step-number">{{ index + 1 }}</span>
                  {{ step.title }}
                </h4>
                <p class="step-description">{{ step.description }}</p>
                <div v-if="step.progress !== undefined" class="mt-3">
                  <el-progress 
                    :percentage="step.progress" 
                    :status="step.progress === 100 ? 'success' : ''"
                    :striped="step.progress < 100"
                    :striped-flow="step.progress < 100"
                    class="custom-progress"
                  ></el-progress>
                </div>
              </div>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </div>
    </transition-group>
    
    <!-- 推荐菜单展示 -->
    <transition-group name="fade-up" tag="div">
      <div v-if="menuGenerated" :key="'menu-section'" class="menu-section">
        <!-- 菜单选项卡 -->
        <el-card class="menu-card mb-6 animate__animated animate__fadeIn">
          <template #header>
            <div class="card-header">
              <div class="header-left">
                <el-icon class="header-icon"><IconFood /></el-icon>
                <span class="font-bold">{{ formData.period === 'day' ? '每日' : '每周' }}推荐菜单</span>
              </div>
              <el-button type="success" size="small" class="export-btn">
                <el-icon><IconDownload /></el-icon>
                <span>导出菜单</span>
              </el-button>
            </div>
          </template>
          
          <div v-if="formData.period === 'day'">
            <!-- 单日菜单展示 -->
            <div class="day-menu animate__animated animate__fadeIn">
              <div class="menu-date-header">
                <div class="date-icon">📅</div>
                <h3 class="menu-date">{{ currentDate }} 推荐菜单</h3>
              </div>
              
              <el-row :gutter="24" class="menu-content">
                <el-col v-for="(meal, index) in dayMenu" :key="index" :span="8">
                  <el-card 
                    class="meal-card mb-4 animate__animated animate__zoomIn" 
                    :style="{ animationDelay: index * 0.15 + 's' }"
                    :body-style="{ padding: '0px' }"
                  >
                    <div class="meal-card-bg" :style="{ backgroundColor: getMealBgColor(meal.type) }"></div>
                    <template #header>
                      <div class="meal-header">
                        <div class="meal-title">
                          <span class="meal-icon">{{ getMealIcon(meal.title) }}</span>
                          <span class="font-bold">{{ meal.title }}</span>
                        </div>
                        <el-tag size="small" :type="meal.type" effect="dark" class="meal-time-tag">
                          {{ meal.time }}
                        </el-tag>
                      </div>
                    </template>
                    <div class="meal-content">
                      <div 
                        v-for="(dish, dishIndex) in meal.dishes" 
                        :key="dishIndex" 
                        class="dish-item animate__animated animate__fadeInRight"
                        :style="{ animationDelay: (index * 0.15 + dishIndex * 0.1) + 's' }"
                      >
                        <div class="dish-icon-wrapper" :style="{ backgroundColor: getDishColor(dish.category) }">
                          <div class="dish-icon">{{ dish.emoji }}</div>
                        </div>
                        <div class="dish-details">
                          <div class="dish-name">{{ dish.name }}</div>
                          <div class="dish-nutrition">
                            <el-tag size="small" effect="light" class="nutrition-tag">{{ dish.nutrition }}</el-tag>
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
            <div class="week-menu animate__animated animate__fadeIn">
              <el-tabs v-model="activeDay" tab-position="left" class="week-menu-tabs">
                <el-tab-pane 
                  v-for="(day, index) in weekMenu" 
                  :key="index" 
                  :label="day.day" 
                  :name="day.key"
                  class="week-tab-pane"
                >
                  <template #label>
                    <div class="week-tab-label">
                      <span class="day-icon">{{ getWeekdayIcon(day.key) }}</span>
                      <span>{{ day.day }}</span>
                    </div>
                  </template>
                  
                  <div class="menu-date-header">
                    <div class="date-icon">📅</div>
                    <h3 class="menu-date">{{ day.date }} 推荐菜单</h3>
                  </div>
                  
                  <el-row :gutter="24" class="menu-content">
                    <el-col v-for="(meal, mealIndex) in day.meals" :key="mealIndex" :span="8">
                      <el-card 
                        class="meal-card mb-4 animate__animated animate__zoomIn" 
                        :style="{ animationDelay: mealIndex * 0.15 + 's' }"
                        :body-style="{ padding: '0px' }"
                      >
                        <div class="meal-card-bg" :style="{ backgroundColor: getMealBgColor(meal.type) }"></div>
                        <template #header>
                          <div class="meal-header">
                            <div class="meal-title">
                              <span class="meal-icon">{{ getMealIcon(meal.title) }}</span>
                              <span class="font-bold">{{ meal.title }}</span>
                            </div>
                            <el-tag size="small" :type="meal.type" effect="dark" class="meal-time-tag">
                              {{ meal.time }}
                            </el-tag>
                          </div>
                        </template>
                        <div class="meal-content">
                          <div 
                            v-for="(dish, dishIndex) in meal.dishes" 
                            :key="dishIndex" 
                            class="dish-item animate__animated animate__fadeInRight"
                            :style="{ animationDelay: (mealIndex * 0.15 + dishIndex * 0.1) + 's' }"
                          >
                            <div class="dish-icon-wrapper" :style="{ backgroundColor: getDishColor(dish.category) }">
                              <div class="dish-icon">{{ dish.emoji }}</div>
                            </div>
                            <div class="dish-details">
                              <div class="dish-name">{{ dish.name }}</div>
                              <div class="dish-nutrition">
                                <el-tag size="small" effect="light" class="nutrition-tag">{{ dish.nutrition }}</el-tag>
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
          </div>
        </el-card>
      </div>
    </transition-group>
    
    <!-- 营养分析 -->
    <transition-group name="fade-up" tag="div">
      <div v-if="menuGenerated" :key="'nutrition-section'" class="nutrition-section">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-card class="chart-card mb-6 animate__animated animate__fadeInLeft">
              <template #header>
                <div class="card-header">
                  <div class="header-left">
                    <el-icon class="header-icon"><IconDataLine /></el-icon>
                    <span class="font-bold">营养雷达图分析</span>
                  </div>
                  <el-badge value="AI" type="success" class="ai-badge" />
                </div>
              </template>
              <div class="chart-container">
                <div class="chart-info">
                  <div class="info-item">
                    <div class="info-icon">📊</div>
                    <div class="info-text">六大营养素平衡分析</div>
                  </div>
                  <div class="info-divider"></div>
                  <div class="legend-container">
                    <div class="legend-item">
                      <div class="legend-color" style="background-color: rgba(58, 162, 254, 0.3);"></div>
                      <div class="legend-label">当前菜单</div>
                    </div>
                    <div class="legend-item">
                      <div class="legend-color legend-dashed"></div>
                      <div class="legend-label">推荐标准</div>
                    </div>
                    <div class="legend-item">
                      <div class="legend-color legend-dotted"></div>
                      <div class="legend-label">上周菜单</div>
                    </div>
                  </div>
                </div>
                <div id="nutritionRadarChart" style="width: 100%; height: 400px;" class="radar-chart"></div>
              </div>
            </el-card>
          </el-col>
          
          <el-col :span="12">
            <el-card class="nutrition-assessment-card mb-6 animate__animated animate__fadeInRight">
              <template #header>
                <div class="card-header">
                  <div class="header-left">
                    <el-icon class="header-icon"><IconGobletFull /></el-icon>
                    <span class="font-bold">营养摄入评估</span>
                  </div>
                  <div class="assessment-score">
                    <span class="score-label">综合评分</span>
                    <span class="score-value">86</span>
                  </div>
                </div>
              </template>
              <div class="nutrition-assessment">
                <div 
                  v-for="(item, index) in nutritionAssessment" 
                  :key="index" 
                  class="nutrition-item animate__animated animate__fadeInUp"
                  :style="{ animationDelay: index * 0.1 + 's' }"
                >
                  <div class="nutrition-header">
                    <div class="nutrition-name-wrapper">
                      <span class="nutrition-icon">{{ getNutritionIcon(item.name) }}</span>
                      <span class="nutrition-name">{{ item.name }}</span>
                    </div>
                    <el-tag 
                      :type="item.status === '适宜' ? 'success' : item.status === '偏低' ? 'warning' : 'danger'" 
                      size="small"
                      effect="dark"
                      class="status-tag"
                    >
                      {{ item.status }}
                    </el-tag>
                  </div>
                  <el-progress 
                    :percentage="item.percentage" 
                    :color="getProgressColor(item.percentage, item.status)"
                    :format="(percentage) => `${percentage}%`"
                    :stroke-width="12"
                    class="nutrition-progress"
                    :show-text="false"
                  ></el-progress>
                  <div class="progress-info">
                    <span class="progress-value">{{ item.percentage }}%</span>
                    <span class="progress-label">{{ getProgressLabel(item.percentage) }}</span>
                  </div>
                  <div class="nutrition-description">
                    {{ item.description }}
                  </div>
                </div>
                
                <div class="mt-4 animate__animated animate__fadeInUp" style="animation-delay: 0.6s;">
                  <div class="ai-suggestion-header">
                    <div class="ai-icon">🤖</div>
                    <h4 class="font-bold">AI营养建议</h4>
                  </div>
                  <div class="ai-suggestion">
                    <p>{{ aiSuggestion }}</p>
                    <div class="mt-4 adjust-btn-container">
                      <el-button type="primary" size="small" @click="adjustNutrition" class="adjust-btn">
                        <el-icon><IconRefreshRight /></el-icon>
                        <span>调整营养配比</span>
                      </el-button>
                    </div>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        
        <!-- 学生反馈预测 -->
        <el-card class="feedback-card mb-6 animate__animated animate__fadeInUp">
          <template #header>
            <div class="card-header">
              <div class="header-left">
                <el-icon class="header-icon"><IconUser /></el-icon>
                <span class="font-bold">学生接受度预测</span>
              </div>
              <el-tag type="info" effect="dark" class="header-tag">AI预测结果</el-tag>
            </div>
          </template>
          <div class="feedback-prediction">
            <el-row :gutter="24">
              <el-col :span="8">
                <div class="chart-wrapper animate__animated animate__fadeInLeft" style="animation-delay: 0.2s;">
                  <div class="chart-title">
                    <div class="chart-icon">📊</div>
                    <h4>预测满意度分布</h4>
                  </div>
                  <div id="satisfactionChart" style="width: 100%; height: 300px;"></div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="chart-wrapper animate__animated animate__fadeInLeft" style="animation-delay: 0.4s;">
                  <div class="chart-title">
                    <div class="chart-icon">📉</div>
                    <h4>食物剩余率预测</h4>
                  </div>
                  <div id="wasteRateChart" style="width: 100%; height: 300px;"></div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="prediction-summary animate__animated animate__fadeInRight" style="animation-delay: 0.6s;">
                  <div class="summary-header">
                    <div class="summary-icon">🔍</div>
                    <h4 class="font-bold">AI预测总结</h4>
                  </div>
                  <div class="prediction-items">
                    <div 
                      class="prediction-item" 
                      v-for="(item, index) in predictionSummary" 
                      :key="index"
                      :style="{ animationDelay: (0.6 + index * 0.1) + 's' }"
                    >
                      <el-icon><component :is="IconDataAnalysis" /></el-icon>
                      <span>{{ item }}</span>
                    </div>
                  </div>
                  <div class="history-comparison mt-4">
                    <div class="comparison-header">
                      <span>与历史推荐对比</span>
                      <el-tag type="success" effect="dark" class="improvement-tag">提升8.7%</el-tag>
                    </div>
                    <div class="improvement-chart">
                      <div class="chart-bar-container">
                        <div class="chart-label">本周</div>
                        <div class="chart-bar current" style="width: 92.5%;">
                          <span class="bar-value">92.5%</span>
                        </div>
                      </div>
                      <div class="chart-bar-container">
                        <div class="chart-label">上周</div>
                        <div class="chart-bar previous" style="width: 83.8%;">
                          <span class="bar-value">83.8%</span>
                        </div>
                      </div>
                      <div class="chart-bar-container">
                        <div class="chart-label">月均</div>
                        <div class="chart-bar average" style="width: 80.2%;">
                          <span class="bar-value">80.2%</span>
                        </div>
                      </div>
                    </div>
                    <p class="comparison-text">
                      当前菜单较上周菜单预测满意度提升8.7%，较上月平均提升12.3%。
                    </p>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, nextTick } from 'vue'
import * as echarts from 'echarts'
import { 
  Download as IconDownload, 
  DataAnalysis as IconDataAnalysis, 
  RefreshRight as IconRefreshRight, 
  Setting as IconSetting,
  DataLine as IconDataLine,
  Food as IconFood,
  GobletFull as IconGobletFull,
  User as IconUser
} from '@element-plus/icons-vue'
import 'animate.css'

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

// 获取进度评价
const getProgressLabel = (percentage) => {
  if (percentage >= 90) return '优秀'
  if (percentage >= 80) return '良好'
  if (percentage >= 70) return '适中'
  if (percentage >= 60) return '一般'
  return '不足'
}

// 获取周几图标
const getWeekdayIcon = (day) => {
  const icons = {
    monday: '🌞',
    tuesday: '🌟',
    wednesday: '🌈',
    thursday: '🌻',
    friday: '🌹'
  }
  return icons[day] || '📅'
}

// 获取餐次图标
const getMealIcon = (mealTitle) => {
  const icons = {
    '早餐': '🍳',
    '午餐': '🍲',
    '晚餐': '🍽️'
  }
  return icons[mealTitle] || '🍴'
}

// 获取营养素图标
const getNutritionIcon = (nutritionName) => {
  const icons = {
    '蛋白质': '🥩',
    '碳水化合物': '🍚',
    '脂肪': '🧈',
    '维生素': '🥗',
    '矿物质': '🧂',
    '膳食纤维': '🌾'
  }
  return icons[nutritionName] || '🍎'
}

// 获取餐次背景色
const getMealBgColor = (type) => {
  const colors = {
    'success': 'rgba(103, 194, 58, 0.05)',
    'warning': 'rgba(230, 162, 60, 0.05)',
    'danger': 'rgba(245, 108, 108, 0.05)'
  }
  return colors[type] || 'rgba(144, 147, 153, 0.05)'
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
/* 引入过渡动画 */
@import 'animate.css';

.menu-recommend-container {
  padding: 30px;
  max-width: 1280px;
  margin: 0 auto;
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  background-color: #f9fafc;
  min-height: 100vh;
}

/* 页面标题样式 */
.header-section {
  text-align: center;
  margin-bottom: 30px;
  animation: fadeInDown 1s ease;
}

.page-title {
  font-size: 2.2rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}

.title-icon {
  font-size: 2.5rem;
  margin-right: 15px;
}

.subtitle {
  font-size: 1.2rem;
  color: #5d6778;
  font-weight: 400;
}

/* 卡片样式优化 */
.param-card, .process-card, .menu-card, .chart-card, .nutrition-assessment-card, .feedback-card {
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(149, 157, 165, 0.15);
  transition: all 0.3s ease;
  border: none;
  overflow: hidden;
}

.param-card:hover, .process-card:hover, .menu-card:hover, .chart-card:hover, 
.nutrition-assessment-card:hover, .feedback-card:hover {
  box-shadow: 0 12px 30px rgba(149, 157, 165, 0.25);
  transform: translateY(-3px);
}

/* 卡片头部样式 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: linear-gradient(135deg, #42b983 0%, #3eaf7c 100%);
  color: white;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-icon {
  margin-right: 10px;
  font-size: 1.2rem;
}

.header-tag {
  font-weight: 500;
}

/* 参数表单样式 */
.param-form {
  padding: 10px;
}

.custom-select {
  width: 100%;
  transition: all 0.3s ease;
}

.custom-select:hover {
  transform: translateY(-2px);
}

.select-option-with-icon,
.checkbox-with-icon,
.radio-with-icon {
  display: flex;
  align-items: center;
  gap: 8px;
}

.option-icon,
.checkbox-icon,
.radio-icon {
  font-size: 1.2rem;
}

.checkbox-group-vertical {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.custom-radio-group {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.custom-radio {
  margin-right: 0 !important;
  margin-bottom: 10px;
}

/* 生成按钮样式 */
.generate-btn {
  padding: 12px 30px;
  font-size: 1rem;
  border-radius: 8px;
  margin-top: 15px;
  background: linear-gradient(135deg, #1a6fc7 0%, #2a81d7 100%);
  border: none;
  transition: all 0.3s ease;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
}

.generate-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 7px 14px rgba(50, 50, 93, 0.2);
}

.generate-btn:active {
  transform: translateY(-1px);
}

.btn-icon {
  font-size: 1.2rem;
}

/* 处理步骤样式 */
.processing-badge {
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 5px 10px;
  border-radius: 30px;
  font-size: 0.8rem;
  font-weight: 500;
}

.badge-dot {
  height: 8px;
  width: 8px;
  border-radius: 50%;
  background-color: #fff;
  margin-right: 6px;
  animation: pulse 1.5s infinite;
}

.custom-timeline {
  padding: 20px;
}

.step-content {
  background-color: #fff;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.step-content:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.step-title {
  font-weight: 700;
  font-size: 1.1rem;
  margin-bottom: 8px;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 10px;
}

.step-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #2a81d7;
  color: white;
  font-size: 0.8rem;
}

.step-description {
  color: #5d6778;
  font-size: 0.95rem;
  line-height: 1.5;
}

.custom-progress {
  height: 10px;
  border-radius: 5px;
}

/* 菜单展示样式 */
.menu-section {
  margin-top: 30px;
}

.menu-date-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 15px;
}

.date-icon {
  font-size: 1.8rem;
  margin-right: 10px;
}

.menu-date {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
}

.meal-card {
  overflow: hidden;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  position: relative;
}

.meal-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.meal-card-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  opacity: 0.5;
}

.meal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;
}

.meal-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.meal-icon {
  font-size: 1.3rem;
}

.meal-time-tag {
  font-weight: 500;
}

.meal-content {
  padding: 15px;
  position: relative;
  z-index: 1;
}

.dish-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  padding: 8px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.dish-item:hover {
  transform: translateX(5px);
  background-color: white;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

.dish-icon-wrapper {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 12px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
}

.dish-icon {
  font-size: 24px;
}

.dish-details {
  flex: 1;
}

.dish-name {
  font-weight: 600;
  margin-bottom: 5px;
  color: #333;
  font-size: 0.95rem;
}

.nutrition-tag {
  border-radius: 12px;
  padding: 0 8px;
  font-size: 0.75rem;
}

.week-menu-tabs {
  min-height: 450px;
}

.week-tab-label {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
}

.day-icon {
  font-size: 1.2rem;
}

.export-btn {
  display: flex;
  align-items: center;
  gap: 7px;
  font-weight: 500;
}

/* 营养雷达图分析样式 */
.nutrition-section {
  margin-top: 30px;
}

.chart-card, .nutrition-assessment-card {
  height: 100%;
}

.ai-badge {
  padding: 3px 6px;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.2);
}

.chart-container {
  padding: 20px;
}

.chart-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
  padding: 0 15px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-icon {
  font-size: 1.2rem;
}

.info-text {
  font-weight: 600;
  color: #5d6778;
}

.info-divider {
  width: 1px;
  height: 30px;
  background-color: #e0e0e0;
}

.legend-container {
  display: flex;
  gap: 15px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.legend-color {
  width: 15px;
  height: 15px;
  border-radius: 3px;
  background-color: rgba(58, 162, 254, 0.3);
}

.legend-dashed {
  border: 2px dashed #5470c6;
  background-color: transparent;
}

.legend-dotted {
  border: 2px dotted #91cc75;
  background-color: transparent;
}

.legend-label {
  font-size: 0.8rem;
  color: #606266;
}

.radar-chart {
  margin-top: 15px;
}

.assessment-score {
  background-color: rgba(255, 255, 255, 0.2);
  padding: 5px 10px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.score-label {
  font-size: 0.8rem;
}

.score-value {
  font-size: 1.1rem;
  font-weight: 700;
}

.nutrition-assessment {
  padding: 20px;
}

.nutrition-item {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.nutrition-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
}

.nutrition-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.nutrition-name-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nutrition-icon {
  font-size: 1.2rem;
}

.nutrition-name {
  font-weight: 600;
  color: #333;
}

.status-tag {
  font-weight: 500;
}

.nutrition-progress {
  margin-bottom: 5px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.progress-value {
  font-weight: 600;
  color: #333;
}

.progress-label {
  color: #909399;
  font-size: 0.85rem;
}

.nutrition-description {
  font-size: 0.85rem;
  color: #606266;
  line-height: 1.5;
}

.ai-suggestion-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.ai-icon {
  font-size: 1.5rem;
}

.ai-suggestion {
  background-color: #f0f9eb;
  border-radius: 10px;
  padding: 15px;
  font-size: 0.95rem;
  color: #5d6778;
  line-height: 1.6;
  border-left: 4px solid #67c23a;
}

.adjust-btn-container {
  display: flex;
  justify-content: flex-end;
}

.adjust-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
}

/* 学生反馈预测样式 */
.feedback-prediction {
  padding: 20px;
}

.chart-wrapper {
  height: 100%;
  padding: 15px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.05);
}

.chart-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 15px;
}

.chart-icon {
  font-size: 1.3rem;
}

.chart-title h4 {
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.prediction-summary {
  height: 100%;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.05);
}

.summary-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 15px;
}

.summary-icon {
  font-size: 1.3rem;
}

.prediction-items {
  margin-bottom: 20px;
}

.prediction-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 12px;
  padding: 8px;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  animation: fadeInRight 0.6s ease;
}

.prediction-item:hover {
  transform: translateX(5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.prediction-item i {
  color: #409EFF;
  margin-top: 3px;
}

.history-comparison {
  border-top: 1px dashed #dcdfe6;
  padding-top: 15px;
}

.comparison-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  font-weight: 600;
}

.improvement-tag {
  font-weight: 500;
}

.improvement-chart {
  margin-bottom: 15px;
}

.chart-bar-container {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.chart-label {
  width: 50px;
  font-size: 0.85rem;
  color: #606266;
}

.chart-bar {
  height: 24px;
  border-radius: 12px;
  position: relative;
  padding-right: 10px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-size: 0.8rem;
  font-weight: 500;
  color: white;
  transition: width 1s ease;
  animation: growWidth 1.2s ease;
}

.current {
  background: linear-gradient(90deg, #42b983 0%, #67c23a 100%);
}

.previous {
  background: linear-gradient(90deg, #409eff 0%, #66b1ff 100%);
}

.average {
  background: linear-gradient(90deg, #909399 0%, #c0c4cc 100%);
}

.bar-value {
  white-space: nowrap;
}

.comparison-text {
  font-size: 0.9rem;
  color: #606266;
  line-height: 1.5;
}

/* 过渡动画 */
.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.5s ease-out;
}

.fade-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-up-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* 脉冲动画 */
@keyframes pulse {
  0% {
    opacity: 0.5;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
  100% {
    opacity: 0.5;
    transform: scale(0.8);
  }
}

/* 宽度增长动画 */
@keyframes growWidth {
  from {
    width: 0;
  }
  to {
    width: var(--width, 100%);
  }
}
</style>