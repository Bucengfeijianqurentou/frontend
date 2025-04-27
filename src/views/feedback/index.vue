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
import { ref, onMounted, computed } from 'vue'
import { Search, ChatLineRound, ChatDotRound } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { getFeedbackList, getFeedbackDetail } from '@/api/feedback'

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

// 生命周期
onMounted(() => {
  fetchFeedbackList()
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