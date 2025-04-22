<template>
  <div class="datascreen-container" ref="fullScreenRef">
    <div class="header">
      <div class="title">区块链食堂监管平台数据大屏</div>
      <div class="datetime">{{ currentDate }} {{ currentTime }}</div>
      <div class="weather">
      </div>
    </div>

    <div class="content">
      <div class="left-panel">
        <div class="panel-item">
          <div class="panel-header">
            <el-icon><PieChartIcon /></el-icon>
            <span>食品安全指数</span>
          </div>
          <div class="panel-content" ref="safetyIndexChart"></div>
        </div>
        <div class="panel-item">
          <div class="panel-header">
            <el-icon><TrendCharts /></el-icon>
            <span>进货量趋势</span>
          </div>
          <div class="panel-content" ref="purchaseTrendChart"></div>
        </div>
        <div class="panel-item">
          <div class="panel-header">
            <el-icon><DataAnalysis /></el-icon>
            <span>餐次供应情况</span>
          </div>
          <div class="panel-content" ref="mealSupplyChart"></div>
        </div>
      </div>

      <div class="center-panel">
        <div class="panel-item main-monitor">
          <div class="panel-header">
            <el-icon><VideoCamera /></el-icon>
            <span>实时监控</span>
          </div>
          <div class="panel-content monitor-content">
            <div class="video-overlay">
              <div class="camera-info">
                <span class="camera-name">{{ currentMonitorArea }}</span>
                <span class="timestamp">{{ currentTime }}</span>
              </div>
            </div>
            <video ref="mainVideoRef" autoplay class="main-video"></video>
            <div class="monitor-controls">
              <el-radio-group v-model="currentArea" @change="changeArea" size="small">
                <el-radio-button v-for="area in monitoringAreas" :key="area.value" :value="area.value">
                  {{ area.label }}
                </el-radio-button>
              </el-radio-group>
            </div>
          </div>
        </div>

        <div class="blockchain-info">
          <div class="blockchain-item">
            <el-icon><Connection /></el-icon>
            <div class="info-content">
              <div class="info-label">
                <span>区块高度</span>
                <span class="block-hash">#{{ displayBlockNumber.toString(16).padStart(8, '0') }}</span>
              </div>
              <div class="info-value count-animation">{{ displayBlockNumber }}</div>
            </div>
            <div class="blockchain-pulse"></div>
          </div>
          <div class="blockchain-item">
            <el-icon><Histogram /></el-icon>
            <div class="info-content">
              <div class="info-label">
                <span>交易总数</span>
                <span class="tx-indicator" :class="{'active': txIndicator}"></span>
              </div>
              <div class="info-value count-animation">{{ displayTransactionTotal }}</div>
            </div>
            <div class="blockchain-pulse"></div>
          </div>
        </div>

        <div class="staff-carousel">
          <div class="panel-header">
            <el-icon><User /></el-icon>
            <span>员工信息</span>
          </div>
          <el-carousel :interval="5000" arrow="never" indicator-position="none" height="120px">
            <el-carousel-item v-for="group in staffGroups" :key="group[0].id">
              <div class="staff-group">
                <div class="staff-card" v-for="staff in group" :key="staff.id">
                  <el-avatar icon="UserFilled" size="small"></el-avatar>
                  <div class="staff-info">
                    <div class="staff-name">{{ staff.realName || staff.username }}</div>
                    <el-tag size="small" type="success">健康状态: 健康</el-tag>
                  </div>
                </div>
              </div>
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>

      <div class="right-panel">
        <div class="panel-item">
          <div class="panel-header">
            <el-icon><PieChartIcon /></el-icon>
            <span>库存分布</span>
          </div>
          <div class="panel-content" ref="inventoryDistributionChart"></div>
        </div>
        <div class="panel-item">
          <div class="panel-header">
            <el-icon><Operation /></el-icon>
            <span>食品加工统计</span>
          </div>
          <div class="panel-content" ref="processingStatChart"></div>
        </div>
        <div class="panel-item">
          <div class="panel-header">
            <el-icon><Document /></el-icon>
            <span>监察检查结果</span>
          </div>
          <div class="panel-content" ref="inspectionResultChart"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, computed, nextTick } from 'vue'
import { useFullscreen } from '@vueuse/core'
import * as echarts from 'echarts/core'
import {
  LineChart, PieChart, BarChart, GaugeChart, RadarChart
} from 'echarts/charts'
import {
  TitleComponent, TooltipComponent, LegendComponent, GridComponent,
  DatasetComponent, TransformComponent, ToolboxComponent
} from 'echarts/components'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import { getBlockNumber, getTransactionTotal, getAllStaff } from '@/api/chain'
import { 
  Sunny, VideoCamera, Connection, Histogram, User, 
  PieChart as PieChartIcon, TrendCharts, DataAnalysis, Document, Operation 
} from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

// 注册必需的 echarts 组件
echarts.use([
  TitleComponent, TooltipComponent, LegendComponent, GridComponent,
  DatasetComponent, TransformComponent, ToolboxComponent,
  LabelLayout, UniversalTransition,
  LineChart, PieChart, BarChart, GaugeChart, RadarChart,
  CanvasRenderer
])

// 当前时间状态
const currentDate = ref('')
const currentTime = ref('')

// 区块链数据
const blockNumber = ref(0)
const transactionTotal = ref(0)
const displayBlockNumber = ref(0)
const displayTransactionTotal = ref(0)
const txIndicator = ref(false)

// 监控相关
const mainVideoRef = ref(null)
const currentArea = ref('main')
const currentMonitorArea = computed(() => {
  const area = monitoringAreas.find(a => a.value === currentArea.value)
  return area ? area.label : ''
})

// 监控区域
const monitoringAreas = [
  { label: '餐厅主区域', value: 'main' },
  { label: '食品加工区', value: 'processing' },
  { label: '食材储存区', value: 'storage' },
  { label: '就餐区域', value: 'dining' }
]

// 员工数据
const staffList = ref([])
const staffGroups = computed(() => {
  const groups = []
  for (let i = 0; i < staffList.value.length; i += 4) {
    groups.push(staffList.value.slice(i, i + 4))
  }
  return groups
})

// 图表引用
const safetyIndexChart = ref(null)
const purchaseTrendChart = ref(null)
const mealSupplyChart = ref(null)
const inventoryDistributionChart = ref(null)
const processingStatChart = ref(null)
const inspectionResultChart = ref(null)

// 全屏
const fullScreenRef = ref(null)
const { toggle: toggleFullScreen } = useFullscreen(fullScreenRef)

// WebRTC实例
let webRtcServer = null

// 更新时间
function updateTime() {
  const now = new Date()
  currentDate.value = now.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'long' })
  currentTime.value = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

// 连接视频流
function connectMonitorStream() {
  if (!mainVideoRef.value) return
  
  // 这里假设WebRtcStreamer类已经在另一个位置定义
  try {
    if (webRtcServer) {
      webRtcServer.disconnect()
    }
    
    // 使用与监控页面相同的WebRTC实现方式
    webRtcServer = new WebRtcStreamer(mainVideoRef.value, 'http://localhost:8000')
    webRtcServer.connect('rtsp://admin:123456@192.168.62.104:554/cam/realmonitor?channel=1&subtype=0')
  } catch (error) {
    console.error('连接监控视频流失败:', error)
  }
}

// 切换监控区域
function changeArea(area) {
  currentArea.value = area
  connectMonitorStream()
}

// 初始化安全指数图表
function initSafetyIndexChart() {
  if (!safetyIndexChart.value) return
  
  const chart = echarts.init(safetyIndexChart.value)
  const option = {
    series: [{
      type: 'gauge',
      startAngle: 180,
      endAngle: 0,
      center: ['50%', '75%'],
      radius: '90%',
      min: 0,
      max: 100,
      splitNumber: 10,
      axisLine: {
        lineStyle: {
          width: 6,
          color: [
            [0.3, '#FF6E76'],
            [0.7, '#FDDD60'],
            [1, '#7CFFB2']
          ]
        }
      },
      pointer: {
        icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
        length: '12%',
        width: 20,
        offsetCenter: [0, '-60%'],
        itemStyle: {
          color: 'inherit'
        }
      },
      axisTick: {
        length: 12,
        lineStyle: {
          color: 'inherit',
          width: 2
        }
      },
      splitLine: {
        length: 20,
        lineStyle: {
          color: 'inherit',
          width: 5
        }
      },
      axisLabel: {
        color: '#464646',
        fontSize: 20,
        distance: -60,
        formatter: function (value) {
          if (value === 0 || value === 100) {
            return value
          }
          return ''
        }
      },
      title: {
        offsetCenter: [0, '-20%'],
        fontSize: 20
      },
      detail: {
        fontSize: 30,
        offsetCenter: [0, '0%'],
        valueAnimation: true,
        formatter: function (value) {
          return Math.round(value) + '分'
        },
        color: 'inherit'
      },
      data: [{
        value: 92,
        name: '安全指数'
      }]
    }]
  }
  
  chart.setOption(option)
  window.addEventListener('resize', () => chart.resize())
}

// 初始化进货量趋势图表
function initPurchaseTrendChart() {
  if (!purchaseTrendChart.value) return
  
  const chart = echarts.init(purchaseTrendChart.value)
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      axisLabel: {
        color: '#eee'
      },
      axisLine: {
        lineStyle: {
          color: '#eee'
        }
      }
    },
    yAxis: {
      type: 'value',
      name: '数量(kg)',
      nameTextStyle: {
        color: '#eee'
      },
      axisLabel: {
        color: '#eee'
      },
      axisLine: {
        lineStyle: {
          color: '#eee'
        }
      }
    },
    series: [
      {
        name: '蔬菜',
        type: 'line',
        smooth: true,
        data: [120, 132, 101, 134, 90, 30, 85],
        itemStyle: {
          color: '#80FFA5'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(128, 255, 165, 0.7)' },
              { offset: 1, color: 'rgba(128, 255, 165, 0.1)' }
            ],
          }
        }
      },
      {
        name: '肉类',
        type: 'line',
        smooth: true,
        data: [50, 62, 40, 44, 55, 25, 30],
        itemStyle: {
          color: '#FFDD6F'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(255, 221, 111, 0.7)' },
              { offset: 1, color: 'rgba(255, 221, 111, 0.1)' }
            ],
          }
        }
      }
    ]
  }
  
  chart.setOption(option)
  window.addEventListener('resize', () => chart.resize())
}

// 初始化餐次供应图表
function initMealSupplyChart() {
  if (!mealSupplyChart.value) return
  
  const chart = echarts.init(mealSupplyChart.value)
  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: 'bottom',
      left: 'center',
      textStyle: {
        color: '#eee'
      }
    },
    series: [
      {
        name: '餐次供应',
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
            fontSize: '20',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 2380, name: '早餐' },
          { value: 3800, name: '午餐' },
          { value: 3200, name: '晚餐' }
        ]
      }
    ]
  }
  
  chart.setOption(option)
  window.addEventListener('resize', () => chart.resize())
}

// 初始化库存分布图表
function initInventoryDistributionChart() {
  if (!inventoryDistributionChart.value) return
  
  const chart = echarts.init(inventoryDistributionChart.value)
  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: 'bottom',
      left: 'center',
      textStyle: {
        color: '#eee'
      }
    },
    series: [
      {
        name: '库存占比',
        type: 'pie',
        radius: '55%',
        center: ['50%', '45%'],
        data: [
          { value: 35, name: '蔬菜' },
          { value: 20, name: '肉类' },
          { value: 15, name: '调味品' },
          { value: 15, name: '米面' },
          { value: 15, name: '其他' }
        ],
        roseType: 'radius',
        itemStyle: {
          borderRadius: 8
        }
      }
    ]
  }
  
  chart.setOption(option)
  window.addEventListener('resize', () => chart.resize())
}

// 初始化食品加工统计图表
function initProcessingStatChart() {
  if (!processingStatChart.value) return
  
  const chart = echarts.init(processingStatChart.value)
  const option = {
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
      boundaryGap: [0, 0.01],
      axisLabel: {
        color: '#eee'
      },
      axisLine: {
        lineStyle: {
          color: '#eee'
        }
      }
    },
    yAxis: {
      type: 'category',
      data: ['炒菜', '蒸煮', '烹饪', '烧烤', '凉拌'],
      axisLabel: {
        color: '#eee'
      },
      axisLine: {
        lineStyle: {
          color: '#eee'
        }
      }
    },
    series: [
      {
        name: '数量',
        type: 'bar',
        data: [200, 150, 100, 50, 80],
        itemStyle: {
          color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
            { offset: 0, color: '#3aa0ff' },
            { offset: 1, color: '#5b87f7' }
          ])
        }
      }
    ]
  }
  
  chart.setOption(option)
  window.addEventListener('resize', () => chart.resize())
}

// 初始化监察检查结果图表
function initInspectionResultChart() {
  if (!inspectionResultChart.value) return
  
  const chart = echarts.init(inspectionResultChart.value)
  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      bottom: 'bottom',
      textStyle: {
        color: '#eee'
      }
    },
    series: [
      {
        name: '监察检查',
        type: 'pie',
        radius: '50%',
        data: [
          { value: 85, name: '正常' },
          { value: 10, name: '轻微问题' },
          { value: 5, name: '严重问题' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
  
  chart.setOption(option)
  window.addEventListener('resize', () => chart.resize())
}

// 获取区块链数据
async function fetchBlockchainData() {
  try {
    const [blockNumberRes, transactionTotalRes] = await Promise.all([
      getBlockNumber(),
      getTransactionTotal()
    ])
    
    blockNumber.value = blockNumberRes
    transactionTotal.value = transactionTotalRes
    
    // 添加数字递增动画效果
    animateBlockchainNumbers(blockNumberRes, transactionTotalRes)
  } catch (error) {
    console.error('获取区块链数据失败:', error)
  }
}

// 数字递增动画效果
function animateBlockchainNumbers(targetBlockNumber, targetTransactionTotal) {
  // 先设置为0，然后慢慢递增到目标值
  displayBlockNumber.value = 0
  displayTransactionTotal.value = 0
  
  const duration = 2000 // 动画持续时间(ms)
  const frames = 60 // 总帧数
  const blockStep = Math.ceil(targetBlockNumber / frames)
  const transactionStep = Math.ceil(targetTransactionTotal / frames)
  
  let currentFrame = 0
  
  const animateFrame = () => {
    currentFrame++
    
    if (displayBlockNumber.value < targetBlockNumber) {
      displayBlockNumber.value = Math.min(
        displayBlockNumber.value + blockStep, 
        targetBlockNumber
      )
    }
    
    if (displayTransactionTotal.value < targetTransactionTotal) {
      displayTransactionTotal.value = Math.min(
        displayTransactionTotal.value + transactionStep,
        targetTransactionTotal
      )
    }
    
    if (currentFrame < frames && 
       (displayBlockNumber.value < targetBlockNumber || 
        displayTransactionTotal.value < targetTransactionTotal)) {
      setTimeout(animateFrame, duration / frames)
    }
  }
  
  // 开始动画
  animateFrame()
}

// 获取员工数据
async function fetchStaffData() {
  try {
    const response = await getAllStaff()
    staffList.value = response.records || []
  } catch (error) {
    console.error('获取员工数据失败:', error)
    staffList.value = []
  }
}

// 定时器
let timeInterval = null
let dataInterval = null
let blockchainDataUpdateInterval = null

onMounted(() => {
  // 更新时间
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
  
  // 获取数据
  fetchBlockchainData()
  fetchStaffData()
  dataInterval = setInterval(() => {
    fetchBlockchainData()
  }, 60000)
  
  // 模拟区块链数据微小变化，增强动态效果
  blockchainDataUpdateInterval = setInterval(() => {
    // 随机决定是否增加区块高度(10%概率)
    if (Math.random() < 0.1) {
      const newBlockNumber = blockNumber.value + 1
      // 直接赋值，不使用动画
      blockNumber.value = newBlockNumber
      displayBlockNumber.value = newBlockNumber
    }
    
    // 随机增加交易数量(30%概率)
    if (Math.random() < 0.3) {
      const increment = Math.floor(Math.random() * 5) + 1
      const newTransactionTotal = transactionTotal.value + increment
      // 直接赋值，不使用动画
      transactionTotal.value = newTransactionTotal
      displayTransactionTotal.value = newTransactionTotal
      
      // 触发交易指示器闪烁
      txIndicator.value = true
      setTimeout(() => {
        txIndicator.value = false
      }, 1000)
    }
  }, 5000)
  
  // 连接监控流
  connectMonitorStream()
  
  // 初始化图表
  nextTick(() => {
    initSafetyIndexChart()
    initPurchaseTrendChart()
    initMealSupplyChart()
    initInventoryDistributionChart()
    initProcessingStatChart()
    initInspectionResultChart()
  })
  
  // 自动全屏展示
  setTimeout(() => {
    toggleFullScreen()
  }, 1000)
})

onUnmounted(() => {
  if (timeInterval) clearInterval(timeInterval)
  if (dataInterval) clearInterval(dataInterval)
  if (blockchainDataUpdateInterval) clearInterval(blockchainDataUpdateInterval)
  
  if (webRtcServer) {
    webRtcServer.disconnect()
  }
})
</script>

<style scoped>
.datascreen-container {
  width: 100%;
  height: 100vh;
  background-color: #05172e;
  color: #fff;
  padding: 15px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  margin-bottom: 15px;
  padding: 0 20px;
  background: linear-gradient(to right, rgba(18, 69, 145, 0.8), rgba(18, 69, 145, 0.3));
  border-radius: 4px;
}

.title {
  font-size: 28px;
  font-weight: bold;
  background: linear-gradient(to right, #54e7ff, #ffffff);
  -webkit-background-clip: text;
  color: transparent;
  text-shadow: 0 0 10px rgba(84, 231, 255, 0.5);
}

.datetime, .weather {
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.content {
  flex: 1;
  display: flex;
  gap: 15px;
}

.left-panel, .right-panel {
  width: 25%;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.center-panel {
  width: 50%;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.panel-item {
  background-color: rgba(18, 69, 145, 0.3);
  border-radius: 4px;
  border: 1px solid rgba(84, 231, 255, 0.3);
  box-shadow: 0 0 15px rgba(18, 69, 145, 0.5);
  overflow: hidden;
  height: calc(33.33% - 10px);
}

.main-monitor {
  flex: 1;
}

.panel-header {
  background-color: rgba(18, 69, 145, 0.7);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 15px;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
}

.panel-content {
  height: calc(100% - 36px);
  padding: 5px;
}

.monitor-content {
  position: relative;
  background-color: #000;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: calc(100% - 40px);
  z-index: 10;
  pointer-events: none;
}

.camera-info {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  display: flex;
  justify-content: space-between;
  width: calc(100% - 20px);
}

.main-video {
  width: 100%;
  height: calc(100% - 40px);
  object-fit: cover;
}

.monitor-controls {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.blockchain-info {
  display: flex;
  gap: 15px;
  height: 80px;
}

.blockchain-item {
  flex: 1;
  background-color: rgba(33, 87, 168, 0.5);
  border-radius: 4px;
  display: flex;
  align-items: center;
  padding: 0 15px;
  gap: 15px;
  border: 1px solid rgba(84, 231, 255, 0.3);
  box-shadow: 0 0 15px rgba(18, 69, 145, 0.5);
  position: relative;
  overflow: hidden;
}

.blockchain-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 2px;
  background: linear-gradient(to right, transparent, #54e7ff, transparent);
  animation: scanLine 3s infinite;
}

@keyframes scanLine {
  0% {
    left: -100%;
  }
  50% {
    left: 100%;
  }
  100% {
    left: -100%;
  }
}

.blockchain-item .el-icon {
  font-size: 30px;
  color: #54e7ff;
}

.info-content {
  display: flex;
  flex-direction: column;
}

.info-label {
  font-size: 14px;
  color: #c0c4cc;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.block-hash {
  font-family: monospace;
  font-size: 12px;
  color: #76d0ff;
  background-color: rgba(0, 0, 0, 0.2);
  padding: 1px 4px;
  border-radius: 2px;
  margin-left: 8px;
}

.tx-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #505050;
  transition: all 0.3s;
  margin-left: 8px;
}

.tx-indicator.active {
  background-color: #67C23A;
  box-shadow: 0 0 10px #67C23A;
}

.info-value {
  font-size: 24px;
  font-weight: bold;
  color: #54e7ff;
}

.count-animation {
  position: relative;
  text-shadow: 0 0 10px rgba(84, 231, 255, 0.7);
  animation: pulseNumber 2s infinite;
}

@keyframes pulseNumber {
  0% {
    text-shadow: 0 0 5px rgba(84, 231, 255, 0.7);
  }
  50% {
    text-shadow: 0 0 15px rgba(84, 231, 255, 1);
  }
  100% {
    text-shadow: 0 0 5px rgba(84, 231, 255, 0.7);
  }
}

.blockchain-pulse {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #54e7ff;
  box-shadow: 0 0 15px #54e7ff;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    transform: translateY(-50%) scale(0.8);
    opacity: 0.7;
  }
  50% {
    transform: translateY(-50%) scale(1.2);
    opacity: 1;
  }
  100% {
    transform: translateY(-50%) scale(0.8);
    opacity: 0.7;
  }
}

.staff-carousel {
  height: 170px;
  background-color: rgba(18, 69, 145, 0.3);
  border-radius: 4px;
  border: 1px solid rgba(84, 231, 255, 0.3);
  box-shadow: 0 0 15px rgba(18, 69, 145, 0.5);
  overflow: hidden;
}

.staff-group {
  display: flex;
  height: 100%;
  padding: 10px;
  justify-content: space-around;
}

.staff-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background-color: rgba(33, 87, 168, 0.5);
  border-radius: 4px;
  height: fit-content;
}

.staff-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.staff-name {
  font-size: 14px;
  font-weight: bold;
}

/* 适应不同大小的显示器 */
@media screen and (max-width: 1600px) {
  .header {
    height: 50px;
  }
  
  .title {
    font-size: 24px;
  }
  
  .datetime, .weather {
    font-size: 14px;
  }
  
  .info-value {
    font-size: 20px;
  }
}

@media screen and (max-width: 1200px) {
  .blockchain-item .el-icon {
    font-size: 24px;
  }
  
  .info-label {
    font-size: 12px;
  }
  
  .info-value {
    font-size: 18px;
  }
  
  .panel-header {
    font-size: 14px;
  }
}
</style>