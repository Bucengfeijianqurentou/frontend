<template>
  <div class="p-6 flex flex-col gap-6">
    <!-- 标题和新增按钮 -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <div class="border-b border-gray-100 p-5">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-3">
              <el-icon class="text-blue-500 text-2xl"><Shop /></el-icon>
              <span class="text-2xl font-semibold text-gray-900">供应商管理</span>
            </div>
            <el-tag size="default" effect="plain" type="info" class="border-none bg-blue-50 text-blue-500">
              共 {{ suppliers.length || 0 }} 家
            </el-tag>
          </div>
          <el-button type="primary" @click="showAddDialog" class="!flex items-center gap-1">
            <el-icon><Plus /></el-icon>
            <span>新增供应商</span>
          </el-button>
        </div>
        <p class="mt-2 text-gray-500 text-sm">管理系统中的供应商信息</p>
      </div>
    </div>

    <!-- 搜索栏 -->
    <div class="flex gap-4 bg-white p-6 rounded-lg shadow-sm">
      <el-input
        v-model="searchName"
        placeholder="搜索供应商名称..."
        class="max-w-xs"
        clearable
        @clear="handleSearch"
      >
        <template #prefix>
          <el-icon class="text-gray-400"><Search /></el-icon>
        </template>
      </el-input>
      <el-input
        v-model="searchContact"
        placeholder="搜索联系方式..."
        class="max-w-xs"
        clearable
        @clear="handleSearch"
      >
        <template #prefix>
          <el-icon class="text-gray-400"><Phone /></el-icon>
        </template>
      </el-input>
      <el-button type="primary" @click="handleSearch" :icon="Search">搜索</el-button>
    </div>

    <!-- 供应商列表卡片 -->
    <div class="bg-white p-6 rounded-lg shadow-sm">
      <el-table
        :data="suppliers"
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
        <el-table-column prop="id" label="ID" width="100" align="center">
          <template #default="{ row }">
            <span class="px-2 py-1 bg-gray-100 rounded text-gray-600">#{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="供应商名称">
          <template #default="{ row }">
            <div class="flex items-center gap-2">
              <el-icon class="text-blue-500"><Shop /></el-icon>
              <span>{{ row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="contact" label="联系方式">
          <template #default="{ row }">
            <div class="flex items-center gap-2">
              <el-icon class="text-green-500"><Phone /></el-icon>
              <span>{{ row.contact }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
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
      :title="dialogType === 'add' ? '新增供应商' : '编辑供应商'"
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
        <el-form-item label="供应商名称" prop="name">
          <el-input 
            v-model="form.name" 
            placeholder="请输入供应商名称"
            :prefix-icon="Shop"
          />
        </el-form-item>
        <el-form-item label="联系方式" prop="contact">
          <el-input 
            v-model="form.contact" 
            placeholder="请输入联系方式"
            :prefix-icon="Phone"
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
import { Plus, Search, Phone, Edit, Delete, Shop } from '@element-plus/icons-vue'
import { useSupplierApi } from '@/api/supplier'

const supplierApi = useSupplierApi()

// 数据列表相关
const suppliers = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const searchName = ref('')
const searchContact = ref('')

// 对话框相关
const dialogVisible = ref(false)
const dialogType = ref('add')
const submitting = ref(false)
const formRef = ref(null)
const form = ref({
  name: '',
  contact: ''
})

// 表单校验规则
const rules = {
  name: [
    { required: true, message: '请输入供应商名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  contact: [
    { required: true, message: '请输入联系方式', trigger: 'blur' },
    { min: 5, max: 50, message: '长度在 5 到 50 个字符', trigger: 'blur' }
  ]
}

// 获取供应商列表
const fetchSuppliers = async () => {
  loading.value = true
  try {
    const res = await supplierApi.pageSupplier(
      currentPage.value,
      pageSize.value,
      searchName.value,
      searchContact.value
    )
    suppliers.value = res.records
    total.value = res.total
  } catch (error) {
    ElMessage.error('获取供应商列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1
  fetchSuppliers()
}

// 分页处理
const handleSizeChange = (val) => {
  pageSize.value = val
  fetchSuppliers()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchSuppliers()
}

// 显示新增对话框
const showAddDialog = () => {
  dialogType.value = 'add'
  form.value = {
    name: '',
    contact: ''
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
    await ElMessageBox.confirm('确定要删除该供应商吗？', '提示', {
      type: 'warning'
    })
    await supplierApi.deleteSupplier(row.id)
    ElMessage.success('删除成功')
    fetchSuppliers()
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
          await supplierApi.createSupplier(form.value)
          ElMessage.success('添加成功')
        } else {
          await supplierApi.updateSupplier(form.value.id, form.value)
          ElMessage.success('更新成功')
        }
        dialogVisible.value = false
        fetchSuppliers()
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
  fetchSuppliers()
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