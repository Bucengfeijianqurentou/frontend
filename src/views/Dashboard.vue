<template>
  <div class="dashboard-container">
    <div class="welcome-section animate__animated animate__fadeIn">
      <div class="flex justify-between items-center relative">
        <div>
          <h2>欢迎使用中小学食堂监管平台</h2>
          <p class="subtitle">{{ welcomeMessage }}</p>
        </div>
        <el-button 
          type="primary" 
          size="large"
          @click="navigateToDataScreen" 
          class="flex items-center data-screen-btn relative z-10"
        >
          <el-icon class="mr-2"><DataLine /></el-icon>
          数据大屏
        </el-button>
      </div>
      <div class="welcome-decoration"></div>
    </div>

    <div class="dashboard-content animate__animated animate__fadeInUp">
      <!-- 统计卡片 -->
      <div class="stat-cards">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="(card, index) in statCards" :key="index">
            <el-card class="stat-card hover-scale" shadow="always">
              <div class="card-content">
                <el-icon class="card-icon" :style="{ color: card.color }">
                  <component :is="card.icon"></component>
                </el-icon>
                <div class="card-data">
                  <h3 class="card-value">{{ card.value }}</h3>
                  <p class="card-label">{{ card.label }}</p>
                </div>
              </div>
              <div class="card-footer" v-if="card.change !== null">
                <el-tag :type="card.change > 0 ? 'success' : 'danger'" size="small">
                  <el-icon v-if="card.change > 0"><ArrowUp /></el-icon>
                  <el-icon v-else><ArrowDown /></el-icon>
                  {{ Math.abs(card.change) }}% 较上周
                </el-tag>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <!-- 快捷操作区 -->
      <div class="quick-actions">
        <h3 class="section-title">
          <el-icon><Operation /></el-icon>
          快捷操作
        </h3>
        <el-row :gutter="20">
          <el-col :xs="12" :sm="8" :md="6" :lg="4" v-for="(action, index) in quickActions" :key="index">
            <div class="action-card hover-scale" @click="navigateTo(action.path)">
              <el-icon class="action-icon"><component :is="action.icon"></component></el-icon>
              <p class="action-label">{{ action.label }}</p>
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- 今日任务与通知 -->
      <el-row :gutter="24" class="tasks-notifications">
        <el-col :sm="24" :md="12">
          <h3 class="section-title">
            <el-icon><Calendar /></el-icon>
            今日任务
          </h3>
          <el-card shadow="hover" class="task-card">
            <el-empty v-if="tasks.length === 0" description="暂无任务"></el-empty>
            <el-timeline v-else>
              <el-timeline-item
                v-for="(task, index) in tasks"
                :key="index"
                :type="task.status === 'completed' ? 'success' : 'primary'"
                :color="task.status === 'completed' ? '#67C23A' : '#409EFF'"
                :timestamp="task.time"
              >
                <el-card class="task-item">
                  <div class="task-content">
                    <h4>{{ task.title }}</h4>
                    <p>{{ task.description }}</p>
                  </div>
                  <div class="task-actions">
                    <el-button v-if="task.status !== 'completed'" type="primary" size="small" round>完成</el-button>
                    <el-tag v-else type="success">已完成</el-tag>
                  </div>
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </el-card>
        </el-col>

        <el-col :sm="24" :md="12">
          <h3 class="section-title">
            <el-icon><Bell /></el-icon>
            最新通知
          </h3>
          <el-card shadow="hover" class="notification-card">
            <el-empty v-if="notifications.length === 0" description="暂无通知"></el-empty>
            <div v-else class="notification-list">
              <div v-for="(notification, index) in notifications" :key="index" class="notification-item">
                <div class="notification-icon">
                  <el-avatar :size="40" :icon="notificationIcons[notification.type]"></el-avatar>
                </div>
                <div class="notification-content">
                  <h4>{{ notification.title }}</h4>
                  <p>{{ notification.content }}</p>
                  <span class="notification-time">{{ notification.time }}</span>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 系统状态或图表 - 根据角色展示不同内容 -->
      <div v-if="userStore.isAdmin" class="system-stats">
        <h3 class="section-title">
          <el-icon><DataLine /></el-icon>
          系统概览
        </h3>
        <el-row :gutter="24">
          <el-col :xs="24" :lg="12">
            <el-card shadow="hover" class="chart-card">
              <div class="chart-title">近7天食品入库统计</div>
              <div ref="purchaseChartRef" class="chart"></div>
            </el-card>
          </el-col>
          <el-col :xs="24" :lg="12">
            <el-card shadow="hover" class="chart-card">
              <div class="chart-title">各年级营养摄入分析</div>
              <div ref="nutritionChartRef" class="chart"></div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <div v-if="userStore.isInspector" class="inspection-summary">
        <h3 class="section-title">
          <el-icon><Document /></el-icon>
          检查统计
        </h3>
        <el-row :gutter="24">
          <el-col :xs="24" :lg="12">
            <el-card shadow="hover" class="chart-card">
              <div class="chart-title">近期检查结果统计</div>
              <div ref="inspectionChartRef" class="chart"></div>
            </el-card>
          </el-col>
          <el-col :xs="24" :lg="12">
            <el-card shadow="hover" class="chart-card">
              <div class="chart-title">检查问题类型分布</div>
              <div ref="issueTypeChartRef" class="chart"></div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <div v-if="userStore.isStaff" class="staff-summary">
        <h3 class="section-title">
          <el-icon><List /></el-icon>
          食堂运营概览
        </h3>
        <el-row :gutter="24">
          <el-col :xs="24" :lg="12">
            <el-card shadow="hover" class="chart-card">
              <div class="chart-title">本周菜品受欢迎程度</div>
              <div ref="popularityChartRef" class="chart"></div>
            </el-card>
          </el-col>
          <el-col :xs="24" :lg="12">
            <el-card shadow="hover" class="chart-card">
              <div class="chart-title">库存预警</div>
              <div ref="inventoryChartRef" class="chart"></div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import * as echarts from 'echarts/core'
import { BarChart, LineChart, PieChart, RadarChart } from 'echarts/charts'
import { 
  TitleComponent, 
  TooltipComponent, 
  GridComponent, 
  LegendComponent 
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { 
  Bell, 
  Calendar, 
  List, 
  Document, 
  DataLine, 
  Operation,
  ArrowUp, 
  ArrowDown,
  UserFilled,
  ShoppingCart,
  Goods,
  KnifeFork,
  Memo,
  Search,
  Link,
  Setting,
  Monitor,
  InfoFilled,
  WarningFilled,
  Box,
  School,
  Check
} from '@element-plus/icons-vue'
import 'animate.css'
import { getUserCount } from '@/api/user'

// 添加 CSS 变量计算
document.documentElement.style.setProperty('--primary-color-rgb', '30, 58, 138')
document.documentElement.style.setProperty('--success-color-rgb', '16, 185, 129')
document.documentElement.style.setProperty('--warning-color-rgb', '245, 158, 11')
document.documentElement.style.setProperty('--danger-color-rgb', '239, 68, 68')
document.documentElement.style.setProperty('--light-border-rgb', '229, 231, 235')

echarts.use([
  TitleComponent, 
  TooltipComponent, 
  GridComponent, 
  LegendComponent,
  BarChart,
  LineChart,
  PieChart,
  RadarChart,
  CanvasRenderer
])

const router = useRouter()
const userStore = useUserStore()

// 欢迎语
const welcomeMessage = computed(() => {
  const username = userStore.user?.username || '用户'
  const now = new Date()
  const hour = now.getHours()
  
  let greeting = ''
  if (hour < 6) {
    greeting = '凌晨好'
  } else if (hour < 9) {
    greeting = '早上好'
  } else if (hour < 12) {
    greeting = '上午好'
  } else if (hour < 14) {
    greeting = '中午好'
  } else if (hour < 18) {
    greeting = '下午好'
  } else {
    greeting = '晚上好'
  }
  
  return `${greeting}，${username}！今天是 ${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`
})

// 图表实例引用
const purchaseChartRef = ref(null)
const nutritionChartRef = ref(null)
const inspectionChartRef = ref(null)
const issueTypeChartRef = ref(null)
const popularityChartRef = ref(null)
const inventoryChartRef = ref(null)

// 用户数据相关的响应式变量
const userCount = ref(0)
const userCountChange = ref(0)
const prevUserCount = ref(0)

// 在onMounted钩子中调用
const userCountTimer = ref(null)

// 获取用户数量的方法
const fetchUserCount = async () => {
  try {
    const res = await getUserCount()
    if (res.data) {
      // 保存上一次的用户数量用于计算变化率
      prevUserCount.value = userCount.value
      
      // 更新当前用户数量
      userCount.value = res.data.count
      
      // 计算变化率（如果有历史数据）
      if (prevUserCount.value > 0) {
        const diff = userCount.value - prevUserCount.value
        userCountChange.value = Math.round((diff / prevUserCount.value) * 100)
      } else {
        userCountChange.value = 0
      }
    }
  } catch (error) {
    console.error('获取用户数量失败:', error)
    // 使用默认值
    userCount.value = 0
    userCountChange.value = 0
  }
}

// 统计卡片数据 - 根据角色展示不同数据
const statCards = computed(() => {
  if (userStore.isAdmin) {
    return [
      { label: '系统用户数', value: userCount.value.toString(), icon: 'UserFilled', color: '#409EFF', change: userCountChange.value },
      { label: '活跃学校', value: '12', icon: 'School', color: '#67C23A', change: 0 },
      { label: '本周检查次数', value: '24', icon: 'Search', color: '#E6A23C', change: 12 },
      { label: '本月食品安全事故', value: '0', icon: 'WarningFilled', color: '#F56C6C', change: -2 }
    ]
  } else if (userStore.isInspector) {
    return [
      { label: '待检查食堂', value: '3', icon: 'Search', color: '#409EFF', change: null },
      { label: '已完成检查', value: '8', icon: 'Check', color: '#67C23A', change: 2 },
      { label: '发现问题', value: '5', icon: 'WarningFilled', color: '#E6A23C', change: -3 },
      { label: '待审核菜单', value: '2', icon: 'Document', color: '#F56C6C', change: null }
    ]
  } else {
    return [
      { label: '今日采购项', value: '8', icon: 'ShoppingCart', color: '#409EFF', change: null },
      { label: '库存预警', value: '3', icon: 'WarningFilled', color: '#F56C6C', change: 1 },
      { label: '本周菜单数', value: '14', icon: 'Memo', color: '#67C23A', change: 2 },
      { label: '食品加工批次', value: '6', icon: 'KnifeFork', color: '#E6A23C', change: null }
    ]
  }
})

// 快捷操作 - 根据角色展示不同快捷入口
const quickActions = computed(() => {
  if (userStore.isAdmin) {
    return [
      { label: '系统监控', icon: 'Monitor', path: '/system' },
      { label: '用户管理', icon: 'UserFilled', path: '/admin/users' },
      { label: '数据分析', icon: 'DataLine', path: '/admin/analysis' },
      { label: '溯源查询', icon: 'Link', path: '/admin/tracing' },
      { label: '通知管理', icon: 'Bell', path: '/admin/notifications' },
      { label: '报表生成', icon: 'Document', path: '/admin/reports' }
    ]
  } else if (userStore.isInspector) {
    return [
      { label: '菜单审查', icon: 'Document', path: '/inspection' },
      { label: '审查记录', icon: 'List', path: '/inspection/records' },
      { label: '溯源查询', icon: 'Link', path: '/tracing' },
      { label: '数据分析', icon: 'DataLine', path: '/analysis' }
    ]
  } else {
    return [
      { label: '食品采购', icon: 'ShoppingCart', path: '/purchase/create' },
      { label: '库存管理', icon: 'Goods', path: '/inventory' },
      { label: '食品加工', icon: 'KnifeFork', path: '/processing' },
      { label: '菜单管理', icon: 'Memo', path: '/menu' },
      { label: '食品发放', icon: 'Box', path: '/distribution' }
    ]
  }
})

// 模拟今日任务数据
const tasks = reactive([
  {
    title: '新批次蔬菜验收',
    description: '验收今日配送的新鲜蔬菜',
    time: '09:00',
    status: 'completed'
  },
  {
    title: '食堂卫生检查',
    description: '对食堂卫生情况进行全面检查',
    time: '11:30',
    status: 'pending'
  },
  {
    title: '更新下周菜单',
    description: '根据库存情况更新下周菜单',
    time: '15:00',
    status: 'pending'
  }
])

// 模拟通知数据
const notifications = reactive([
  {
    title: '系统更新通知',
    content: '系统将于今晚22:00进行维护更新，预计持续1小时',
    time: '1小时前',
    type: 'info'
  },
  {
    title: '库存预警',
    content: '大米库存不足，请及时补充',
    time: '3小时前',
    type: 'warning'
  },
  {
    title: '检查通知',
    content: '食品安全监管部门将于明日进行季度检查',
    time: '昨天',
    type: 'important'
  }
])

// 通知图标
const notificationIcons = {
  'info': InfoFilled,
  'warning': WarningFilled,
  'important': Bell
}

// 路由跳转方法
const navigateTo = (path) => {
  router.push(path)
}

// 跳转到数据大屏页面
const navigateToDataScreen = () => {
  router.push('/datascreen')
}

// 初始化图表
const initCharts = () => {
  // 管理员图表
  if (userStore.isAdmin) {
    if (purchaseChartRef.value) {
      const purchaseChart = echarts.init(purchaseChartRef.value)
      purchaseChart.setOption({
        title: { text: '' },
        tooltip: { trigger: 'axis' },
        legend: { data: ['蔬菜', '肉类', '粮油', '调料'] },
        xAxis: { type: 'category', data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'] },
        yAxis: { type: 'value' },
        series: [
          { name: '蔬菜', type: 'bar', data: [120, 132, 101, 134, 90, 80, 110] },
          { name: '肉类', type: 'bar', data: [60, 72, 71, 74, 60, 50, 50] },
          { name: '粮油', type: 'bar', data: [30, 32, 31, 34, 30, 30, 30] },
          { name: '调料', type: 'bar', data: [10, 12, 11, 14, 10, 10, 10] }
        ]
      })
    }

    if (nutritionChartRef.value) {
      const nutritionChart = echarts.init(nutritionChartRef.value)
      nutritionChart.setOption({
        title: { text: '' },
        tooltip: { trigger: 'axis' },
        radar: {
          indicator: [
            { name: '蛋白质', max: 100 },
            { name: '脂肪', max: 100 },
            { name: '碳水化合物', max: 100 },
            { name: '维生素', max: 100 },
            { name: '矿物质', max: 100 }
          ]
        },
        series: [
          {
            type: 'radar',
            data: [
              {
                value: [80, 70, 90, 85, 75],
                name: '一年级'
              },
              {
                value: [85, 65, 85, 90, 80],
                name: '三年级'
              },
              {
                value: [90, 60, 80, 85, 85],
                name: '六年级'
              }
            ]
          }
        ]
      })
    }
  }

  // 监管人员图表
  if (userStore.isInspector) {
    if (inspectionChartRef.value) {
      const inspectionChart = echarts.init(inspectionChartRef.value)
      inspectionChart.setOption({
        title: { text: '' },
        tooltip: { trigger: 'axis' },
        legend: { data: ['合格', '不合格'] },
        xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月'] },
        yAxis: { type: 'value' },
        series: [
          { name: '合格', type: 'line', data: [12, 13, 14, 15, 16, 17] },
          { name: '不合格', type: 'line', data: [2, 1, 1, 0, 1, 0] }
        ]
      })
    }

    if (issueTypeChartRef.value) {
      const issueTypeChart = echarts.init(issueTypeChartRef.value)
      issueTypeChart.setOption({
        title: { text: '' },
        tooltip: { trigger: 'item' },
        legend: { orient: 'vertical', left: 'left' },
        series: [
          {
            type: 'pie',
            radius: '70%',
            data: [
              { value: 5, name: '食品存储问题' },
              { value: 3, name: '卫生清洁不足' },
              { value: 2, name: '记录不完整' },
              { value: 1, name: '人员培训缺失' },
              { value: 1, name: '设备故障' }
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
      })
    }
  }

  // 食堂工作人员图表
  if (userStore.isStaff) {
    if (popularityChartRef.value) {
      const popularityChart = echarts.init(popularityChartRef.value)
      popularityChart.setOption({
        title: { text: '' },
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        xAxis: { type: 'value' },
        yAxis: { 
          type: 'category', 
          data: ['红烧排骨', '清炒时蔬', '番茄炒蛋', '鱼香肉丝', '宫保鸡丁'] 
        },
        series: [
          {
            name: '受欢迎度',
            type: 'bar',
            data: [98, 85, 92, 80, 95]
          }
        ]
      })
    }

    if (inventoryChartRef.value) {
      const inventoryChart = echarts.init(inventoryChartRef.value)
      inventoryChart.setOption({
        title: { text: '' },
        tooltip: { trigger: 'item' },
        legend: { orient: 'vertical', left: 'left' },
        series: [
          {
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: { show: false },
            labelLine: { show: false },
            data: [
              { value: 3, name: '即将过期' },
              { value: 5, name: '库存不足' },
              { value: 12, name: '库存充足' }
            ]
          }
        ]
      })
    }
  }
}

onMounted(() => {
  // 获取用户数量
  fetchUserCount()
  
  // 初始化所有图表
  setTimeout(() => {
    initCharts()
  }, 200)
  
  // 窗口大小变化时重新调整图表大小
  window.addEventListener('resize', handleResize)
  
  // 设置定时刷新用户数量（可选，每5分钟刷新一次）
  userCountTimer.value = setInterval(() => {
    fetchUserCount()
  }, 5 * 60 * 1000)
})

// 处理窗口大小变化
const handleResize = () => {
  const charts = []
  
  if (userStore.isAdmin) {
    if (purchaseChartRef.value) charts.push(echarts.getInstanceByDom(purchaseChartRef.value))
    if (nutritionChartRef.value) charts.push(echarts.getInstanceByDom(nutritionChartRef.value))
  }
  
  if (userStore.isInspector) {
    if (inspectionChartRef.value) charts.push(echarts.getInstanceByDom(inspectionChartRef.value))
    if (issueTypeChartRef.value) charts.push(echarts.getInstanceByDom(issueTypeChartRef.value))
  }
  
  if (userStore.isStaff) {
    if (popularityChartRef.value) charts.push(echarts.getInstanceByDom(popularityChartRef.value))
    if (inventoryChartRef.value) charts.push(echarts.getInstanceByDom(inventoryChartRef.value))
  }
  
  charts.forEach(chart => {
    if (chart) chart.resize()
  })
}

// 组件卸载时清理
onUnmounted(() => {
  // 移除窗口大小变化监听器
  window.removeEventListener('resize', handleResize)
  
  // 清除定时器
  if (userCountTimer.value) {
    clearInterval(userCountTimer.value)
    userCountTimer.value = null
  }
})
</script>

<style scoped>
.dashboard-container {
  padding: 1.5rem;
  min-height: 100%;
  width: 100%;
}

.welcome-section {
  margin-bottom: 2rem;
  background: linear-gradient(120deg, var(--primary-color), var(--primary-dark));
  padding: 2rem;
  border-radius: 12px;
  color: white;
  box-shadow: var(--shadow-lg);
  position: relative;
  overflow: hidden;
}

.welcome-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect fill-opacity="0.1" width="50" height="50" x="0" y="0"></rect><rect fill-opacity="0.1" width="50" height="50" x="50" y="50"></rect></svg>');
  opacity: 0.1;
  z-index: 0;
}

h2 {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: white;
  position: relative;
  z-index: 1;
}

.subtitle {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0.5rem 0;
  position: relative;
  z-index: 1;
}

.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.section-title {
  display: flex;
  align-items: center;
  font-size: 1.25rem;
  margin-bottom: 1.25rem;
  color: var(--text-primary);
  font-weight: 600;
  position: relative;
  padding-left: 1rem;
}

.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  height: 1.25rem;
  width: 4px;
  background: linear-gradient(to bottom, var(--primary-color), var(--primary-light));
  border-radius: 2px;
}

.section-title .el-icon {
  margin-right: 0.5rem;
  font-size: 1.25rem;
  color: var(--primary-color);
}

/* 统计卡片样式 */
.stat-cards {
  margin-bottom: 1.5rem;
}

.stat-card {
  height: 100%;
  transition: all 0.3s;
  margin-bottom: 1rem;
  position: relative;
  overflow: hidden;
  border-radius: 10px;
  border: none;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 40%;
  height: 100%;
  background: linear-gradient(135deg, transparent, rgba(30, 58, 138, 0.05));
  z-index: 0;
}

.card-content {
  display: flex;
  align-items: center;
  position: relative;
  z-index: 1;
}

.card-icon {
  font-size: 2.5rem;
  margin-right: 1.5rem;
  padding: 0.75rem;
  background-color: rgba(30, 58, 138, 0.1);
  border-radius: 12px;
  box-shadow: var(--shadow-sm);
}

.card-data {
  flex: 1;
}

.card-value {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.25rem;
  color: var(--text-primary);
  line-height: 1;
}

.card-label {
  color: var(--text-secondary);
  margin: 0;
  font-size: 0.9rem;
  font-weight: 500;
}

.card-footer {
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(229, 231, 235, 0.5);
}

/* 快捷操作样式 */
.quick-actions {
  margin-bottom: 2rem;
  background-color: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: var(--shadow-md);
}

.action-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 1rem;
  background-color: white;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 1rem;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--light-border);
}

.action-card:hover {
  background: linear-gradient(to bottom right, var(--primary-bg), white);
  border-color: var(--primary-light);
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}

.action-icon {
  font-size: 2.25rem;
  margin-bottom: 1rem;
  color: var(--primary-color);
  background-color: var(--primary-bg);
  padding: 1rem;
  border-radius: 50%;
  box-shadow: var(--shadow-sm);
}

.action-label {
  font-size: 1rem;
  font-weight: 500;
  margin: 0;
  text-align: center;
  color: var(--text-primary);
}

/* 任务与通知样式 */
.tasks-notifications {
  margin-bottom: 2rem;
}

.task-card, .notification-card {
  height: 100%;
  min-height: 380px;
  margin-bottom: 1rem;
  box-shadow: var(--shadow-md);
  border-radius: 12px;
  overflow: hidden;
}

.task-item {
  margin-bottom: 0.75rem;
  border-radius: 8px;
  background-color: white;
  box-shadow: var(--shadow-sm);
}

.task-content {
  flex: 1;
  padding: 0.5rem 0;
}

.task-content h4 {
  margin: 0 0 0.25rem;
  font-weight: 600;
  color: var(--text-primary);
}

.task-content p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.notification-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.notification-item {
  display: flex;
  padding: 1rem;
  border-bottom: 1px solid var(--light-border);
  transition: all 0.3s;
}

.notification-item:hover {
  background-color: var(--primary-bg);
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-icon {
  margin-right: 1rem;
}

.notification-content {
  flex: 1;
}

.notification-content h4 {
  margin: 0 0 0.25rem;
  font-weight: 600;
  color: var(--text-primary);
}

.notification-content p {
  margin: 0 0 0.5rem;
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.5;
}

.notification-time {
  font-size: 0.8rem;
  color: var(--text-tertiary);
  display: block;
  text-align: right;
}

/* 图表样式 */
.chart-card {
  height: 100%;
  margin-bottom: 1rem;
  border-radius: 12px;
  box-shadow: var(--shadow-md);
  overflow: hidden;
}

.chart-title {
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-primary);
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--light-border);
}

.chart {
  height: 320px;
  width: 100%;
}

/* 创建悬停缩放效果的新实现 */
.hover-scale {
  transition: all 0.3s ease;
}

.hover-scale:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}

/* 系统状态和图表区域样式 */
.system-stats, .inspection-summary, .staff-summary {
  background-color: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: var(--shadow-md);
  margin-bottom: 2rem;
}

/* 增加动画延迟，创造错落有致的加载效果 */
.stat-card {
  animation-delay: 0.1s;
}

.quick-actions {
  animation-delay: 0.2s;
}

.task-card {
  animation-delay: 0.3s;
}

.notification-card {
  animation-delay: 0.4s;
}

.chart-card {
  animation-delay: 0.5s;
}

/* 为统计卡片增加不同颜色变体 */
:deep(.el-col:nth-child(1) .stat-card .card-icon) {
  color: var(--primary-color);
  background-color: rgba(30, 58, 138, 0.1);
}

:deep(.el-col:nth-child(2) .stat-card .card-icon) {
  color: var(--success-color);
  background-color: rgba(16, 185, 129, 0.1);
}

:deep(.el-col:nth-child(3) .stat-card .card-icon) {
  color: var(--warning-color);
  background-color: rgba(245, 158, 11, 0.1);
}

:deep(.el-col:nth-child(4) .stat-card .card-icon) {
  color: var(--danger-color);
  background-color: rgba(239, 68, 68, 0.1);
}

.welcome-decoration {
  position: absolute;
  bottom: -50px;
  right: -50px;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  z-index: 1;
  pointer-events: none;
}

@media (max-width: 768px) {
  .welcome-section {
    padding: 1.5rem;
  }
  
  .card-value {
    font-size: 1.5rem;
  }
  
  .action-icon {
    font-size: 1.75rem;
    padding: 0.75rem;
  }
}

.data-screen-btn {
  position: relative;
  z-index: 10;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(5px);
  color: white;
  font-weight: 600;
  padding: 10px 20px;
  transition: all 0.3s;
  pointer-events: auto;
}

.data-screen-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}
</style> 