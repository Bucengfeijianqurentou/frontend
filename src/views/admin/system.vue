<template>
  <div class="p-4">
    <el-card class="w-full shadow-md">
      <template #header>
        <div class="flex items-center">
          <el-icon class="mr-2 text-blue-500"><Monitor /></el-icon>
          <span class="text-xl font-medium">系统监控</span>
        </div>
      </template>
      
      <!-- 服务器状态概览 -->
      <div class="mb-8">
        <h3 class="text-lg font-medium mb-4 flex items-center">
          <el-icon class="mr-2 text-blue-500"><DataBoard /></el-icon>
          <span>服务器状态概览</span>
        </h3>
        
        <el-row :gutter="20">
          <!-- CPU使用率 -->
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-card shadow="hover" class="stat-card">
              <div class="text-center mb-2">
                <span class="text-gray-600">CPU使用率</span>
              </div>
              <el-progress 
                type="dashboard" 
                :percentage="cpuUsage" 
                :color="getProgressColor(cpuUsage)"
                :stroke-width="8"
              />
              <div class="text-center mt-2">
                <span :class="getTextColor(cpuUsage)">{{ cpuUsage }}%</span>
              </div>
            </el-card>
          </el-col>
          
          <!-- 内存使用率 -->
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-card shadow="hover" class="stat-card">
              <div class="text-center mb-2">
                <span class="text-gray-600">内存使用率</span>
              </div>
              <el-progress 
                type="dashboard" 
                :percentage="memoryUsage" 
                :color="getProgressColor(memoryUsage)"
                :stroke-width="8"
              />
              <div class="text-center mt-2">
                <span :class="getTextColor(memoryUsage)">{{ memoryUsage }}%</span>
              </div>
            </el-card>
          </el-col>
          
          <!-- 磁盘使用率 -->
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-card shadow="hover" class="stat-card">
              <div class="text-center mb-2">
                <span class="text-gray-600">磁盘使用率</span>
              </div>
              <el-progress 
                type="dashboard" 
                :percentage="diskUsage" 
                :color="getProgressColor(diskUsage)"
                :stroke-width="8"
              />
              <div class="text-center mt-2">
                <span :class="getTextColor(diskUsage)">{{ diskUsage }}%</span>
              </div>
            </el-card>
          </el-col>
          
          <!-- 网络带宽 -->
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-card shadow="hover" class="stat-card">
              <div class="text-center mb-2">
                <span class="text-gray-600">网络带宽</span>
              </div>
              <el-progress 
                type="dashboard" 
                :percentage="networkUsage" 
                :color="getProgressColor(networkUsage)"
                :stroke-width="8"
              />
              <div class="text-center mt-2">
                <span :class="getTextColor(networkUsage)">{{ networkUsage }}%</span>
                <span class="text-xs text-gray-500 ml-2">{{ networkSpeed }}MB/s</span>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
      
      <!-- 系统性能图表 -->
      <div class="mb-8">
        <h3 class="text-lg font-medium mb-4 flex items-center">
          <el-icon class="mr-2 text-blue-500"><TrendCharts /></el-icon>
          <span>系统性能监控</span>
        </h3>
        
        <el-row :gutter="20">
          <el-col :xs="24" :lg="12" class="mb-4">
            <el-card shadow="hover" class="chart-card">
              <div class="chart-title flex justify-between items-center mb-2">
                <span>CPU负载历史记录</span>
                <el-tag size="small" type="info">最近24小时</el-tag>
              </div>
              <div ref="cpuChartRef" style="height: 300px;"></div>
            </el-card>
          </el-col>
          
          <el-col :xs="24" :lg="12" class="mb-4">
            <el-card shadow="hover" class="chart-card">
              <div class="chart-title flex justify-between items-center mb-2">
                <span>内存使用历史记录</span>
                <el-tag size="small" type="info">最近24小时</el-tag>
              </div>
              <div ref="memoryChartRef" style="height: 300px;"></div>
            </el-card>
          </el-col>
        </el-row>
      </div>
      
      <!-- 访问日志 -->
      <div class="mb-8">
        <h3 class="text-lg font-medium mb-4 flex items-between">
          <div class="flex items-center">
            <el-icon class="mr-2 text-blue-500"><Document /></el-icon>
            <span>系统访问日志</span>
          </div>
          <el-tag v-if="hasNewLogs" class="ml-2" type="danger" size="small">新</el-tag>
        </h3>
        
        <el-table
          :data="accessLogs"
          stripe
          style="width: 100%"
          v-loading="logsLoading"
          :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }"
          class="rounded-md overflow-hidden"
        >
          <el-table-column prop="id" label="ID" width="80" align="center" />
          <el-table-column prop="username" label="用户" width="120" align="center" />
          <el-table-column prop="ip" label="IP地址" width="150" align="center" />
          <el-table-column prop="path" label="访问路径" min-width="200" />
          <el-table-column prop="method" label="请求方式" width="120" align="center">
            <template #default="scope">
              <el-tag 
                :type="methodTypeMap[scope.row.method]" 
                size="small" 
                effect="plain"
              >
                {{ scope.row.method }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态码" width="100" align="center">
            <template #default="scope">
              <el-tag 
                :type="getStatusType(scope.row.status)" 
                size="small" 
                effect="plain"
              >
                {{ scope.row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="time" label="响应时间" width="120" align="center">
            <template #default="scope">
              <span>{{ scope.row.time }}ms</span>
            </template>
          </el-table-column>
          <el-table-column prop="timestamp" label="访问时间" width="180" align="center" />
        </el-table>
        
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
      </div>
      
      <!-- 异常告警 -->
      <div>
        <h3 class="text-lg font-medium mb-4 flex items-center">
          <el-icon class="mr-2 text-blue-500"><Warning /></el-icon>
          <span>系统异常告警</span>
          <el-badge :value="activeAlerts.length" class="ml-2" type="danger" v-if="activeAlerts.length > 0" />
        </h3>
        
        <el-empty v-if="activeAlerts.length === 0" description="当前无异常告警"></el-empty>
        
        <el-timeline v-else>
          <el-timeline-item
            v-for="(alert, index) in activeAlerts"
            :key="index"
            :type="alert.level === 'error' ? 'danger' : alert.level"
            :color="getAlertColor(alert.level)"
            :timestamp="alert.timestamp"
            placement="top"
          >
            <el-card shadow="hover">
              <div class="flex items-start">
                <el-icon :class="getAlertIconClass(alert.level)" class="mr-2 text-xl">
                  <component :is="getAlertIcon(alert.level)"></component>
                </el-icon>
                <div>
                  <h4 class="font-medium mb-2">{{ alert.title }}</h4>
                  <p class="text-gray-600">{{ alert.message }}</p>
                  <div class="flex justify-between items-center mt-2">
                    <span class="text-xs text-gray-500">来源: {{ alert.source }}</span>
                    <el-button size="small" type="primary" @click="handleAlertAction(alert)">处理</el-button>
                  </div>
                </div>
              </div>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import { ElMessage } from 'element-plus'
import { 
  Monitor, DataBoard, TrendCharts, Document, Warning,
  WarningFilled, InfoFilled, CircleCheckFilled, Loading
} from '@element-plus/icons-vue'
import * as echarts from 'echarts/core'
import { LineChart } from 'echarts/charts'
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
  LineChart,
  CanvasRenderer
])

// 状态指标
const cpuUsage = ref(45)
const memoryUsage = ref(68)
const diskUsage = ref(52)
const networkUsage = ref(37)
const networkSpeed = ref(5.8)

// 图表引用
const cpuChartRef = ref(null)
const memoryChartRef = ref(null)
let cpuChart = null
let memoryChart = null

// 日志相关
const logsLoading = ref(false)
const accessLogs = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(150)
const hasNewLogs = ref(false)

// 告警相关
const activeAlerts = ref([
  {
    id: 1,
    level: 'warning',
    title: '数据库连接池接近上限',
    message: '当前数据库连接池使用率达到85%，接近配置上限，请检查是否存在连接泄漏',
    source: '数据库服务器',
    timestamp: '2023-05-15 14:32:45',
    handled: false
  },
  {
    id: 2,
    level: 'error',
    title: '文件存储空间不足',
    message: '文件存储服务器剩余空间不足10%，请及时清理或扩容',
    source: '文件存储服务',
    timestamp: '2023-05-15 09:18:20',
    handled: false
  },
  {
    id: 3,
    level: 'info',
    title: '系统自动更新完成',
    message: '系统已完成例行安全更新，部分模块可能需要重新启动',
    source: '系统服务',
    timestamp: '2023-05-14 23:05:12',
    handled: false
  }
])

// 请求方法映射颜色
const methodTypeMap = {
  'GET': 'success',
  'POST': 'primary',
  'PUT': 'warning',
  'DELETE': 'danger',
  'PATCH': 'info'
}

// 初始化日志数据
onMounted(() => {
  initCharts()
  loadAccessLogs()
  startDataSimulation()
})

onBeforeUnmount(() => {
  stopDataSimulation()
  
  // 销毁图表实例
  if (cpuChart) {
    cpuChart.dispose()
    cpuChart = null
  }
  
  if (memoryChart) {
    memoryChart.dispose()
    memoryChart = null
  }
})

// 模拟数据变化的定时器
let simulationTimer = null

function startDataSimulation() {
  simulationTimer = setInterval(() => {
    // 模拟指标波动
    cpuUsage.value = Math.min(100, Math.max(5, cpuUsage.value + (Math.random() * 10 - 5)))
    memoryUsage.value = Math.min(100, Math.max(10, memoryUsage.value + (Math.random() * 6 - 3)))
    diskUsage.value = Math.min(100, Math.max(20, diskUsage.value + (Math.random() * 2 - 1)))
    networkUsage.value = Math.min(100, Math.max(5, networkUsage.value + (Math.random() * 8 - 4)))
    networkSpeed.value = parseFloat((networkSpeed.value + (Math.random() * 1 - 0.5)).toFixed(1))
    
    // 更新图表数据
    updateChartData()
    
    // 模拟新日志
    if (Math.random() > 0.8) {
      addNewLog()
    }
  }, 3000)
}

function stopDataSimulation() {
  if (simulationTimer) {
    clearInterval(simulationTimer)
    simulationTimer = null
  }
}

// 处理告警
function handleAlertAction(alert) {
  ElMessage.success(`已处理告警: ${alert.title}`)
  
  // 移除当前告警
  const index = activeAlerts.value.findIndex(a => a.id === alert.id)
  if (index !== -1) {
    activeAlerts.value.splice(index, 1)
  }
}

// 获取状态码类型
function getStatusType(status) {
  if (status >= 200 && status < 300) return 'success'
  if (status >= 300 && status < 400) return 'info'
  if (status >= 400 && status < 500) return 'warning'
  return 'danger'
}

// 获取进度条颜色
function getProgressColor(value) {
  if (value < 50) return '#67c23a'
  if (value < 80) return '#e6a23c'
  return '#f56c6c'
}

// 获取文本颜色
function getTextColor(value) {
  if (value < 50) return 'text-green-500'
  if (value < 80) return 'text-orange-500'
  return 'text-red-500'
}

// 获取告警颜色
function getAlertColor(level) {
  switch(level) {
    case 'info': return '#909399'
    case 'warning': return '#e6a23c'
    case 'error': return '#f56c6c'
    default: return '#409eff'
  }
}

// 获取告警图标
function getAlertIcon(level) {
  switch(level) {
    case 'info': return InfoFilled
    case 'warning': return WarningFilled
    case 'error': return WarningFilled
    default: return CircleCheckFilled
  }
}

// 获取告警图标样式
function getAlertIconClass(level) {
  switch(level) {
    case 'info': return 'text-gray-500'
    case 'warning': return 'text-orange-500'
    case 'error': return 'text-red-500'
    default: return 'text-blue-500'
  }
}

// 初始化图表
function initCharts() {
  if (cpuChartRef.value) {
    cpuChart = echarts.init(cpuChartRef.value)
    
    // 生成模拟的24小时数据
    const times = Array.from({length: 24}, (_, i) => `${i}:00`)
    const data = Array.from({length: 24}, () => Math.floor(Math.random() * 60 + 20))
    
    cpuChart.setOption({
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
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
        boundaryGap: false,
        data: times
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 100,
        interval: 20
      },
      series: [
        {
          name: 'CPU使用率',
          type: 'line',
          stack: '总量',
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                  offset: 0, color: 'rgba(65,129,255,0.5)'
              }, {
                  offset: 1, color: 'rgba(65,129,255,0.05)'
              }]
            }
          },
          emphasis: {
            focus: 'series'
          },
          itemStyle: {
            color: '#409eff'
          },
          data: data
        }
      ]
    })
  }
  
  if (memoryChartRef.value) {
    memoryChart = echarts.init(memoryChartRef.value)
    
    // 生成模拟的24小时数据
    const times = Array.from({length: 24}, (_, i) => `${i}:00`)
    const data = Array.from({length: 24}, () => Math.floor(Math.random() * 40 + 40))
    
    memoryChart.setOption({
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
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
        boundaryGap: false,
        data: times
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 100,
        interval: 20
      },
      series: [
        {
          name: '内存使用率',
          type: 'line',
          stack: '总量',
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                  offset: 0, color: 'rgba(238,177,83,0.5)'
              }, {
                  offset: 1, color: 'rgba(238,177,83,0.05)'
              }]
            }
          },
          emphasis: {
            focus: 'series'
          },
          itemStyle: {
            color: '#e6a23c'
          },
          data: data
        }
      ]
    })
  }
}

// 更新图表数据
function updateChartData() {
  if (cpuChart) {
    const option = cpuChart.getOption()
    const series = option.series[0].data
    series.shift()
    series.push(Math.round(cpuUsage.value))
    cpuChart.setOption({
      series: [{
        data: series
      }]
    })
  }
  
  if (memoryChart) {
    const option = memoryChart.getOption()
    const series = option.series[0].data
    series.shift()
    series.push(Math.round(memoryUsage.value))
    memoryChart.setOption({
      series: [{
        data: series
      }]
    })
  }
}

// 模拟加载访问日志
function loadAccessLogs() {
  logsLoading.value = true
  
  // 模拟API请求延迟
  setTimeout(() => {
    // 生成随机日志数据
    const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
    const paths = [
      '/api/user', '/api/system/stats', '/api/inventory',
      '/api/food', '/api/purchase', '/api/inspection'
    ]
    const users = ['admin', 'inspector1', 'staff1', 'manager', 'system']
    
    const logs = []
    
    for (let i = 0; i < pageSize.value; i++) {
      const now = new Date()
      now.setMinutes(now.getMinutes() - i * 5)
      
      logs.push({
        id: total.value - (currentPage.value - 1) * pageSize.value - i,
        username: users[Math.floor(Math.random() * users.length)],
        ip: `192.168.1.${Math.floor(Math.random() * 254) + 1}`,
        path: paths[Math.floor(Math.random() * paths.length)],
        method: methods[Math.floor(Math.random() * methods.length)],
        status: Math.random() > 0.9 ? 500 : Math.random() > 0.8 ? 404 : 200,
        time: Math.floor(Math.random() * 500) + 10,
        timestamp: now.toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      })
    }
    
    accessLogs.value = logs
    logsLoading.value = false
  }, 800)
}

// 添加新日志
function addNewLog() {
  const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
  const paths = [
    '/api/user', '/api/system/stats', '/api/inventory',
    '/api/food', '/api/purchase', '/api/inspection'
  ]
  const users = ['admin', 'inspector1', 'staff1', 'manager', 'system']
  
  const newLog = {
    id: total.value + 1,
    username: users[Math.floor(Math.random() * users.length)],
    ip: `192.168.1.${Math.floor(Math.random() * 254) + 1}`,
    path: paths[Math.floor(Math.random() * paths.length)],
    method: methods[Math.floor(Math.random() * methods.length)],
    status: Math.random() > 0.9 ? 500 : Math.random() > 0.8 ? 404 : 200,
    time: Math.floor(Math.random() * 500) + 10,
    timestamp: new Date().toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }
  
  // 如果在第一页，添加到顶部
  if (currentPage.value === 1) {
    accessLogs.value.unshift(newLog)
    if (accessLogs.value.length > pageSize.value) {
      accessLogs.value.pop()
    }
  } else {
    // 不在第一页，显示有新日志的提示
    hasNewLogs.value = true
  }
  
  total.value += 1
  
  // 如果是错误状态码，添加告警
  if (newLog.status >= 500) {
    const alert = {
      id: Date.now(),
      level: 'error',
      title: `API请求异常: ${newLog.path}`,
      message: `用户 ${newLog.username} 访问 ${newLog.path} 时发生错误，状态码: ${newLog.status}`,
      source: '应用服务器',
      timestamp: newLog.timestamp,
      handled: false
    }
    
    activeAlerts.value.unshift(alert)
  }
}

// 分页处理
function handleSizeChange(size) {
  pageSize.value = size
  loadAccessLogs()
}

function handleCurrentChange(page) {
  currentPage.value = page
  hasNewLogs.value = false
  loadAccessLogs()
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