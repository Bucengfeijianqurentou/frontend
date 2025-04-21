<template>
  <div class="p-4">
    <el-card class="w-full shadow-md">
      <template #header>
        <div class="flex items-center">
          <el-icon class="mr-2 text-blue-500"><DataLine /></el-icon>
          <span class="text-xl font-medium">数据分析</span>
        </div>
      </template>
      
      <!-- 统计卡片区域 -->
      <div class="mb-8">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="6" v-for="(card, index) in statCards" :key="index">
            <el-card shadow="hover" class="stat-card mb-4">
              <div class="flex items-center">
                <el-icon :class="['text-2xl mr-4', card.iconColor]">
                  <component :is="card.icon"></component>
                </el-icon>
                <div>
                  <div class="text-sm text-gray-500">{{ card.title }}</div>
                  <div class="text-2xl font-bold mt-1">{{ card.value }}</div>
                  <div class="text-xs mt-2" :class="card.trend > 0 ? 'text-green-500' : 'text-red-500'">
                    <el-icon class="mr-1">
                      <component :is="card.trend > 0 ? 'ArrowUp' : 'ArrowDown'"></component>
                    </el-icon>
                    {{ Math.abs(card.trend) }}% 较上月
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
      
      <!-- 食品安全趋势 -->
      <div class="mb-8">
        <h3 class="text-lg font-medium mb-4 flex items-center">
          <el-icon class="mr-2 text-blue-500"><TrendCharts /></el-icon>
          <span>食品安全趋势分析</span>
        </h3>
        
        <el-row :gutter="20">
          <el-col :xs="24" :lg="12" class="mb-4">
            <el-card shadow="hover" class="chart-card">
              <div class="chart-title flex justify-between items-center mb-2">
                <span>食品安全检查合格率趋势</span>
                <el-tag size="small" type="info">近12个月</el-tag>
              </div>
              <div ref="safetyRateChartRef" style="height: 300px;"></div>
            </el-card>
          </el-col>
          
          <el-col :xs="24" :lg="12" class="mb-4">
            <el-card shadow="hover" class="chart-card">
              <div class="chart-title flex justify-between items-center mb-2">
                <span>食品问题类型分布</span>
                <el-tag size="small" type="info">本学期</el-tag>
              </div>
              <div ref="foodIssueChartRef" style="height: 300px;"></div>
            </el-card>
          </el-col>
        </el-row>
      </div>
      
      <!-- 菜品营养分析 -->
      <div class="mb-8">
        <h3 class="text-lg font-medium mb-4 flex items-center">
          <el-icon class="mr-2 text-blue-500"><KnifeFork /></el-icon>
          <span>菜品营养分析</span>
        </h3>
        
        <el-row :gutter="20">
          <el-col :xs="24" :lg="12" class="mb-4">
            <el-card shadow="hover" class="chart-card">
              <div class="chart-title flex justify-between items-center mb-2">
                <span>食堂菜品营养成分平衡度</span>
                <div>
                  <el-select v-model="selectedGrade" placeholder="年级" size="small" class="mr-2">
                    <el-option label="一年级" value="grade1"></el-option>
                    <el-option label="二年级" value="grade2"></el-option>
                    <el-option label="三年级" value="grade3"></el-option>
                    <el-option label="四年级" value="grade4"></el-option>
                    <el-option label="五年级" value="grade5"></el-option>
                    <el-option label="六年级" value="grade6"></el-option>
                  </el-select>
                </div>
              </div>
              <div ref="nutritionChartRef" style="height: 300px;"></div>
            </el-card>
          </el-col>
          
          <el-col :xs="24" :lg="12" class="mb-4">
            <el-card shadow="hover" class="chart-card">
              <div class="chart-title flex justify-between items-center mb-2">
                <span>菜品受欢迎度排行</span>
                <el-tag size="small" type="info">本月</el-tag>
              </div>
              <div ref="popularityChartRef" style="height: 300px;"></div>
            </el-card>
          </el-col>
        </el-row>
      </div>
      
      <!-- 食材溯源分析 -->
      <div class="mb-8">
        <h3 class="text-lg font-medium mb-4 flex items-center">
          <el-icon class="mr-2 text-blue-500"><Link /></el-icon>
          <span>食材溯源分析</span>
        </h3>
        
        <el-row :gutter="20">
          <el-col :xs="24" :lg="12" class="mb-4">
            <el-card shadow="hover" class="chart-card">
              <div class="chart-title flex justify-between items-center mb-2">
                <span>食材来源分布</span>
                <el-tag size="small" type="info">本学期</el-tag>
              </div>
              <div ref="sourceChartRef" style="height: 300px;"></div>
            </el-card>
          </el-col>
          
          <el-col :xs="24" :lg="12" class="mb-4">
            <el-card shadow="hover" class="chart-card">
              <div class="chart-title flex justify-between items-center mb-2">
                <span>月度食材采购量趋势</span>
                <el-tag size="small" type="info">近6个月</el-tag>
              </div>
              <div ref="purchaseChartRef" style="height: 300px;"></div>
            </el-card>
          </el-col>
        </el-row>
      </div>
      
      <!-- 数据报表导出 -->
      <div>
        <h3 class="text-lg font-medium mb-4 flex items-center">
          <el-icon class="mr-2 text-blue-500"><Document /></el-icon>
          <span>数据报表导出</span>
        </h3>
        
        <el-card shadow="hover" class="p-4">
          <el-form :model="reportForm" label-width="120px" label-position="left">
            <el-row :gutter="20">
              <el-col :xs="24" :md="12">
                <el-form-item label="报表类型">
                  <el-select v-model="reportForm.type" placeholder="请选择报表类型" class="w-full">
                    <el-option label="食品安全检查报告" value="safety"></el-option>
                    <el-option label="营养餐分析报告" value="nutrition"></el-option>
                    <el-option label="食材采购报告" value="purchase"></el-option>
                    <el-option label="综合数据报告" value="comprehensive"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              
              <el-col :xs="24" :md="12">
                <el-form-item label="时间范围">
                  <el-date-picker
                    v-model="reportForm.dateRange"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    format="YYYY-MM-DD"
                    class="w-full"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              
              <el-col :xs="24" :md="12">
                <el-form-item label="数据粒度">
                  <el-radio-group v-model="reportForm.granularity">
                    <el-radio :value="'day'" label="按日"></el-radio>
                    <el-radio :value="'week'" label="按周"></el-radio>
                    <el-radio :value="'month'" label="按月"></el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              
              <el-col :xs="24" :md="12">
                <el-form-item label="报表格式">
                  <el-radio-group v-model="reportForm.format">
                    <el-radio :value="'excel'" label="Excel"></el-radio>
                    <el-radio :value="'pdf'" label="PDF"></el-radio>
                    <el-radio :value="'csv'" label="CSV"></el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            
            <div class="flex justify-center mt-4">
              <el-button type="primary" @click="generateReport" class="mr-4" :loading="generating">
                生成报表
              </el-button>
              <el-button @click="resetReportForm">重置</el-button>
            </div>
          </el-form>
        </el-card>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { 
  DataLine, TrendCharts, KnifeFork, Link, Document,
  More, Menu, Goods, School, ShoppingCart, Chicken,
  User, ArrowDown, ArrowUp, Setting, List, View
} from '@element-plus/icons-vue'
import * as echarts from 'echarts/core'
import { BarChart, LineChart, PieChart, RadarChart } from 'echarts/charts'
import { 
  TitleComponent, 
  TooltipComponent, 
  GridComponent, 
  LegendComponent,
  ToolboxComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

// 注册必要的组件
echarts.use([
  TitleComponent, 
  TooltipComponent, 
  GridComponent, 
  LegendComponent,
  ToolboxComponent,
  BarChart,
  LineChart,
  PieChart,
  RadarChart,
  CanvasRenderer
])

// 统计卡片数据
const statCards = reactive([
  {
    title: '当日供餐量',
    value: '1,235',
    icon: 'KnifeFork',
    iconColor: 'text-blue-500',
    trend: 5.2
  },
  {
    title: '食材采购批次',
    value: '127',
    icon: 'ShoppingCart',
    iconColor: 'text-green-500',
    trend: 3.8
  },
  {
    title: '安全检查次数',
    value: '86',
    icon: 'List',
    iconColor: 'text-orange-500',
    trend: 7.5
  },
  {
    title: '菜品种类数',
    value: '42',
    icon: 'Chicken',
    iconColor: 'text-purple-500',
    trend: -2.3
  }
])

// 图表引用
const safetyRateChartRef = ref(null)
const foodIssueChartRef = ref(null)
const nutritionChartRef = ref(null)
const popularityChartRef = ref(null)
const sourceChartRef = ref(null)
const purchaseChartRef = ref(null)

// 图表实例
let safetyRateChart = null
let foodIssueChart = null
let nutritionChart = null
let popularityChart = null
let sourceChart = null
let purchaseChart = null

// 选择的年级
const selectedGrade = ref('grade3')

// 报表表单
const reportForm = reactive({
  type: 'safety',
  dateRange: [new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000), new Date()],
  granularity: 'day',
  format: 'excel'
})

// 是否正在生成报表
const generating = ref(false)

// 监听年级变化，更新营养图表
watch(selectedGrade, () => {
  initNutritionChart()
})

// 初始化图表
onMounted(() => {
  initCharts()
  window.addEventListener('resize', handleResize)
})

// 组件销毁前清理
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  disposeCharts()
})

// 调整大小处理
function handleResize() {
  safetyRateChart?.resize()
  foodIssueChart?.resize()
  nutritionChart?.resize()
  popularityChart?.resize()
  sourceChart?.resize()
  purchaseChart?.resize()
}

// 销毁图表实例
function disposeCharts() {
  safetyRateChart?.dispose()
  foodIssueChart?.dispose()
  nutritionChart?.dispose()
  popularityChart?.dispose()
  sourceChart?.dispose()
  purchaseChart?.dispose()
  
  safetyRateChart = null
  foodIssueChart = null
  nutritionChart = null
  popularityChart = null
  sourceChart = null
  purchaseChart = null
}

// 初始化所有图表
function initCharts() {
  initSafetyRateChart()
  initFoodIssueChart()
  initNutritionChart()
  initPopularityChart()
  initSourceChart()
  initPurchaseChart()
}

// 初始化食品安全检查合格率趋势图表
function initSafetyRateChart() {
  if (safetyRateChartRef.value) {
    safetyRateChart = echarts.init(safetyRateChartRef.value)
    
    // 生成月份数据
    const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
    // 生成合格率数据，模拟逐渐提高的趋势
    const passRates = [85.2, 86.5, 88.4, 87.9, 90.3, 91.6, 93.2, 94.1, 95.7, 96.8, 97.3, 98.5]
    
    safetyRateChart.setOption({
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: months
      },
      yAxis: {
        type: 'value',
        min: 80,
        max: 100,
        axisLabel: {
          formatter: '{value}%'
        }
      },
      series: [
        {
          name: '合格率',
          type: 'line',
          smooth: true,
          lineStyle: {
            color: '#67C23A',
            width: 3
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: 'rgba(103, 194, 58, 0.5)'
              }, {
                offset: 1, color: 'rgba(103, 194, 58, 0.05)'
              }]
            }
          },
          emphasis: {
            focus: 'series'
          },
          data: passRates
        }
      ]
    })
  }
}

// 初始化食品问题类型分布图表
function initFoodIssueChart() {
  if (foodIssueChartRef.value) {
    foodIssueChart = echarts.init(foodIssueChartRef.value)
    
    foodIssueChart.setOption({
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 10,
        data: ['储存条件不达标', '食材新鲜度问题', '加工不规范', '餐具消毒不足', '标签信息不完整']
      },
      series: [
        {
          name: '问题分布',
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
              fontSize: '14',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            { value: 35, name: '储存条件不达标' },
            { value: 28, name: '食材新鲜度问题' },
            { value: 16, name: '加工不规范' },
            { value: 12, name: '餐具消毒不足' },
            { value: 9, name: '标签信息不完整' }
          ]
        }
      ]
    })
  }
}

// 初始化营养分析雷达图
function initNutritionChart() {
  if (nutritionChartRef.value) {
    if (nutritionChart) {
      nutritionChart.dispose()
    }
    nutritionChart = echarts.init(nutritionChartRef.value)
    
    // 基于所选年级提供不同的数据
    let nutritionData
    
    switch(selectedGrade.value) {
      case 'grade1':
        nutritionData = [85, 65, 90, 78, 82]
        break
      case 'grade2':
        nutritionData = [88, 70, 85, 80, 85]
        break
      case 'grade3':
        nutritionData = [90, 75, 83, 85, 88]
        break
      case 'grade4':
        nutritionData = [92, 80, 80, 88, 90]
        break
      case 'grade5':
        nutritionData = [95, 85, 78, 90, 92]
        break
      case 'grade6':
        nutritionData = [98, 90, 75, 93, 95]
        break
      default:
        nutritionData = [90, 75, 83, 85, 88]
    }
    
    // 获取年级名称
    const gradeName = selectedGrade.value.replace('grade', '') + '年级'
    
    nutritionChart.setOption({
      tooltip: {
        trigger: 'axis'
      },
      radar: {
        indicator: [
          { name: '蛋白质', max: 100 },
          { name: '碳水化合物', max: 100 },
          { name: '膳食纤维', max: 100 },
          { name: '维生素', max: 100 },
          { name: '矿物质', max: 100 }
        ],
        radius: 120,
        splitNumber: 5,
        axisName: {
          color: '#333'
        },
        splitLine: {
          lineStyle: {
            color: ['#ddd', '#ccc', '#bbb', '#aaa', '#999']
          }
        },
        splitArea: {
          show: true,
          areaStyle: {
            color: ['rgba(250,250,250,0.3)', 'rgba(200,200,200,0.3)']
          }
        }
      },
      series: [
        {
          name: '营养平衡度',
          type: 'radar',
          areaStyle: {
            color: 'rgba(64, 158, 255, 0.6)'
          },
          lineStyle: {
            color: '#409EFF',
            width: 2
          },
          data: [
            {
              value: nutritionData,
              name: gradeName + '餐食',
              symbolSize: 6,
              symbol: 'circle',
              itemStyle: {
                color: '#409EFF'
              }
            }
          ]
        }
      ]
    })
  }
}

// 初始化菜品受欢迎度排行图表
function initPopularityChart() {
  if (popularityChartRef.value) {
    popularityChart = echarts.init(popularityChartRef.value)
    
    popularityChart.setOption({
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
        axisLabel: {
          formatter: '{value}%'
        }
      },
      yAxis: {
        type: 'category',
        data: ['红烧排骨', '清蒸鲈鱼', '番茄炒蛋', '糖醋里脊', '宫保鸡丁', '蔬菜沙拉', '紫菜蛋花汤', '水果拼盘']
      },
      series: [
        {
          name: '喜爱度',
          type: 'bar',
          data: [98, 96, 92, 89, 85, 82, 78, 75],
          itemStyle: {
            color: function(params) {
              // 颜色数组
              var colorList = [
                '#f56c6c', '#e6a23c', '#f56c6c', '#67c23a',
                '#409eff', '#b88230', '#9b55ff', '#19be6b'
              ];
              return colorList[params.dataIndex];
            }
          }
        }
      ]
    })
  }
}

// 初始化食材来源分布图表
function initSourceChart() {
  if (sourceChartRef.value) {
    sourceChart = echarts.init(sourceChartRef.value)
    
    sourceChart.setOption({
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        right: 10,
        top: 'center',
        data: ['本地农产品', '有机农场', '专业合作社', '大型批发市场', '连锁超市']
      },
      series: [
        {
          name: '来源分布',
          type: 'pie',
          radius: '60%',
          center: ['40%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: true,
            formatter: '{b}: {d}%'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '14',
              fontWeight: 'bold'
            }
          },
          data: [
            { value: 45, name: '本地农产品' },
            { value: 25, name: '有机农场' },
            { value: 15, name: '专业合作社' },
            { value: 10, name: '大型批发市场' },
            { value: 5, name: '连锁超市' }
          ]
        }
      ]
    })
  }
}

// 初始化月度食材采购量趋势图表
function initPurchaseChart() {
  if (purchaseChartRef.value) {
    purchaseChart = echarts.init(purchaseChartRef.value)
    
    purchaseChart.setOption({
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['蔬菜', '肉类', '水产', '米面', '调味品']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['1月', '2月', '3月', '4月', '5月', '6月']
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value} kg'
        }
      },
      series: [
        {
          name: '蔬菜',
          type: 'line',
          stack: 'Total',
          smooth: true,
          data: [1200, 850, 1100, 1300, 1400, 1320]
        },
        {
          name: '肉类',
          type: 'line',
          stack: 'Total',
          smooth: true,
          data: [580, 420, 560, 590, 610, 595]
        },
        {
          name: '水产',
          type: 'line',
          stack: 'Total',
          smooth: true,
          data: [280, 180, 250, 310, 325, 295]
        },
        {
          name: '米面',
          type: 'line',
          stack: 'Total',
          smooth: true,
          data: [750, 520, 700, 780, 820, 790]
        },
        {
          name: '调味品',
          type: 'line',
          stack: 'Total',
          smooth: true,
          data: [125, 85, 120, 135, 140, 130]
        }
      ]
    })
  }
}

// 生成报表
function generateReport() {
  generating.value = true
  
  setTimeout(() => {
    generating.value = false
    ElMessage.success('报表生成成功，请在消息中心查看下载链接')
  }, 2000)
}

// 重置报表表单
function resetReportForm() {
  reportForm.type = 'safety'
  reportForm.dateRange = [new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000), new Date()]
  reportForm.granularity = 'day'
  reportForm.format = 'excel'
}
</script>

<style scoped>
.stat-card {
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.chart-card {
  transition: all 0.3s;
}

.chart-card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.chart-title {
  color: #606266;
  font-size: 14px;
  font-weight: 500;
  padding-bottom: 8px;
  border-bottom: 1px solid #ebeef5;
}
</style> 