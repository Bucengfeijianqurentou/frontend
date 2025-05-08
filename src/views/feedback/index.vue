<template>
  <div class="feedback-container">
    <el-card class="feedback-header-card">
      <div class="feedback-header">
        <h2>家长反馈与建议</h2>
        <div class="feedback-tools">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索反馈内容"
            prefix-icon="Search"
            clearable
            class="search-input"
            @input="handleSearch"
          />
          <el-select v-model="filterStatus" placeholder="全部状态" class="filter-select" @change="handleSearch">
            <el-option label="全部状态" value="" />
            <el-option label="待处理" value="pending" />
            <el-option label="处理中" value="processing" />
            <el-option label="已处理" value="completed" />
          </el-select>
        </div>
      </div>
    </el-card>

    <!-- 新增：数据分析图表部分 -->
    <el-card class="feedback-charts-card">
      <div class="charts-header">
        <h3>反馈数据分析</h3>
        <el-select v-model="chartTimeRange" class="chart-time-select">
          <el-option label="近一周" value="week" />
          <el-option label="近一月" value="month" />
          <el-option label="近三月" value="quarter" />
          <el-option label="今年" value="year" />
        </el-select>
      </div>
      <div class="charts-container">
        <div class="chart-row">
          <div class="chart-item">
            <h4>反馈类型分布</h4>
            <div ref="typeChartRef" class="chart"></div>
          </div>
          <div class="chart-item">
            <h4>反馈处理状态</h4>
            <div ref="statusChartRef" class="chart"></div>
          </div>
        </div>
        <div class="chart-row">
          <div class="chart-item">
            <h4>每日反馈数量趋势</h4>
            <div ref="trendChartRef" class="chart"></div>
          </div>
          <div class="chart-item">
            <h4>满意度评分分布</h4>
            <div ref="satisfactionChartRef" class="chart"></div>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="3" animated />
      <el-skeleton :rows="3" animated />
    </div>

    <!-- 反馈内容列表 -->
    <div v-else-if="feedbackList.length > 0" class="feedback-list">
      <el-card v-for="item in feedbackList" :key="item.id" class="feedback-card">
        <div class="feedback-content">
          <div class="feedback-avatar">
            <el-avatar :size="40">{{ item.studentName?.substring(0, 1) || '家' }}</el-avatar>
          </div>
          <div class="feedback-details">
            <div class="feedback-info">
              <span class="student-name">{{ item.studentName || '匿名家长' }}</span>
              <span class="feedback-time">{{ formatDate(item.feedbackDate || item.createTime) }}</span>
            </div>
            <div class="feedback-text">{{ item.content }}</div>
            <div v-if="item.reply" class="feedback-reply">
              <div class="reply-header">
                <el-icon><ChatLineRound /></el-icon>
                <span>回复：</span>
              </div>
              <div class="reply-content">{{ item.reply }}</div>
            </div>
            <div class="feedback-footer">
              <el-button type="primary" plain size="small" @click="viewDetail(item.id)">
                查看详情
              </el-button>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          :current-page="currentPage"
          :page-size="pageSize"
          :page-sizes="[10, 20, 30, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 无数据状态 -->
    <el-empty v-else description="暂无家长反馈" class="empty-container">
      <template #image>
        <el-icon class="empty-icon"><ChatDotRound /></el-icon>
      </template>
    </el-empty>

    <!-- 详情对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="反馈详情"
      width="600px"
      destroy-on-close
    >
      <div v-if="currentFeedback" class="feedback-detail">
        <div class="detail-header">
          <div class="detail-student">
            <span class="detail-label">家长：</span>
            <span>{{ currentFeedback.studentName || '匿名家长' }}</span>
          </div>
          <div class="detail-time">
            <span class="detail-label">提交时间：</span>
            <span>{{ formatDate(currentFeedback.feedbackDate || currentFeedback.createTime) }}</span>
          </div>
        </div>
        <div class="detail-content">
          <div class="detail-title">反馈内容：</div>
          <div class="detail-text">{{ currentFeedback.content }}</div>
        </div>
        <div v-if="currentFeedback.images && currentFeedback.images.length > 0" class="detail-images">
          <div class="detail-title">附件图片：</div>
          <el-image
            v-for="(url, index) in currentFeedback.images"
            :key="index"
            :src="url"
            fit="cover"
            :preview-src-list="currentFeedback.images"
            class="feedback-image"
          />
        </div>
        <div v-if="currentFeedback.reply" class="detail-reply">
          <div class="detail-title">回复内容：</div>
          <div class="detail-text">{{ currentFeedback.reply }}</div>
          <div class="reply-time">
            <span>回复时间：{{ formatDate(currentFeedback.replyTime) }}</span>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="dialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick, watch, onBeforeUnmount } from 'vue'
import { Search, ChatLineRound, ChatDotRound } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { getFeedbackList, getFeedbackDetail } from '@/api/feedback'
import * as echarts from 'echarts'

// 状态数据
const loading = ref(true)
const feedbackList = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const searchKeyword = ref('')
const filterStatus = ref('')
const dialogVisible = ref(false)
const currentFeedback = ref(null)

// 图表相关
const chartTimeRange = ref('month')
const typeChartRef = ref(null)
const statusChartRef = ref(null)
const trendChartRef = ref(null)
const satisfactionChartRef = ref(null)
let typeChart = null
let statusChart = null
let trendChart = null
let satisfactionChart = null

// 获取反馈列表
const fetchFeedbackList = async () => {
  loading.value = true
  try {
    const res = await getFeedbackList({
      current: currentPage.value,
      size: pageSize.value
    })
    
    // 获取列表数据
    let list = res.data.records || []
    
    // 对列表进行排序处理（倒序排列，最新的反馈在前面）
    list = sortFeedbacksByDate(list)
    
    feedbackList.value = list
    total.value = res.data.total || 0
  } catch (error) {
    console.error('获取反馈列表失败:', error)
    ElMessage.error('获取反馈列表失败，请稍后重试')
    // 模拟数据（实际项目中删除）
    feedbackList.value = sortFeedbacksByDate(generateMockData())
    total.value = 25
  } finally {
    loading.value = false
  }
}

// 查看详情
const viewDetail = async (id) => {
  try {
    const res = await getFeedbackDetail(id)
    currentFeedback.value = res.data
    dialogVisible.value = true
  } catch (error) {
    console.error('获取反馈详情失败:', error)
    ElMessage.error('获取反馈详情失败，请稍后重试')
    // 模拟数据仅作为临时方案
    currentFeedback.value = feedbackList.value.find(item => item.id === id)
    dialogVisible.value = true
  }
}

// 分页处理
const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
  fetchFeedbackList()
}

const handleCurrentChange = (page) => {
  currentPage.value = page
  fetchFeedbackList()
}

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1
  fetchFeedbackList()
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '未知时间'
  
  try {
    // 检查是否只有日期部分（YYYY-MM-DD格式）
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString // 如果是YYYY-MM-DD格式，直接返回
    }
    
    // 处理带时间的日期
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString // 如果日期无效，直接返回原始字符串
    
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  } catch (e) {
    console.error('日期格式化错误:', e)
    return dateString // 出错时返回原始字符串
  }
}

// 获取状态类型
const getStatusType = (status) => {
  switch (status) {
    case 'pending': return 'warning'
    case 'processing': return 'primary'
    case 'completed': return 'success'
    default: return 'info'
  }
}

// 获取状态文本
const getStatusText = (status) => {
  switch (status) {
    case 'pending': return '待处理'
    case 'processing': return '处理中'
    case 'completed': return '已处理'
    default: return '未知状态'
  }
}

// 生成模拟数据（实际项目中删除）
const generateMockData = () => {
  const statuses = ['pending', 'processing', 'completed']
  const mockData = []
  
  for (let i = 1; i <= 10; i++) {
    const hasReply = Math.random() > 0.5
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    
    mockData.push({
      id: i,
      studentName: `家长${i}`,
      className: `${Math.ceil(Math.random() * 6)}年级${Math.ceil(Math.random() * 10)}班`,
      content: `这是家长的反馈内容，关于食堂的${i}号建议。希望能够改进食堂的饭菜质量，增加更多品种的菜品，保证学生的营养均衡。`,
      createTime: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
      status: status,
      reply: hasReply ? '感谢您的反馈，我们已经收到，将会尽快处理并改进相关问题。我们会持续提升食堂服务质量，为学生提供更好的用餐体验。' : null,
      replyTime: hasReply ? new Date(Date.now() - Math.floor(Math.random() * 5000000000)).toISOString() : null,
      images: Math.random() > 0.7 ? ['https://picsum.photos/300/200?random=' + i, 'https://picsum.photos/300/200?random=' + (i+10)] : []
    })
  }
  
  return mockData
}

// 按日期对反馈进行排序（倒序）
const sortFeedbacksByDate = (list) => {
  return [...list].sort((a, b) => {
    const dateA = a.feedbackDate || a.createTime || ''
    const dateB = b.feedbackDate || b.createTime || ''
    
    // 倒序排列，最新的在前面
    return dateB.localeCompare(dateA)
  })
}

// 初始化图表
const initCharts = () => {
  nextTick(() => {
    // 初始化反馈类型分布图表
    typeChart = echarts.init(typeChartRef.value)
    typeChart.setOption({
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'horizontal',
        bottom: 10,
        data: ['饭菜质量', '就餐环境', '服务态度', '价格建议', '其他']
      },
      series: [
        {
          name: '反馈类型',
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
            { value: 35, name: '饭菜质量' },
            { value: 20, name: '就餐环境' },
            { value: 18, name: '服务态度' },
            { value: 15, name: '价格建议' },
            { value: 12, name: '其他' }
          ]
        }
      ]
    })

    // 初始化反馈处理状态图表
    statusChart = echarts.init(statusChartRef.value)
    statusChart.setOption({
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'horizontal',
        bottom: 10,
        data: ['待处理', '处理中', '已处理']
      },
      series: [
        {
          name: '处理状态',
          type: 'pie',
          radius: '70%',
          center: ['50%', '45%'],
          data: [
            { value: 18, name: '待处理', itemStyle: { color: '#E6A23C' } },
            { value: 24, name: '处理中', itemStyle: { color: '#409EFF' } },
            { value: 58, name: '已处理', itemStyle: { color: '#67C23A' } }
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

    // 初始化每日反馈数量趋势图表
    trendChart = echarts.init(trendChartRef.value)
    
    // 生成最近14天的日期数据
    const getDaysData = () => {
      const today = new Date()
      const dates = []
      const data = []
      
      // 生成最近14天的日期（包括今天）
      for (let i = 13; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(today.getDate() - i)
        
        // 格式化为 M/D 格式
        const month = date.getMonth() + 1
        const day = date.getDate()
        dates.push(`${month}/${day}`)
        
        // 生成随机数据，今天的数据特殊处理
        const isToday = i === 0
        // 今天的数据稍微大一些，看起来更逼真
        const value = isToday ? Math.floor(Math.random() * 5) + 8 : Math.floor(Math.random() * 10) + 3
        data.push(value)
      }
      
      return { dates, data }
    }
    
    const { dates, data } = getDaysData()
    
    trendChart.setOption({
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: function(params) {
          const dataIndex = params[0].dataIndex
          const date = dates[dataIndex]
          const value = params[0].value
          
          // 如果是最后一个日期（今天），特殊显示
          if (dataIndex === dates.length - 1) {
            return `${date}（今天）<br/>反馈数量：${value}`
          }
          return `${date}<br/>反馈数量：${value}`
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
        data: dates,
        axisLabel: {
          formatter: function(value, index) {
            // 对于最后一天（今天）特殊显示
            if (index === dates.length - 1) {
              return value + '\n(今天)'
            }
            return value
          },
          color: function(value, index) {
            // 今天的日期标签颜色突出显示
            return index === dates.length - 1 ? '#F56C6C' : '#666'
          }
        }
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '反馈数量',
          type: 'bar',
          data: data,
          itemStyle: {
            color: function(params) {
              // 今天的数据柱状特殊颜色
              if (params.dataIndex === dates.length - 1) {
                return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#f78989' },
                  { offset: 0.5, color: '#f56c6c' },
                  { offset: 1, color: '#e64747' }
                ])
              }
              return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#83bff6' },
                { offset: 0.5, color: '#188df0' },
                { offset: 1, color: '#188df0' }
              ])
            }
          },
          emphasis: {
            itemStyle: {
              color: function(params) {
                // 今天的高亮颜色
                if (params.dataIndex === dates.length - 1) {
                  return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#ff9797' },
                    { offset: 0.7, color: '#f56c6c' },
                    { offset: 1, color: '#ff6565' }
                  ])
                }
                return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#2378f7' },
                  { offset: 0.7, color: '#2378f7' },
                  { offset: 1, color: '#83bff6' }
                ])
              }
            }
          },
          markPoint: {
            data: [
              { type: 'max', name: '最大值' },
              { type: 'min', name: '最小值' }
            ]
          }
        }
      ]
    })

    // 初始化满意度评分分布图表
    satisfactionChart = echarts.init(satisfactionChartRef.value)
    satisfactionChart.setOption({
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
        type: 'category',
        data: ['1分', '2分', '3分', '4分', '5分']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '评分人数',
          type: 'bar',
          data: [3, 5, 15, 28, 49],
          itemStyle: {
            color: function(params) {
              const colorList = ['#F56C6C', '#F56C6C', '#E6A23C', '#67C23A', '#67C23A']
              return colorList[params.dataIndex]
            }
          }
        }
      ]
    })

    // 监听窗口大小变化，重新调整图表大小
    window.addEventListener('resize', handleResize)
  })
}

// 处理窗口大小变化
const handleResize = () => {
  typeChart?.resize()
  statusChart?.resize()
  trendChart?.resize()
  satisfactionChart?.resize()
}

// 监听时间范围变化，更新图表数据
const handleTimeRangeChange = () => {
  // 在实际应用中，这里应该根据选择的时间范围重新获取数据并更新图表
  // 当前是静态图表，所以只是模拟数据变化
  ElMessage.success(`已切换为${chartTimeRange.value === 'week' ? '近一周' : 
    chartTimeRange.value === 'month' ? '近一月' : 
    chartTimeRange.value === 'quarter' ? '近三月' : '今年'}的数据`)
}

// 监听时间范围变化
watch(chartTimeRange, () => {
  handleTimeRangeChange()
})

// 生命周期
onMounted(() => {
  fetchFeedbackList()
  initCharts()
})

// 组件卸载前移除事件监听
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  typeChart?.dispose()
  statusChart?.dispose()
  trendChart?.dispose()
  satisfactionChart?.dispose()
})
</script>

<style scoped>
.feedback-container {
  padding: 20px;
}

.feedback-header-card {
  margin-bottom: 20px;
}

.feedback-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.feedback-header h2 {
  margin: 0;
  color: var(--el-color-primary);
  font-size: 1.5rem;
}

.feedback-tools {
  display: flex;
  gap: 10px;
}

.search-input {
  width: 240px;
}

.filter-select {
  width: 140px;
}

.feedback-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.feedback-card {
  border-radius: 8px;
  transition: transform 0.3s, box-shadow 0.3s;
}

.feedback-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.feedback-content {
  display: flex;
  gap: 16px;
}

.feedback-avatar {
  flex-shrink: 0;
}

.feedback-details {
  flex: 1;
}

.feedback-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-bottom: 8px;
}

.student-name {
  font-weight: bold;
  font-size: 16px;
}

.feedback-time {
  color: var(--el-text-color-secondary);
  font-size: 14px;
}

.feedback-text {
  line-height: 1.6;
  margin-bottom: 8px;
  color: var(--el-text-color-primary);
  white-space: pre-wrap;
}

.feedback-reply {
  background-color: var(--el-fill-color-light);
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 12px;
}

.reply-header {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--el-color-primary);
  margin-bottom: 8px;
}

.reply-content {
  color: var(--el-text-color-regular);
  line-height: 1.6;
}

.feedback-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

.pagination-container {
  margin-top: 24px;
  display: flex;
  justify-content: center;
}

.loading-container {
  margin-top: 20px;
}

.empty-container {
  margin-top: 80px;
}

.empty-icon {
  font-size: 60px;
  color: var(--el-color-primary);
}

/* 新增：图表样式 */
.feedback-charts-card {
  margin-bottom: 20px;
}

.charts-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.charts-header h3 {
  margin: 0;
  color: var(--el-color-primary);
  font-size: 1.2rem;
}

.chart-time-select {
  width: 120px;
}

.charts-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.chart-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

@media (max-width: 768px) {
  .chart-row {
    grid-template-columns: 1fr;
  }
}

.chart-item {
  background-color: var(--el-fill-color-blank);
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.chart-item h4 {
  margin-top: 0;
  margin-bottom: 16px;
  color: var(--el-text-color-primary);
  font-size: 16px;
  text-align: center;
}

.chart {
  height: 300px;
  width: 100%;
}

/* 详情对话框样式 */
.feedback-detail {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-header {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.detail-label {
  font-weight: bold;
  color: var(--el-text-color-secondary);
}

.detail-title {
  font-weight: bold;
  margin-bottom: 8px;
  color: var(--el-text-color-primary);
}

.detail-text {
  line-height: 1.8;
  white-space: pre-wrap;
  background-color: var(--el-fill-color-light);
  padding: 12px;
  border-radius: 6px;
}

.detail-images {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.feedback-image {
  width: 120px;
  height: 120px;
  margin-right: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
  object-fit: cover;
  cursor: pointer;
}

.detail-reply {
  padding-top: 12px;
  border-top: 1px dashed var(--el-border-color);
}

.reply-time {
  margin-top: 8px;
  text-align: right;
  font-size: 14px;
  color: var(--el-text-color-secondary);
}
</style>