<template>
  <div class="p-6 flex flex-col gap-6">
    <!-- 标题和新增按钮 -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <div class="border-b border-gray-100 p-5">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-3">
              <el-icon class="text-blue-500 text-2xl"><Reading /></el-icon>
              <span class="text-2xl font-semibold text-gray-900">年级管理</span>
            </div>
            <el-tag size="default" effect="plain" type="info" class="border-none bg-blue-50 text-blue-500">
              共 {{ grades.length || 0 }} 个
            </el-tag>
          </div>
          <el-button type="primary" @click="showAddDialog" class="!flex items-center gap-1">
            <el-icon><Plus /></el-icon>
            <span>新增年级</span>
          </el-button>
        </div>
        <p class="mt-2 text-gray-500 text-sm">管理系统中的年级信息</p>
      </div>
    </div>

    <!-- 搜索栏 -->
    <div class="flex gap-4 bg-white p-6 rounded-lg shadow-sm">
      <el-input
        v-model="searchGrade"
        placeholder="搜索年级名称..."
        class="max-w-xs"
        clearable
        @clear="handleSearch"
      >
        <template #prefix>
          <el-icon class="text-gray-400"><Search /></el-icon>
        </template>
      </el-input>
      <el-button type="primary" @click="handleSearch" :icon="Search">搜索</el-button>
    </div>

    <!-- 年级列表卡片 -->
    <div class="bg-white p-6 rounded-lg shadow-sm">
      <el-table
        :data="grades"
        border
        stripe
        class="w-full animate-fade-in"
        v-loading="loading"
        :header-cell-style="{
          background: '#f8fafc',
          color: '#475569',
          fontWeight: 600
        }"
      >
        <el-table-column prop="id" label="ID" width="120" align="center">
          <template #default="{ row }">
            <span class="px-2 py-1 bg-gray-100 rounded text-gray-600">#{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="grade" label="年级名称" min-width="400">
          <template #default="{ row }">
            <div class="flex items-center gap-2">
              <el-icon class="text-blue-500"><Reading /></el-icon>
              <span>{{ row.grade }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="240" fixed="right">
          <template #default="{ row }">
            <div class="flex gap-2">
              <el-button
                type="primary"
                @click="handleEdit(row)"
                :icon="Edit"
                plain
                class="!flex items-center"
              >
                编辑
              </el-button>
              <el-button
                type="danger"
                @click="handleDelete(row)"
                :icon="Delete"
                plain
                class="!flex items-center"
              >
                删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="flex justify-end mt-6">
        <el-pagination
          v-model="currentPage"
          :page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          background
          class="pagination-with-background"
        />
      </div>
    </div>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增年级' : '编辑年级'"
      width="500px"
      class="animate-zoom-in"
      destroy-on-close
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
        class="mt-4"
      >
        <el-form-item label="年级名称" prop="grade">
          <el-input 
            v-model="form.grade" 
            placeholder="请输入年级名称，例如：一年级"
            :prefix-icon="Reading"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="flex justify-end gap-2">
          <el-button @click="dialogVisible = false" plain>取消</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="submitting">
            {{ dialogType === 'add' ? '新增' : '保存' }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search, Edit, Delete, Reading } from '@element-plus/icons-vue'
import { useGradeApi } from '@/api/grade'

const gradeApi = useGradeApi()

// 数据列表相关
const grades = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const searchGrade = ref('')

// 对话框相关
const dialogVisible = ref(false)
const dialogType = ref('add')
const submitting = ref(false)
const formRef = ref(null)
const form = ref({
  grade: ''
})

// 表单校验规则
const rules = {
  grade: [
    { required: true, message: '请输入年级名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ]
}

// 获取年级列表
const fetchGrades = async () => {
  loading.value = true
  try {
    // 使用getAllGrades方法获取所有年级
    const res = await gradeApi.getAllGrades()
    
    console.log('后端响应数据:', res)
    
    // 处理不同的响应格式
    if (res.records && res.total !== undefined) {
      // 标准分页格式
      grades.value = res.records
      total.value = res.total
    } else if (Array.isArray(res)) {
      // 直接返回数组格式
      grades.value = res
      total.value = res.length
    } else if (res.data) {
      // 包装在data字段中
      if (Array.isArray(res.data)) {
        grades.value = res.data
        total.value = res.data.length
      } else if (res.data.records) {
        grades.value = res.data.records
        total.value = res.data.total
      }
    } else {
      grades.value = []
      total.value = 0
      console.error('未能识别的响应格式:', res)
    }
  } catch (error) {
    console.error('获取年级列表失败:', error)
    ElMessage.error('获取年级列表失败')
    grades.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1
  fetchGrades()
}

// 分页处理
const handleSizeChange = (val) => {
  pageSize.value = val
  fetchGrades()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchGrades()
}

// 显示新增对话框
const showAddDialog = () => {
  dialogType.value = 'add'
  form.value = {
    grade: ''
  }
  dialogVisible.value = true
}

// 显示编辑对话框
const handleEdit = (row) => {
  dialogType.value = 'edit'
  form.value = { ...row }
  dialogVisible.value = true
}

// 删除处理
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除该年级吗？', '提示', {
      type: 'warning'
    })
    await gradeApi.deleteGrade(row.id)
    ElMessage.success('删除成功')
    fetchGrades()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      try {
        if (dialogType.value === 'add') {
          await gradeApi.createGrade(form.value)
          ElMessage.success('添加成功')
        } else {
          await gradeApi.updateGrade(form.value.id, form.value)
          ElMessage.success('更新成功')
        }
        dialogVisible.value = false
        fetchGrades()
      } catch (error) {
        ElMessage.error(dialogType.value === 'add' ? '添加失败' : '更新失败')
      } finally {
        submitting.value = false
      }
    }
  })
}

// 初始化
onMounted(() => {
  fetchGrades()
})
</script>

<style scoped>
.animate-bounce-in {
  animation: bounce-in 0.5s;
}

.animate-fade-in {
  animation: fade-in 0.3s;
}

.animate-zoom-in {
  animation: zoom-in 0.3s;
}

@keyframes bounce-in {
  0% {
    transform: scale(0.3);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes zoom-in {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

:deep(.el-table) {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.el-table th) {
  font-weight: 600;
}

:deep(.pagination-with-background) {
  --el-pagination-button-bg-color: white;
}

:deep(.el-dialog) {
  border-radius: 12px;
  overflow: hidden;
}

:deep(.el-dialog__header) {
  margin: 0;
  padding: 20px 24px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

:deep(.el-dialog__body) {
  padding: 24px;
}

:deep(.el-dialog__footer) {
  margin: 0;
  padding: 20px 24px;
  border-top: 1px solid var(--el-border-color-lighter);
}
</style> 