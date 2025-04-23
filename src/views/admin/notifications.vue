<template>
  <div class="notification-container p-4">
    <el-card class="w-full shadow-md">
      <template #header>
        <div class="flex justify-between items-center">
          <div class="flex items-center">
            <el-icon class="mr-2 text-blue-500"><Bell /></el-icon>
            <span class="text-lg font-medium">通知管理</span>
          </div>
          <el-button 
            type="primary" 
            @click="openNotificationDialog()" 
            class="flex items-center"
          >
            <el-icon class="mr-1"><Plus /></el-icon> 新增通知
          </el-button>
        </div>
      </template>
      
      <!-- 搜索和筛选区域 -->
      <div class="search-filter-container mb-4">
        <el-form :inline="true" :model="searchForm" class="flex flex-wrap items-center">
          <el-form-item label="通知标题">
            <el-input 
              v-model="searchForm.title" 
              placeholder="请输入通知标题" 
              clearable 
              @clear="handleSearch"
            />
          </el-form-item>
          <el-form-item label="通知类型">
            <el-select 
              v-model="searchForm.type" 
              placeholder="请选择类型" 
              clearable
              @change="handleSearch"
            >
              <el-option 
                v-for="item in notificationTypes" 
                :key="item.value" 
                :label="item.label" 
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="发布时间">
            <el-date-picker
              v-model="searchForm.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              @change="handleSearch"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      
      <!-- 通知列表 -->
      <el-table
        v-loading="loading"
        :data="notificationList"
        border
        style="width: 100%"
        :header-cell-style="{ background: '#f5f7fa', color: '#606266' }"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="标题" min-width="180" show-overflow-tooltip />
        <el-table-column prop="type" label="类型" width="120">
          <template #default="scope">
            <el-tag :type="getNotificationTypeTag(scope.row.type)">
              {{ getNotificationTypeLabel(scope.row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="内容" min-width="200" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'info'">
              {{ scope.row.status === 1 ? '已发布' : '草稿' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="publishTime" label="发布时间" width="160" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button 
              type="primary" 
              link 
              size="small" 
              @click="openNotificationDialog(scope.row)"
            >
              编辑
            </el-button>
            <el-button 
              v-if="scope.row.status === 0" 
              type="success" 
              link 
              size="small" 
              @click="publishNotification(scope.row.id)"
            >
              发布
            </el-button>
            <el-button 
              type="danger" 
              link 
              size="small" 
              @click="confirmDelete(scope.row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <div class="pagination-container flex justify-end mt-4">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      
      <!-- 通知编辑对话框 -->
      <el-dialog
        v-model="notificationDialogVisible"
        :title="isEdit ? '编辑通知' : '新增通知'"
        width="650px"
        destroy-on-close
      >
        <el-form
          ref="notificationFormRef"
          :model="notificationForm"
          :rules="notificationRules"
          label-width="80px"
        >
          <el-form-item label="标题" prop="title">
            <el-input v-model="notificationForm.title" placeholder="请输入通知标题" />
          </el-form-item>
          <el-form-item label="类型" prop="type">
            <el-select 
              v-model="notificationForm.type" 
              placeholder="请选择通知类型" 
              style="width: 100%"
            >
              <el-option 
                v-for="item in notificationTypes" 
                :key="item.value" 
                :label="item.label" 
                :value="item.value" 
              />
            </el-select>
          </el-form-item>
          <el-form-item label="内容" prop="content">
            <el-input 
              v-model="notificationForm.content" 
              type="textarea" 
              rows="6" 
              placeholder="请输入通知内容"
            />
          </el-form-item>
          <el-form-item label="状态">
            <el-radio-group v-model="notificationForm.status">
              <el-radio :label="0">草稿</el-radio>
              <el-radio :label="1">发布</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="notificationForm.status === 1" label="发布时间">
            <el-date-picker
              v-model="notificationForm.publishTime"
              type="datetime"
              placeholder="选择发布时间"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
              :disabled-date="disabledDate"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item label="目标用户" prop="targetUsers">
            <el-select
              v-model="notificationForm.targetUsers"
              multiple
              collapse-tags
              collapse-tags-tooltip
              placeholder="请选择目标用户(默认全部)"
              style="width: 100%"
            >
              <el-option
                v-for="item in targetUserOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="notificationDialogVisible = false">取消</el-button>
            <el-button 
              type="primary" 
              @click="submitNotificationForm" 
              :loading="submitting"
            >
              {{ isEdit ? '更新' : '创建' }}
            </el-button>
          </div>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { Bell, Plus, Delete, Edit, Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 通知类型选项
const notificationTypes = [
  { label: '系统公告', value: 'system' },
  { label: '活动通知', value: 'activity' },
  { label: '安全提醒', value: 'security' },
  { label: '功能更新', value: 'update' },
  { label: '检查提醒', value: 'inspection' }
]

// 目标用户选项
const targetUserOptions = [
  { label: '管理员', value: 'ADMIN' },
  { label: '监管人员', value: 'INSPECTOR' },
  { label: '食堂工作人员', value: 'STAFF' }
]

// 搜索表单
const searchForm = reactive({
  title: '',
  type: '',
  dateRange: []
})

// 获取不同类型通知对应的标签类型
const getNotificationTypeTag = (type) => {
  const typeMap = {
    'system': 'primary',
    'activity': 'success',
    'security': 'danger',
    'update': 'warning',
    'inspection': 'info'
  }
  return typeMap[type] || 'info'
}

// 获取通知类型标签文字
const getNotificationTypeLabel = (type) => {
  const found = notificationTypes.find(item => item.value === type)
  return found ? found.label : type
}

// 表格相关
const loading = ref(false)
const notificationList = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 表单相关
const notificationFormRef = ref(null)
const notificationDialogVisible = ref(false)
const isEdit = ref(false)
const submitting = ref(false)

// 通知表单数据
const notificationForm = reactive({
  id: null,
  title: '',
  type: 'system',
  content: '',
  status: 0,
  publishTime: new Date().toISOString().substring(0, 19).replace('T', ' '),
  targetUsers: []
})

// 表单验证规则
const notificationRules = {
  title: [
    { required: true, message: '请输入通知标题', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择通知类型', trigger: 'change' }
  ],
  content: [
    { required: true, message: '请输入通知内容', trigger: 'blur' },
    { min: 5, max: 500, message: '长度在 5 到 500 个字符', trigger: 'blur' }
  ]
}

// 限制发布日期不能选择过去的时间
const disabledDate = (time) => {
  return time.getTime() < Date.now() - 8.64e7 // 不能选择昨天及以前的日期
}

// 初始化 - 获取通知列表
onMounted(() => {
  getNotificationList()
})

// 获取通知列表
const getNotificationList = async () => {
  loading.value = true
  try {
    // 模拟API调用，实际项目中应该调用后端API
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 模拟数据
    const mockData = [
      {
        id: 1,
        title: '系统维护通知',
        type: 'system',
        content: '系统将于2023年6月15日晚上22:00-24:00进行例行维护，请提前做好相关准备工作。',
        status: 1,
        publishTime: '2023-06-10 14:30:00',
        targetUsers: ['ADMIN', 'STAFF']
      },
      {
        id: 2,
        title: '食品安全检查',
        type: 'inspection',
        content: '下周将进行季度食品安全检查，请各位食堂工作人员做好准备。',
        status: 1,
        publishTime: '2023-06-12 09:15:00',
        targetUsers: ['STAFF']
      },
      {
        id: 3,
        title: '系统新功能上线',
        type: 'update',
        content: '系统新增了库存预警功能，可以自动提醒库存不足的情况。',
        status: 0,
        publishTime: null,
        targetUsers: ['ADMIN', 'STAFF', 'INSPECTOR']
      },
      {
        id: 4,
        title: '安全密码更新提醒',
        type: 'security',
        content: '为了保障系统安全，请定期更新您的登录密码。',
        status: 1,
        publishTime: '2023-06-09 16:45:00',
        targetUsers: ['ADMIN', 'STAFF', 'INSPECTOR']
      },
      {
        id: 5,
        title: '食堂评比活动',
        type: 'activity',
        content: '本月将举办食堂评比活动，欢迎各位参与。',
        status: 1,
        publishTime: '2023-06-08 10:30:00',
        targetUsers: ['STAFF']
      }
    ]
    
    // 筛选数据
    let filteredData = [...mockData]
    
    if (searchForm.title) {
      filteredData = filteredData.filter(item => 
        item.title.toLowerCase().includes(searchForm.title.toLowerCase())
      )
    }
    
    if (searchForm.type) {
      filteredData = filteredData.filter(item => item.type === searchForm.type)
    }
    
    if (searchForm.dateRange && searchForm.dateRange.length === 2) {
      const startDate = new Date(searchForm.dateRange[0]).getTime()
      const endDate = new Date(searchForm.dateRange[1] + ' 23:59:59').getTime()
      
      filteredData = filteredData.filter(item => {
        if (!item.publishTime) return false
        const itemDate = new Date(item.publishTime).getTime()
        return itemDate >= startDate && itemDate <= endDate
      })
    }
    
    // 更新总数和列表
    total.value = filteredData.length
    
    // 分页处理
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    notificationList.value = filteredData.slice(start, end)
  } catch (error) {
    console.error('获取通知列表失败', error)
    ElMessage.error('获取通知列表失败')
  } finally {
    loading.value = false
  }
}

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1
  getNotificationList()
}

// 重置搜索
const resetSearch = () => {
  searchForm.title = ''
  searchForm.type = ''
  searchForm.dateRange = []
  handleSearch()
}

// 处理页码变化
const handleCurrentChange = (val) => {
  currentPage.value = val
  getNotificationList()
}

// 处理每页条数变化
const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
  getNotificationList()
}

// 打开通知对话框
const openNotificationDialog = (row) => {
  isEdit.value = !!row
  
  if (isEdit.value) {
    // 编辑模式，复制数据到表单
    Object.keys(notificationForm).forEach(key => {
      notificationForm[key] = row[key]
    })
  } else {
    // 新增模式，重置表单
    notificationFormRef.value?.resetFields()
    notificationForm.id = null
    notificationForm.title = ''
    notificationForm.type = 'system'
    notificationForm.content = ''
    notificationForm.status = 0
    notificationForm.publishTime = new Date().toISOString().substring(0, 19).replace('T', ' ')
    notificationForm.targetUsers = []
  }
  
  notificationDialogVisible.value = true
}

// 提交通知表单
const submitNotificationForm = async () => {
  if (!notificationFormRef.value) return
  
  await notificationFormRef.value.validate(async (valid, fields) => {
    if (!valid) {
      return
    }
    
    submitting.value = true
    try {
      // 模拟API调用，实际项目中应该调用后端API
      await new Promise(resolve => setTimeout(resolve, 500))
      
      if (isEdit.value) {
        // 更新通知
        const index = notificationList.value.findIndex(item => item.id === notificationForm.id)
        if (index !== -1) {
          notificationList.value[index] = { ...notificationForm }
        }
        ElMessage.success('通知更新成功')
      } else {
        // 新增通知
        const newNotification = { 
          ...notificationForm,
          id: Date.now() // 模拟ID生成
        }
        
        notificationList.value.unshift(newNotification)
        total.value++
        
        ElMessage.success('通知创建成功')
      }
      
      notificationDialogVisible.value = false
      getNotificationList() // 刷新列表
    } catch (error) {
      console.error('保存通知失败', error)
      ElMessage.error('保存通知失败')
    } finally {
      submitting.value = false
    }
  })
}

// 发布通知
const publishNotification = async (id) => {
  try {
    // 模拟API调用，实际项目中应该调用后端API
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const index = notificationList.value.findIndex(item => item.id === id)
    if (index !== -1) {
      notificationList.value[index].status = 1
      notificationList.value[index].publishTime = new Date().toISOString().substring(0, 19).replace('T', ' ')
    }
    
    ElMessage.success('通知已发布')
  } catch (error) {
    console.error('发布通知失败', error)
    ElMessage.error('发布通知失败')
  }
}

// 确认删除通知
const confirmDelete = (id) => {
  ElMessageBox.confirm('确定要删除这条通知吗？此操作不可逆。', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteNotification(id)
  }).catch(() => {
    // 取消删除
  })
}

// 删除通知
const deleteNotification = async (id) => {
  try {
    // 模拟API调用，实际项目中应该调用后端API
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 从列表中移除
    notificationList.value = notificationList.value.filter(item => item.id !== id)
    total.value--
    
    ElMessage.success('通知删除成功')
  } catch (error) {
    console.error('删除通知失败', error)
    ElMessage.error('删除通知失败')
  }
}
</script>

<style scoped>
.notification-container {
  min-height: calc(100vh - 100px);
}

.search-filter-container {
  background-color: #f9fafb;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
}

:deep(.el-input__wrapper),
:deep(.el-textarea__inner) {
  box-shadow: 0 0 0 1px #dcdfe6 inset;
}

:deep(.el-input__wrapper:hover),
:deep(.el-textarea__inner:hover) {
  box-shadow: 0 0 0 1px #b6c2cd inset;
}

:deep(.el-input__wrapper.is-focus),
:deep(.el-textarea__inner:focus) {
  box-shadow: 0 0 0 1px #409eff inset;
}

:deep(.el-form-item__label) {
  color: #606266;
  font-weight: 500;
}

:deep(.el-pagination) {
  margin-top: 20px;
  justify-content: flex-end;
}

:deep(.el-dialog__header) {
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 16px;
}

:deep(.el-table th) {
  background-color: #f5f7fa !important;
  color: #606266 !important;
  font-weight: 600;
}

:deep(.el-form-item.is-required) .el-form-item__label:before {
  color: #f56c6c;
}
</style> 