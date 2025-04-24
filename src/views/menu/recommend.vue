<template>
  <div class="menu-recommend-container">
    <div class="header-section">
      <div class="ai-data-badge">
        <div class="badge-icon">🤖</div>
        <div class="badge-text">AI + 大数据驱动</div>
      </div>
      <h1 class="page-title">
        <span class="title-icon">🍽️</span>
        <span class="title-text">基于大数据分析与AI大模型的智能菜单推荐</span>
      </h1>
      <div class="subtitle">科学搭配膳食，促进健康成长</div>
      <div class="data-indicators">
        <div class="indicator">
          <div class="indicator-value">326,508</div>
          <div class="indicator-label">已分析数据点</div>
        </div>
        <div class="indicator-divider"></div>
        <div class="indicator">
          <div class="indicator-value">98.2%</div>
          <div class="indicator-label">AI预测准确率</div>
        </div>
        <div class="indicator-divider"></div>
        <div class="indicator">
          <div class="indicator-value">42所</div>
          <div class="indicator-label">接入学校</div>
        </div>
      </div>
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
                <span class="font-bold">大数据分析处理过程</span>
              </div>
              <div class="data-stats-badge" v-if="!loading">
                <span class="stats-item">已处理: <span class="stats-value">4.7TB</span></span>
                <span class="stats-divider"></span>
                <span class="stats-item">数据源: <span class="stats-value">12</span></span>
              </div>
              <div class="processing-badge" v-if="loading">
                <span class="badge-dot"></span>
                <span>处理中</span>
              </div>
            </div>
          </template>
          
          <div class="big-data-metrics" v-if="processingSteps.length > 0">
            <div class="data-metric">
              <div class="metric-icon">📊</div>
              <div class="metric-value">{{(1280482 + (processingSteps.length * 58743)).toLocaleString()}}</div>
              <div class="metric-label">处理数据行</div>
            </div>
            <div class="data-metric">
              <div class="metric-icon">⚡</div>
              <div class="metric-value">{{(processingSteps.length * 3 + 12).toLocaleString()}}GB/s</div>
              <div class="metric-label">数据吞吐量</div>
            </div>
            <div class="data-metric">
              <div class="metric-icon">🔄</div>
              <div class="metric-value">{{Math.floor(processingSteps.length * 2.7 + 7)}}</div>
              <div class="metric-label">数据索引</div>
            </div>
            <div class="data-metric">
              <div class="metric-icon">🔍</div>
              <div class="metric-value">{{Math.floor((processingSteps.length * 0.1 + 0.62) * 100) / 100}}</div>
              <div class="metric-label">查询复杂度</div>
            </div>
          </div>
          
          <div class="data-source-list" v-if="processingSteps.length > 1">
            <div class="source-header">
              <span class="source-title">数据融合源</span>
              <span class="source-info">实时连接状态</span>
            </div>
            <div class="source-items">
              <div class="source-item" v-for="(source, index) in [
                {name: '全国学生营养数据库', records: '1.2亿', status: 'active'},
                {name: '膳食营养成分表', records: '24,508', status: 'active'},
                {name: '学生体质健康标准', records: '8,642', status: 'active'},
                {name: '地区食材供应链数据', records: '83万', status: 'active'},
                {name: '学生饮食偏好调查', records: '456万', status: 'active'}
              ]" :key="index">
                <div class="source-name">{{source.name}}<span class="source-records">{{source.records}}条</span></div>
                <div class="source-status">
                  <span :class="['status-indicator', source.status]"></span>
                  <span class="status-text">{{source.status === 'active' ? '已连接' : '连接中'}}</span>
                </div>
              </div>
            </div>
          </div>
          
          <el-timeline class="custom-timeline">
            <el-timeline-item
              v-for="(step, index) in processingSteps"
              :key="index"
              :timestamp="step.time"
              :type="step.type"
              :hollow="step.hollow"
              class="animate__animated animate__fadeInUp ai-processing-step"
              :style="{ animationDelay: index * 0.2 + 's' }"
            >
              <div class="step-content">
                <div class="ai-step-indicator" v-if="step.progress !== undefined && step.progress < 100">
                  <div class="ai-processing-dots">
                    <span></span><span></span><span></span>
                  </div>
                  <div class="ai-step-label">AI处理中</div>
                </div>
                <div class="ai-step-completed" v-else-if="step.progress === 100">
                  <div class="ai-step-icon">✓</div>
                  <div class="ai-step-label">AI处理完成</div>
                </div>
                <h4 class="step-title">
                  <span class="step-number">{{ index + 1 }}</span>
                  {{ step.title }}
                </h4>
                <p class="step-description">{{ step.description }}</p>
                <div v-if="step.progress !== undefined" class="mt-3">
                  <div class="progress-stats" v-if="step.progress < 100">
                    <div class="stat-item">
                      <span class="stat-label">并行处理</span>
                      <span class="stat-value">32线程</span>
                    </div>
                    <div class="stat-item">
                      <span class="stat-label">数据块</span>
                      <span class="stat-value">{{ Math.floor(step.progress / 5) }}/20</span>
                    </div>
                    <div class="stat-item">
                      <span class="stat-label">处理速度</span>
                      <span class="stat-value">{{ 12 + Math.floor(Math.random() * 8) }}MB/s</span>
                    </div>
                  </div>
                  
                  <!-- 大数据处理指标 -->
                  <div class="big-data-indicators" v-if="step.progress < 100">
                    <div class="data-processing-visual">
                      <div class="data-node" v-for="n in 24" :key="n" 
                           :class="{ 'node-active': n <= Math.ceil(step.progress / 4) }"
                           :style="{ animationDelay: (n * 0.1) + 's' }">
                      </div>
                    </div>
                    <div class="data-metrics">
                      <div class="metric-row">
                        <div class="metric-label">分布式节点:</div>
                        <div class="metric-value">{{Math.ceil(step.progress / 4)}}/24</div>
                      </div>
                      <div class="metric-row">
                        <div class="metric-label">队列深度:</div>
                        <div class="metric-value">{{(100 - step.progress) * 12}}</div>
                      </div>
                      <div class="metric-row">
                        <div class="metric-label">数据碎片:</div>
                        <div class="metric-value">{{Math.floor(step.progress * 3.6)}}</div>
                      </div>
                    </div>
                  </div>
                  
                  <el-progress 
                    :percentage="step.progress" 
                    :status="step.progress === 100 ? 'success' : ''"
                    :striped="step.progress < 100"
                    :striped-flow="step.progress < 100"
                    class="custom-progress"
                    :show-text="false"
                  ></el-progress>
                  <div class="progress-percentage">{{ step.progress }}%</div>
                </div>
                
                <!-- 数据流可视化 -->
                <div class="data-flow-visual" v-if="step.title.includes('AI') && step.progress !== undefined && step.progress < 100">
                  <div class="data-flow-line" v-for="i in 8" :key="i" :style="{ animationDelay: (i * 0.1) + 's' }"></div>
                </div>
                
                <!-- 大数据处理可视化 -->
                <div class="big-data-visual" v-if="!step.title.includes('AI') && step.progress !== undefined && step.progress < 100">
                  <div class="data-container">
                    <div class="data-block" v-for="i in 40" :key="i" 
                         :class="{ 'block-processed': i <= (step.progress / 2.5) }"
                         :style="{ transitionDelay: (i * 0.05) + 's' }">
                    </div>
                  </div>
                  <div class="processing-stats">
                    <div class="stat">
                      <div class="stat-name">清洗率</div>
                      <div class="stat-value">{{Math.min(99, step.progress + 20)}}%</div>
                    </div>
                    <div class="stat">
                      <div class="stat-name">优化率</div>
                      <div class="stat-value">{{Math.min(99, step.progress + 10)}}%</div>
                    </div>
                    <div class="stat">
                      <div class="stat-name">决策准确度</div>
                      <div class="stat-value">{{Math.min(99.9, 90 + (step.progress / 10)).toFixed(1)}}%</div>
                    </div>
                  </div>
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
                  <div class="ai-analyze-badge">
                    <span class="ai-icon">🤖</span>
                    <span class="ai-text">AI分析</span>
                  </div>
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
              
              <!-- 新增营养素趋势图 -->
              <div class="nutrition-trend-container">
                <div class="trend-header">
                  <div class="info-item">
                    <div class="info-icon">📈</div>
                    <div class="info-text">营养素趋势分析（近30天）</div>
                  </div>
                  <el-tooltip content="营养素摄入变化趋势分析，展示菜单优化效果" placement="top">
                    <el-icon class="trend-info-icon"><IconInfoFilled /></el-icon>
                  </el-tooltip>
                </div>
                <div id="nutritionTrendChart" style="width: 100%; height: 250px;" class="trend-chart"></div>
              </div>
              
              <!-- 新增营养对学生发展影响图表 -->
              <div class="nutrition-impact-container">
                <div class="impact-header">
                  <div class="info-item">
                    <div class="info-icon">🧠</div>
                    <div class="info-text">营养对学生发展的影响评估</div>
                  </div>
                  <div class="data-analysis-indicators">
                    <div class="indicator-dot"></div>
                    <span class="analysis-indicator-text">实时数据分析</span>
                    <el-tooltip content="根据当前菜单营养组成预测对学生各方面发展的促进效果" placement="top">
                      <el-icon class="trend-info-icon"><IconInfoFilled /></el-icon>
                    </el-tooltip>
                  </div>
                </div>
                <div class="realtime-data-banner">
                  <div class="data-source">数据来源: 全国学生营养与健康数据库 (n=46,892)</div>
                  <div class="update-time">最近更新: {{ new Date().toLocaleString() }}</div>
                  <div class="ai-model-info">模型: NutritionVision-GPT v2.3</div>
                </div>
                <div id="nutritionImpactChart" style="width: 100%; height: 250px;" class="impact-chart"></div>
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
  User as IconUser,
  InfoFilled as IconInfoFilled
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

// 预测总结变量在后面声明

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
    description: `正在收集${formData.schoolType === 'primary' ? '小学' : formData.schoolType === 'junior' ? '初中' : '高中'}学生信息、${formData.season === 'spring' ? '春季' : formData.season === 'summer' ? '夏季' : formData.season === 'autumn' ? '秋季' : '冬季'}食材库存及营养标准数据...`,
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
          description: `基于Grok 3大模型对多维数据进行深度分析，针对${formData.ageRange}岁${formData.dietaryRequirements.length > 0 ? '且有' + formData.dietaryRequirements.map(r => r === 'halal' ? '清真' : r === 'vegetarian' ? '素食' : r === 'lowSugar' ? '低糖' : '低盐').join('、') + '需求' : ''}的学生群体预测菜品接受度...`,
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
                description: `根据${formData.nutritionFocus === 'balanced' ? '均衡营养' : formData.nutritionFocus === 'immune' ? '免疫增强' : formData.nutritionFocus === 'growth' ? '促进发育' : '预防肥胖'}原则，优化菜品搭配，生成${formData.period === 'day' ? '每日' : '每周'}菜单...`,
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
                            description: `智能菜单推荐已完成，已为${formData.ageRange}岁${formData.schoolType === 'primary' ? '小学' : formData.schoolType === 'junior' ? '初中' : '高中'}生生成${formData.period === 'day' ? '每日' : '每周'}菜单方案。`,
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
  
  // 根据营养偏好和特殊需求调整营养指标
  updateNutritionAssessment()
  
  // 生成单日菜单数据
  dayMenu.value = generateDishBasedOnParams()
  
  // 生成周菜单数据
  const weekdays = [
    { key: 'monday', day: '星期一', date: getDateDisplay(0) },
    { key: 'tuesday', day: '星期二', date: getDateDisplay(1) },
    { key: 'wednesday', day: '星期三', date: getDateDisplay(2) },
    { key: 'thursday', day: '星期四', date: getDateDisplay(3) },
    { key: 'friday', day: '星期五', date: getDateDisplay(4) }
  ]
  
  weekMenu.value = weekdays.map(day => {
    return {
      ...day,
      meals: generateDishBasedOnParams()
    }
  })
  
  // 根据菜单内容调整AI营养建议
  generateAiSuggestion()
  
  // 更新预测总结数据
  updatePredictionSummary()
  
  // 初始化图表
  nextTick(() => {
    initNutritionRadarChart()
    initNutritionTrendChart()
    initNutritionImpactChart()
    initSatisfactionChart()
    initWasteRateChart()
  })
}

// 基于输入参数生成菜品
const generateDishBasedOnParams = () => {
  // 食材库 - 根据不同季节和饮食需求提供不同选择
  const seasonalFoods = {
    spring: {
      vegetables: ['春笋', '菠菜', '荠菜', '豌豆苗', '芦笋', '油菜', '香椿', '韭菜'],
      fruits: ['草莓', '樱桃', '枇杷', '杨梅'],
      meats: ['鸡肉', '鸭肉', '河虾', '带鱼']
    },
    summer: {
      vegetables: ['西红柿', '黄瓜', '茄子', '苦瓜', '冬瓜', '空心菜', '丝瓜', '莴笋'],
      fruits: ['西瓜', '桃子', '杏子', '李子', '葡萄'],
      meats: ['牛肉', '鲫鱼', '虾仁', '鲜贝']
    },
    autumn: {
      vegetables: ['茼蒿', '萝卜', '白菜', '芹菜', '菜花', '南瓜', '山药', '芋头'],
      fruits: ['柿子', '石榴', '柚子', '苹果', '梨'],
      meats: ['猪肉', '羊肉', '螃蟹', '鸽子']
    },
    winter: {
      vegetables: ['白萝卜', '胡萝卜', '白菜', '芥菜', '菠菜', '青菜', '土豆', '黑木耳'],
      fruits: ['橙子', '柑橘', '猕猴桃', '火龙果'],
      meats: ['排骨', '牛腩', '鱼丸', '鲜鱼']
    }
  }
  
  // 主食库
  const staples = {
    common: ['米饭', '馒头', '面条', '包子', '花卷', '饺子', '粥'],
    nutrition: ['五谷米饭', '杂粮馒头', '燕麦粥', '全麦面包', '糙米饭', '红薯', '小米粥']
  }
  
  // 根据季节选择食材
  const season = formData.season || 'autumn'
  const seasonalVegetables = seasonalFoods[season].vegetables
  const seasonalFruits = seasonalFoods[season].fruits
  const seasonalMeats = seasonalFoods[season].meats
  
  // 根据特殊需求过滤食材
  let availableMeats = [...seasonalMeats]
  let availableStaples = [...staples.common, ...staples.nutrition]
  
  if (formData.dietaryRequirements.includes('vegetarian')) {
    availableMeats = ['豆腐', '豆干', '素鸡', '素肉', '香菇', '木耳']
  }
  
  if (formData.dietaryRequirements.includes('halal')) {
    availableMeats = availableMeats.filter(meat => !['猪肉', '排骨'].includes(meat))
    availableMeats.push('牛肉', '羊肉', '鸡肉')
  }
  
  // 随机生成一个菜品
  const generateRandomDish = (type) => {
    let name, category, emoji, nutrition
    
    if (type === 'staple') {
      // 生成主食
      const stapleIndex = formData.nutritionFocus === 'balanced' || formData.nutritionFocus === 'growth' 
        ? Math.floor(Math.random() * staples.nutrition.length)
        : Math.floor(Math.random() * staples.common.length)
      name = formData.nutritionFocus === 'balanced' || formData.nutritionFocus === 'growth' 
        ? staples.nutrition[stapleIndex]
        : staples.common[stapleIndex]
      category = 'staple'
      emoji = '🍚'
      nutrition = '碳水+膳食纤维'
    } else if (type === 'meat') {
      // 生成肉类/蛋白质类菜品
      const randomMeat = availableMeats[Math.floor(Math.random() * availableMeats.length)]
      const cookMethods = ['红烧', '清蒸', '香煎', '烧烤', '爆炒', '煲汤']
      const randomMethod = cookMethods[Math.floor(Math.random() * cookMethods.length)]
      name = randomMethod + randomMeat
      category = 'meat'
      emoji = formData.dietaryRequirements.includes('vegetarian') ? '🥗' : '🍖'
      nutrition = formData.dietaryRequirements.includes('vegetarian') ? '植物蛋白+膳食纤维' : '优质蛋白+铁'
    } else if (type === 'vegetable') {
      // 生成蔬菜类菜品
      const randomVeg = seasonalVegetables[Math.floor(Math.random() * seasonalVegetables.length)]
      const cookMethods = ['清炒', '凉拌', '蒜蓉', '炖煮', '素炒']
      const randomMethod = cookMethods[Math.floor(Math.random() * cookMethods.length)]
      name = randomMethod + randomVeg
      category = 'vegetable'
      emoji = '🥬'
      nutrition = '维生素+膳食纤维'
    } else if (type === 'soup') {
      // 生成汤类
      const randomVeg = seasonalVegetables[Math.floor(Math.random() * seasonalVegetables.length)]
      const randomMeat = availableMeats[Math.floor(Math.random() * availableMeats.length)]
      const bases = ['番茄', '紫菜', '冬瓜', '豆腐', '菌菇']
      const randomBase = bases[Math.floor(Math.random() * bases.length)]
      
      if (formData.dietaryRequirements.includes('vegetarian')) {
        name = randomBase + randomVeg + '汤'
      } else {
        name = randomMeat + randomBase + '汤'
      }
      
      category = 'soup'
      emoji = '🍲'
      nutrition = '维生素+水分+矿物质'
    } else if (type === 'fruit') {
      // 生成水果
      const randomFruit = seasonalFruits[Math.floor(Math.random() * seasonalFruits.length)]
      name = randomFruit
      category = 'fruit'
      emoji = '🍎'
      nutrition = '维生素+膳食纤维'
    } else if (type === 'dessert') {
      // 生成甜点/饮品
      const desserts = ['酸奶', '水果沙拉', '蒸蛋糕', '水果拼盘', '燕麦片']
      const randomDessert = desserts[Math.floor(Math.random() * desserts.length)]
      name = randomDessert
      category = 'dessert'
      emoji = '🥛'
      nutrition = '钙+益生菌'
    }
    
    // 如果有低糖需求，调整菜品
    if (formData.dietaryRequirements.includes('lowSugar') && (type === 'dessert' || type === 'staple')) {
      nutrition += '+低糖'
    }
    
    // 如果有低盐需求，调整菜品
    if (formData.dietaryRequirements.includes('lowSalt') && (type === 'meat' || type === 'vegetable' || type === 'soup')) {
      nutrition += '+低盐'
    }
    
    return { name, category, emoji, nutrition }
  }
  
  // 根据年龄段调整菜品数量和类型
  const getAgeAppropriateMenu = () => {
    let breakfastItems = []
    let lunchItems = []
    let dinnerItems = []
    
    // 根据年龄段调整早餐
    if (formData.ageRange === '6-9') {
      breakfastItems = [
        generateRandomDish('staple'),
        generateRandomDish('meat'),
        generateRandomDish('fruit')
      ]
    } else {
      breakfastItems = [
        generateRandomDish('staple'),
        generateRandomDish('meat'),
        generateRandomDish('vegetable'),
        generateRandomDish('fruit')
      ]
    }
    
    // 根据年龄段调整午餐
    if (formData.ageRange === '6-9') {
      lunchItems = [
        generateRandomDish('staple'),
        generateRandomDish('meat'),
        generateRandomDish('vegetable'),
        generateRandomDish('soup')
      ]
    } else if (formData.ageRange === '10-12') {
      lunchItems = [
        generateRandomDish('staple'),
        generateRandomDish('meat'),
        generateRandomDish('vegetable'),
        generateRandomDish('soup'),
        generateRandomDish('fruit')
      ]
    } else {
      lunchItems = [
        generateRandomDish('staple'),
        generateRandomDish('meat'),
        generateRandomDish('meat'),
        generateRandomDish('vegetable'),
        generateRandomDish('soup')
      ]
    }
    
    // 根据年龄段调整晚餐
    if (formData.ageRange === '6-9') {
      dinnerItems = [
        generateRandomDish('staple'),
        generateRandomDish('meat'),
        generateRandomDish('vegetable'),
        generateRandomDish('soup'),
        generateRandomDish('dessert')
      ]
    } else {
      dinnerItems = [
        generateRandomDish('staple'),
        generateRandomDish('meat'),
        generateRandomDish('vegetable'),
        generateRandomDish('vegetable'),
        generateRandomDish('soup'),
        generateRandomDish('dessert')
      ]
    }
    
    return [
      {
        title: '早餐',
        time: '7:00-8:00',
        type: 'success',
        dishes: breakfastItems
      },
      {
        title: '午餐',
        time: '12:00-13:00',
        type: 'warning',
        dishes: lunchItems
      },
      {
        title: '晚餐',
        time: '18:00-19:00',
        type: 'danger',
        dishes: dinnerItems
      }
    ]
  }
  
  return getAgeAppropriateMenu()
}

// 获取显示日期
const getDateDisplay = (dayOffset) => {
  const date = new Date()
  date.setDate(date.getDate() + dayOffset)
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
}

// 更新营养评估
const updateNutritionAssessment = () => {
  // 根据营养偏好和特殊需求调整营养值
  let proteinValue = 80 + Math.floor(Math.random() * 15)
  let carbValue = 85 + Math.floor(Math.random() * 15)
  let fatValue = 70 + Math.floor(Math.random() * 15)
  let vitaminValue = 65 + Math.floor(Math.random() * 15)
  let mineralValue = 70 + Math.floor(Math.random() * 15)
  let fiberValue = 55 + Math.floor(Math.random() * 15)
  
  // 根据营养偏好调整
  if (formData.nutritionFocus === 'balanced') {
    // 均衡营养 - 各指标都提高一些
    proteinValue = Math.min(proteinValue + 5, 100)
    carbValue = Math.min(carbValue + 5, 100)
    fatValue = Math.min(fatValue + 5, 100)
    vitaminValue = Math.min(vitaminValue + 5, 100)
    mineralValue = Math.min(mineralValue + 5, 100)
    fiberValue = Math.min(fiberValue + 5, 100)
  } else if (formData.nutritionFocus === 'immune') {
    // 增强免疫 - 提高维生素和矿物质
    vitaminValue = Math.min(vitaminValue + 15, 100)
    mineralValue = Math.min(mineralValue + 15, 100)
  } else if (formData.nutritionFocus === 'growth') {
    // 促进发育 - 提高蛋白质和矿物质
    proteinValue = Math.min(proteinValue + 15, 100)
    mineralValue = Math.min(mineralValue + 10, 100)
  } else if (formData.nutritionFocus === 'obesity') {
    // 预防肥胖 - 降低碳水和脂肪，提高膳食纤维
    carbValue = Math.max(carbValue - 10, 60)
    fatValue = Math.max(fatValue - 15, 60)
    fiberValue = Math.min(fiberValue + 20, 100)
  }
  
  // 根据特殊需求调整
  if (formData.dietaryRequirements.includes('vegetarian')) {
    // 素食 - 降低蛋白质，提高膳食纤维
    proteinValue = Math.max(proteinValue - 10, 65)
    fiberValue = Math.min(fiberValue + 15, 100)
  }
  
  if (formData.dietaryRequirements.includes('lowSugar')) {
    // 低糖 - 降低碳水
    carbValue = Math.max(carbValue - 15, 70)
  }
  
  if (formData.dietaryRequirements.includes('lowSalt')) {
    // 低盐 - 调整矿物质
    mineralValue = Math.max(mineralValue - 5, 65)
  }
  
  // 设置营养状态
  const getStatus = (value) => {
    if (value >= 80) return '适宜'
    if (value >= 65) return '偏低'
    return '不足'
  }
  
  // 更新营养评估数据
  nutritionAssessment.value = [
    { 
      name: '蛋白质',
      percentage: proteinValue,
      status: getStatus(proteinValue),
      description: `当前菜单蛋白质摄入达到中国营养学会推荐标准的${proteinValue}%，${getStatus(proteinValue) === '适宜' ? '符合' : '略低于'}学生生长发育需求。`
    },
    { 
      name: '碳水化合物',
      percentage: carbValue,
      status: getStatus(carbValue),
      description: `碳水化合物摄入${getStatus(carbValue) === '适宜' ? '合理' : '略低'}，${formData.nutritionFocus === 'obesity' ? '控制总量，' : ''}以复合碳水为主，可提供持续稳定的能量。`
    },
    { 
      name: '脂肪',
      percentage: fatValue,
      status: getStatus(fatValue),
      description: `脂肪摄入${getStatus(fatValue) === '适宜' ? '适中' : '偏低'}，不饱和脂肪酸占比${formData.nutritionFocus === 'obesity' ? '适中' : '大'}，有助于心脑血管健康。`
    },
    { 
      name: '维生素',
      percentage: vitaminValue,
      status: getStatus(vitaminValue),
      description: `维生素总体摄入${getStatus(vitaminValue)}，特别是维生素${formData.season === 'winter' ? 'D' : 'E'}和维生素${formData.season === 'summer' ? 'C' : 'A'}可${getStatus(vitaminValue) === '适宜' ? '保持摄入' : '适当增加'}。`
    },
    { 
      name: '矿物质',
      percentage: mineralValue,
      status: getStatus(mineralValue),
      description: `矿物质摄入${getStatus(mineralValue) === '适宜' ? '基本达标' : '略有不足'}，钙和铁的摄入可${getStatus(mineralValue) === '适宜' ? '维持' : '适当增加'}。`
    },
    { 
      name: '膳食纤维',
      percentage: fiberValue,
      status: getStatus(fiberValue),
      description: `膳食纤维摄入${getStatus(fiberValue) === '适宜' ? '达到推荐量' : '低于推荐量'}，可${getStatus(fiberValue) === '适宜' ? '保持' : '增加'}全谷物和蔬果摄入。`
    }
  ]
}

// 生成AI营养建议
const generateAiSuggestion = () => {
  // 检查营养不足的项目
  const deficientNutrients = nutritionAssessment.value.filter(item => item.status !== '适宜')
  
  let suggestion = '根据当前学生群体特点和季节性因素，'
  
  if (deficientNutrients.length > 0) {
    suggestion += '建议适当增加'
    
    deficientNutrients.forEach((nutrient, index) => {
      if (nutrient.name === '蛋白质') {
        suggestion += '富含优质蛋白的食物（如鸡蛋、牛奶、鱼类）'
      } else if (nutrient.name === '碳水化合物') {
        suggestion += '全谷类食物（如糙米、燕麦）'
      } else if (nutrient.name === '脂肪') {
        suggestion += '健康脂肪（如坚果、橄榄油）'
      } else if (nutrient.name === '维生素') {
        suggestion += `富含维生素的食物（如${formData.season === 'winter' ? '胡萝卜、菠菜' : '西红柿、柑橘类水果'}）`
      } else if (nutrient.name === '矿物质') {
        suggestion += '含钙和铁丰富的食物（如乳制品、绿叶蔬菜）'
      } else if (nutrient.name === '膳食纤维') {
        suggestion += '膳食纤维（如全谷物、豆类）'
      }
      
      if (index < deficientNutrients.length - 2) {
        suggestion += '、'
      } else if (index === deficientNutrients.length - 2) {
        suggestion += '和'
      }
    })
    
    suggestion += '，'
  } else {
    suggestion += '当前菜单营养均衡，建议保持多样化的食物选择，'
  }
  
  // 根据季节添加特定建议
  if (formData.season === 'winter') {
    suggestion += '并考虑在冬季适当增加热量摄入，同时补充足够的维生素D。'
  } else if (formData.season === 'summer') {
    suggestion += '夏季注意补充足够的水分和电解质，适当增加新鲜水果蔬菜的摄入。'
  } else if (formData.season === 'spring') {
    suggestion += '春季多食用应季蔬菜水果，增强免疫力，促进新陈代谢。'
  } else {
    suggestion += '秋季气候干燥，建议多食用滋阴润燥的食品，如梨、银耳等。'
  }
  
  // 根据年龄段添加特定建议
  if (formData.ageRange === '6-9') {
    suggestion += '对于6-9岁的学生，还应注重钙的摄入和优质蛋白质的供给，有助于骨骼发育。'
  } else if (formData.ageRange === '10-12') {
    suggestion += '10-12岁的学生正处于生长发育加速期，需要保证足够的蛋白质、钙、铁等营养素。'
  } else if (formData.ageRange === '13-15') {
    suggestion += '13-15岁青少年生长发育迅速，需增加能量和蛋白质摄入，并保证充足的钙和铁。'
  } else {
    suggestion += '16-18岁青少年应注重平衡膳食，满足生长发育高峰期的营养需求，特别是蛋白质和微量元素。'
  }
  
  aiSuggestion.value = suggestion
}

// 预测总结数据
const predictionSummary = ref([
  '预测本周菜单学生总体满意度为92.5%，较上周提升8.7%',
  '剩余率预计降低至6.3%，较平均水平降低3.1%',
  '学生对清蒸龙利鱼和山药排骨汤接受度最高',
  '建议增加新鲜水果种类，进一步提高满意度',
  '当前菜单营养素搭配适合6-9岁学生群体生长发育需求'
])

// 在菜单生成时更新预测总结
const updatePredictionSummary = () => {
  // 随机生成满意度数据
  const satisfactionRate = 85 + Math.floor(Math.random() * 10)
  const improvementRate = 5 + Math.floor(Math.random() * 8)
  const wasteRate = 5 + Math.floor(Math.random() * 5)
  const wasteImprovement = 2 + Math.floor(Math.random() * 4)
  
  // 获取菜单中的随机菜品
  let allDishes = []
  if (formData.period === 'day') {
    dayMenu.value.forEach(meal => {
      meal.dishes.forEach(dish => {
        allDishes.push(dish.name)
      })
    })
  } else {
    const firstDay = weekMenu.value[0]
    firstDay.meals.forEach(meal => {
      meal.dishes.forEach(dish => {
        allDishes.push(dish.name)
      })
    })
  }
  
  // 随机选择两个菜品作为接受度高的菜品
  const shuffledDishes = [...allDishes].sort(() => 0.5 - Math.random())
  const popularDish1 = shuffledDishes[0]
  const popularDish2 = shuffledDishes[1]
  
  // 更新预测总结
  predictionSummary.value = [
    `预测本周菜单学生总体满意度为${satisfactionRate}%，较上周提升${improvementRate}%`,
    `剩余率预计降低至${wasteRate}%，较平均水平降低${wasteImprovement}%`,
    `学生对${popularDish1}和${popularDish2}接受度最高`,
    `建议增加新鲜水果种类，进一步提高满意度`,
    `当前菜单营养素搭配适合${formData.ageRange}岁学生群体生长发育需求`
  ]
}

// 初始化营养雷达图
const initNutritionRadarChart = () => {
  const chartDom = document.getElementById('nutritionRadarChart')
  if (!chartDom) return
  
  const myChart = echarts.init(chartDom)
  
  // 获取最新的营养评估数据
  const nutritionData = nutritionAssessment.value.map(item => item.percentage)
  
  // 计算上周"模拟"数据 - 基于当前值的随机波动
  const lastWeekData = nutritionData.map(value => Math.max(40, value - 10 - Math.floor(Math.random() * 15)))
  
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
            value: nutritionData,
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
            value: lastWeekData,
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

// 初始化营养趋势图
const initNutritionTrendChart = () => {
  const chartDom = document.getElementById('nutritionTrendChart')
  if (!chartDom) return
  
  const myChart = echarts.init(chartDom)
  
  // 为每个营养素生成过去四周的随机趋势数据，确保当前周的值与营养评估一致
  const getCurrentValue = (nutrientName) => {
    const nutrient = nutritionAssessment.value.find(item => item.name === nutrientName)
    return nutrient ? nutrient.percentage : 70
  }
  
  // 生成连贯的历史数据（确保有上升趋势）
  const generateHistoricalData = (currentValue) => {
    const weekData = []
    let value = Math.max(40, currentValue - 15 - Math.floor(Math.random() * 10))
    
    // 生成一个大致上升的趋势
    for (let i = 0; i < 4; i++) {
      weekData.push(value)
      // 每周增加一些，但保持波动
      value = Math.min(value + 3 + Math.floor(Math.random() * 5), currentValue)
    }
    
    // 添加当前周的实际值
    weekData.push(currentValue)
    return weekData
  }
  
  const proteinData = generateHistoricalData(getCurrentValue('蛋白质'))
  const carbData = generateHistoricalData(getCurrentValue('碳水化合物'))
  const fatData = generateHistoricalData(getCurrentValue('脂肪'))
  const vitaminData = generateHistoricalData(getCurrentValue('维生素'))
  const mineralData = generateHistoricalData(getCurrentValue('矿物质'))
  const fiberData = generateHistoricalData(getCurrentValue('膳食纤维'))
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['蛋白质', '碳水化合物', '脂肪', '维生素', '矿物质', '膳食纤维'],
      top: 'top',
      textStyle: {
        fontSize: 12
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['一月前', '三周前', '两周前', '上周', '本周'],
      axisLabel: {
        fontSize: 11
      }
    },
    yAxis: {
      type: 'value',
      min: 40,
      max: 100,
      axisLabel: {
        formatter: '{value}%'
      }
    },
    series: [
      {
        name: '蛋白质',
        type: 'line',
        smooth: true,
        emphasis: {
          focus: 'series'
        },
        data: proteinData,
        lineStyle: {
          width: 3
        },
        symbolSize: 8
      },
      {
        name: '碳水化合物',
        type: 'line',
        smooth: true,
        emphasis: {
          focus: 'series'
        },
        data: carbData,
        lineStyle: {
          width: 3
        },
        symbolSize: 8
      },
      {
        name: '脂肪',
        type: 'line',
        smooth: true,
        emphasis: {
          focus: 'series'
        },
        data: fatData,
        lineStyle: {
          width: 3
        },
        symbolSize: 8
      },
      {
        name: '维生素',
        type: 'line',
        smooth: true,
        emphasis: {
          focus: 'series'
        },
        data: vitaminData,
        lineStyle: {
          width: 3
        },
        symbolSize: 8
      },
      {
        name: '矿物质',
        type: 'line',
        smooth: true,
        emphasis: {
          focus: 'series'
        },
        data: mineralData,
        lineStyle: {
          width: 3
        },
        symbolSize: 8
      },
      {
        name: '膳食纤维',
        type: 'line',
        smooth: true,
        emphasis: {
          focus: 'series'
        },
        data: fiberData,
        lineStyle: {
          width: 3
        },
        symbolSize: 8
      }
    ]
  }
  
  myChart.setOption(option)
  
  window.addEventListener('resize', () => {
    myChart.resize()
  })
}

// 初始化营养影响图
const initNutritionImpactChart = () => {
  const chartDom = document.getElementById('nutritionImpactChart')
  if (!chartDom) return
  
  const myChart = echarts.init(chartDom)
  
  // 基于当前营养评估动态生成影响数据
  const avgNutritionScore = nutritionAssessment.value.reduce((sum, item) => sum + item.percentage, 0) / nutritionAssessment.value.length
  
  // 基于平均营养评分计算各发展影响指标
  const calculateImpact = (baseValue, nutritionCorrelation = 0.7) => {
    // 计算基础值加上与营养相关的浮动值
    const nutritionImpact = (avgNutritionScore - 70) * nutritionCorrelation
    return Math.round(Math.min(Math.max(baseValue + nutritionImpact, 60), 95))
  }
  
  // 基于年龄段进行调整
  const ageFactors = {
    '6-9': { physical: 2, cognitive: 0, immune: 3, energy: 2, mood: 1, focus: -1 },
    '10-12': { physical: 3, cognitive: 1, immune: 2, energy: 3, mood: 0, focus: 0 },
    '13-15': { physical: 4, cognitive: 2, immune: 1, energy: 3, mood: -1, focus: 1 },
    '16-18': { physical: 3, cognitive: 3, immune: 0, energy: 2, mood: -2, focus: 2 }
  }
  
  const ageFactor = ageFactors[formData.ageRange] || ageFactors['6-9']
  
  // 计算各指标的值和比上周的提升
  const physicalValue = calculateImpact(78) + ageFactor.physical
  const cognitiveValue = calculateImpact(75) + ageFactor.cognitive
  const immuneValue = calculateImpact(80) + ageFactor.immune
  const energyValue = calculateImpact(76) + ageFactor.energy
  const moodValue = calculateImpact(72) + ageFactor.mood
  const focusValue = calculateImpact(74) + ageFactor.focus
  
  // 计算与"上周"相比的提升
  const getImprovement = (value) => {
    return Math.floor(Math.random() * 5) + 5 // 5-10之间的随机提升
  }
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: function(params) {
        const data = params[0]
        return `${data.name}: ${data.value}%<br/>
                <small>与标准菜单相比 ${data.data.comparison > 0 ? '+' + data.data.comparison : data.data.comparison}%</small>`
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '8%',
      top: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      max: 100,
      axisLabel: {
        formatter: '{value}%'
      }
    },
    yAxis: {
      type: 'category',
      data: ['身体发育', '认知能力', '免疫功能', '精力水平', '情绪稳定性', '注意力集中'],
      axisLabel: {
        fontSize: 12,
        margin: 20,
        formatter: function(value) {
          const icons = {
            '身体发育': '💪',
            '认知能力': '🧠',
            '免疫功能': '🛡️',
            '精力水平': '⚡',
            '情绪稳定性': '😊',
            '注意力集中': '🔍'
          }
          return `${icons[value] || ''} ${value}`
        },
        rich: {
          icon: {
            fontSize: 16,
            padding: [0, 5, 0, 0]
          }
        }
      }
    },
    series: [
      {
        name: '预期促进效果',
        type: 'bar',
        data: [
          {value: physicalValue, comparison: getImprovement(physicalValue), itemStyle: {color: '#91cc75'}},
          {value: cognitiveValue, comparison: getImprovement(cognitiveValue), itemStyle: {color: '#5470c6'}},
          {value: immuneValue, comparison: getImprovement(immuneValue), itemStyle: {color: '#ee6666'}},
          {value: energyValue, comparison: getImprovement(energyValue), itemStyle: {color: '#fac858'}},
          {value: moodValue, comparison: getImprovement(moodValue), itemStyle: {color: '#73c0de'}},
          {value: focusValue, comparison: getImprovement(focusValue), itemStyle: {color: '#3ba272'}}
        ],
        label: {
          show: true,
          position: 'right',
          formatter: function(params) {
            return `${params.value}% ${params.data.comparison > 0 ? '↑' : '↓'}${Math.abs(params.data.comparison)}%`
          }
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        barWidth: '60%',
        barCategoryGap: '20%'
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
  
  // 动态生成满意度分布数据，基于平均营养评分
  const avgNutritionScore = nutritionAssessment.value.reduce((sum, item) => sum + item.percentage, 0) / nutritionAssessment.value.length
  
  // 满意度基础值随营养评分升高
  const veryHappyBase = (avgNutritionScore - 70) * 0.7
  
  // 计算满意度分布
  const veryHappy = Math.min(Math.max(45 + veryHappyBase, 40), 60)
  const happy = Math.min(Math.max(95 - veryHappy, 30), 45)
  const neutral = Math.min(Math.max(100 - veryHappy - happy - 2, 3), 10)
  const unhappy = 100 - veryHappy - happy - neutral
  
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
          { value: veryHappy.toFixed(1), name: '非常满意' },
          { value: happy.toFixed(1), name: '满意' },
          { value: neutral.toFixed(1), name: '一般' },
          { value: unhappy.toFixed(1), name: '不满意' }
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
  
  // 动态生成剩余率数据，基于营养评分和特殊需求
  const avgNutritionScore = nutritionAssessment.value.reduce((sum, item) => sum + item.percentage, 0) / nutritionAssessment.value.length
  
  // 剩余率基础值随营养评分降低
  const wasteRateBase = 10 - (avgNutritionScore - 70) * 0.1
  
  // 根据特殊需求调整
  let wasteRateAdjustment = 0
  if (formData.dietaryRequirements.length > 0) {
    // 有特殊需求时，剩余率降低（因为更符合需求）
    wasteRateAdjustment = -formData.dietaryRequirements.length * 0.5
  }
  
  // 根据年龄段调整剩余率
  const ageAdjustments = {
    '6-9': 1,    // 小学低年级剩余较多
    '10-12': 0.5, // 小学高年级
    '13-15': 0,   // 初中生
    '16-18': -0.5 // 高中生更少浪费
  }
  
  const ageAdjustment = ageAdjustments[formData.ageRange] || 0
  
  // 计算三餐剩余率
  const breakfastWaste = Math.max(Math.min(wasteRateBase + wasteRateAdjustment + ageAdjustment - 1, 10), 3).toFixed(1)
  const lunchWaste = Math.max(Math.min(wasteRateBase + wasteRateAdjustment + ageAdjustment + 1, 12), 4).toFixed(1)
  const dinnerWaste = Math.max(Math.min(wasteRateBase + wasteRateAdjustment + ageAdjustment, 11), 3.5).toFixed(1)
  const avgWaste = ((parseFloat(breakfastWaste) + parseFloat(lunchWaste) + parseFloat(dinnerWaste)) / 3).toFixed(1)
  
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
            value: breakfastWaste,
            itemStyle: { color: '#91CC75' }
          },
          {
            value: lunchWaste,
            itemStyle: { color: '#FAC858' }
          },
          {
            value: dinnerWaste,
            itemStyle: { color: '#73C0DE' }
          },
          {
            value: avgWaste,
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
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  background-color: #f9fafc;
  min-height: 100vh;
  box-sizing: border-box;
}

/* 页面标题样式 */
.header-section {
  text-align: center;
  margin-bottom: 40px;
  animation: fadeInDown 1s ease;
  padding: 30px 20px;
  position: relative;
  overflow: hidden;
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(66, 185, 131, 0.1) 0%, rgba(62, 175, 124, 0.2) 100%);
  box-shadow: 0 10px 30px rgba(62, 175, 124, 0.1);
}

.ai-data-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  display: flex;
  align-items: center;
  padding: 6px 12px;
  background: linear-gradient(135deg, #3b7cbd 0%, #1a5fb4 100%);
  border-radius: 20px;
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  box-shadow: 0 4px 10px rgba(26, 95, 180, 0.3);
  z-index: 10;
}

.badge-icon {
  margin-right: 6px;
  font-size: 1.2rem;
}

.data-indicators {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.indicator {
  text-align: center;
  padding: 0 15px;
}

.indicator-value {
  font-size: 1.4rem;
  font-weight: 700;
  color: #3b7cbd;
  margin-bottom: 5px;
}

.indicator-label {
  font-size: 0.85rem;
  color: #5d6778;
}

.indicator-divider {
  width: 1px;
  height: 40px;
  background-color: rgba(0, 0, 0, 0.1);
}

.header-section::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.1) 25%,
    rgba(255, 255, 255, 0.1) 50%,
    rgba(255, 255, 255, 0) 75%,
    rgba(255, 255, 255, 0) 100%
  );
  transform: rotate(45deg);
  animation: shimmer 5s infinite linear;
  z-index: 1;
}

.page-title, .subtitle {
  position: relative;
  z-index: 2;
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
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: none;
  overflow: hidden;
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.95);
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
  padding: 18px 20px;
  background: linear-gradient(135deg, #42b983 0%, #3eaf7c 100%);
  color: white;
  position: relative;
  overflow: hidden;
}

.card-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect x="0" y="0" width="50" height="50" fill="rgba(255,255,255,0.03)"/><rect x="50" y="50" width="50" height="50" fill="rgba(255,255,255,0.03)"/></svg>');
  opacity: 0.3;
}

.header-left {
  display: flex;
  align-items: center;
  position: relative;
  z-index: 1;
}

.header-icon {
  margin-right: 10px;
  font-size: 1.3rem;
  filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.2));
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
  padding: 14px 35px;
  font-size: 1.05rem;
  border-radius: 50px;
  margin-top: 20px;
  background: linear-gradient(135deg, #1a6fc7 0%, #2a81d7 100%);
  border: none;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(42, 129, 215, 0.25);
}

.generate-btn::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  transform: rotate(45deg);
  transition: all 0.3s ease;
  opacity: 0;
}

.generate-btn:hover {
  transform: translateY(-5px) scale(1.03);
  box-shadow: 0 15px 30px rgba(42, 129, 215, 0.3);
}

.generate-btn:hover::after {
  animation: button-shimmer 1.5s infinite;
  opacity: 1;
}

@keyframes button-shimmer {
  0% {
    transform: translate(-50%, -50%) rotate(45deg);
  }
  100% {
    transform: translate(50%, 50%) rotate(45deg);
  }
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
  height: 12px;
  border-radius: 6px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
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
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  border: 1px solid rgba(230, 230, 230, 0.5);
  backdrop-filter: blur(5px);
}

.meal-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
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
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  transition: all 0.3s ease;
  border: 1px solid rgba(240, 240, 240, 0.8);
}

.dish-item:hover {
  transform: translateX(8px);
  background-color: white;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  border-color: rgba(220, 220, 220, 0.8);
}

.dish-icon-wrapper {
  width: 50px;
  height: 50px;
  border-radius: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transform: rotate(-5deg);
  transition: all 0.3s ease;
}

.dish-item:hover .dish-icon-wrapper {
  transform: rotate(0) scale(1.1);
}

.dish-icon {
  font-size: 28px;
  filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.2));
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

.nutrition-trend-container, .nutrition-impact-container {
  margin-top: 20px;
  padding: 15px;
  background-color: #f8f9fb;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.trend-header, .impact-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.trend-info-icon {
  color: #909399;
  cursor: pointer;
  transition: color 0.3s;
}

.trend-info-icon:hover {
  color: #409EFF;
}

.trend-chart, .impact-chart {
  border-radius: 8px;
  overflow: hidden;
  background-color: white;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.05);
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

@keyframes shimmer {
  0% {
    transform: translate(-50%, -50%) rotate(45deg);
  }
  100% {
    transform: translate(50%, 50%) rotate(45deg);
  }
}

/* AI处理步骤样式 */
.ai-processing-step .step-content {
  position: relative;
  overflow: hidden;
  border-left: 3px solid #3b7cbd;
}

.ai-step-indicator {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  align-items: center;
  padding: 5px 10px;
  background-color: rgba(59, 124, 189, 0.1);
  border-radius: 20px;
  animation: pulse 2s infinite;
}

.ai-processing-dots {
  display: flex;
}

.ai-processing-dots span {
  width: 6px;
  height: 6px;
  margin: 0 2px;
  background-color: #3b7cbd;
  border-radius: 50%;
  animation: dotPulse 1.5s infinite;
}

.ai-processing-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.ai-processing-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

.ai-step-label {
  margin-left: 5px;
  font-size: 0.75rem;
  color: #3b7cbd;
  font-weight: 600;
}

.ai-step-completed {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  align-items: center;
  padding: 5px 10px;
  background-color: rgba(103, 194, 58, 0.1);
  border-radius: 20px;
}

.ai-step-icon {
  color: #67c23a;
  font-weight: bold;
}

.progress-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 0.75rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-label {
  color: #909399;
}

.stat-value {
  font-weight: 600;
  color: #3b7cbd;
}

.progress-percentage {
  text-align: center;
  font-weight: 600;
  color: #3b7cbd;
  margin-top: 5px;
  font-size: 0.9rem;
}

.data-flow-visual {
  height: 30px;
  margin-top: 10px;
  position: relative;
  overflow: hidden;
  background-color: rgba(59, 124, 189, 0.05);
  border-radius: 4px;
}

.data-flow-line {
  position: absolute;
  height: 2px;
  width: 40px;
  background: linear-gradient(90deg, rgba(59, 124, 189, 0) 0%, #3b7cbd 50%, rgba(59, 124, 189, 0) 100%);
  top: calc(50% - 1px);
  animation: dataFlow 3s infinite linear;
}

/* AI分析标识 */
.ai-analyze-badge {
  display: flex;
  align-items: center;
  padding: 5px 10px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
}

.ai-icon {
  margin-right: 5px;
}

.ai-text {
  font-size: 0.85rem;
  font-weight: 600;
}

/* 实时数据分析指示器 */
.data-analysis-indicators {
  display: flex;
  align-items: center;
}

.indicator-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #67c23a;
  margin-right: 8px;
  position: relative;
}

.indicator-dot::after {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: 50%;
  background-color: rgba(103, 194, 58, 0.4);
  animation: pulse 2s infinite;
}

.analysis-indicator-text {
  font-size: 0.8rem;
  color: #67c23a;
  font-weight: 600;
  margin-right: 10px;
}

.realtime-data-banner {
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  margin-bottom: 10px;
  font-size: 0.75rem;
  color: #606266;
}

.ai-model-info {
  font-weight: 600;
  color: #3b7cbd;
}

@keyframes dotPulse {
  0%, 100% {
    opacity: 0.4;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

@keyframes dataFlow {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(400%);
  }
}

/* 大数据处理指标和视觉元素样式 */
.data-stats-badge {
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 5px 10px;
  border-radius: 30px;
  font-size: 0.8rem;
  font-weight: 500;
}

.stats-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.stats-value {
  font-weight: 700;
  color: #fff;
}

.stats-divider {
  width: 1px;
  height: 16px;
  background-color: rgba(255, 255, 255, 0.5);
  margin: 0 8px;
}

.big-data-metrics {
  display: flex;
  justify-content: space-between;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.data-metric {
  text-align: center;
  padding: 0 15px;
}

.metric-icon {
  font-size: 1.5rem;
  margin-bottom: 8px;
}

.metric-value {
  font-size: 1.2rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 5px;
}

.metric-label {
  font-size: 0.8rem;
  color: #718096;
}

.data-source-list {
  margin-bottom: 20px;
  background-color: #f8fafc;
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.source-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e2e8f0;
  font-weight: 600;
  color: #4a5568;
}

.source-items {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 10px;
}

.source-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.source-name {
  font-weight: 500;
  color: #2d3748;
}

.source-records {
  margin-left: 8px;
  font-size: 0.75rem;
  color: #718096;
  font-weight: 400;
}

.source-status {
  display: flex;
  align-items: center;
  gap: 5px;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-indicator.active {
  background-color: #68d391;
  box-shadow: 0 0 0 2px rgba(104, 211, 145, 0.3);
  animation: pulse 2s infinite;
}

.status-indicator.connecting {
  background-color: #f6ad55;
}

.status-text {
  font-size: 0.75rem;
  color: #718096;
}

.big-data-indicators {
  margin: 10px 0;
  display: flex;
  justify-content: space-between;
}

.data-processing-visual {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  max-width: 60%;
}

.data-node {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  background-color: #e2e8f0;
  transition: all 0.3s ease;
}

.data-node.node-active {
  background-color: #4299e1;
  transform: scale(1.1);
  animation: nodePulse 1.5s infinite;
}

.data-metrics {
  font-size: 0.75rem;
}

.metric-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.big-data-visual {
  margin-top: 12px;
  padding: 10px;
  background-color: rgba(66, 153, 225, 0.05);
  border-radius: 8px;
}

.data-container {
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
  margin-bottom: 8px;
}

.data-block {
  width: 10px;
  height: 10px;
  background-color: #e2e8f0;
  border-radius: 2px;
  transition: background-color 0.5s ease;
}

.data-block.block-processed {
  background-color: #4299e1;
}

.processing-stats {
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
  font-size: 0.75rem;
}

.stat {
  text-align: center;
}

.stat-name {
  color: #718096;
  margin-bottom: 3px;
}

.stat-value {
  font-weight: 600;
  color: #2d3748;
}

@keyframes nodePulse {
  0%, 100% {
    opacity: 0.7;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}
</style>