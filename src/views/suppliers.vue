<template>
  <div class="p-4 flex flex-col gap-4">
    <!-- 标题和新增按钮 -->
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-gray-800">供应商管理</h2>
      <el-button type="primary" @click="showAddDialog" class="animate-bounce-in">
        <el-icon class="mr-1"><Plus /></el-icon>新增供应商
      </el-button>
    </div>

    <!-- 搜索栏 -->
    <div class="flex gap-4 bg-gray-50 p-4 rounded-lg shadow-sm">
      <el-input
        v-model="searchName"
        placeholder="供应商名称"
        class="max-w-xs"
        clearable
        @clear="handleSearch"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      <el-input
        v-model="searchContact"
        placeholder="联系方式"
        class="max-w-xs"
        clearable
        @clear="handleSearch"
      >
        <template #prefix>
          <el-icon><Phone /></el-icon>
        </template>
      </el-input>
      <el-button type="primary" @click="handleSearch">搜索</el-button>
    </div>

    <!-- 供应商列表 -->
    <el-table
      :data="suppliers"
      border
      stripe
      class="w-full animate-fade-in"
      v-loading="loading"
    >
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="供应商名称" />
      <el-table-column prop="contact" label="联系方式" />
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button-group>
            <el-button type="primary" @click="handleEdit(row)" :icon="Edit">
              编辑
            </el-button>
            <el-button
              type="danger"
              @click="handleDelete(row)"
              :icon="Delete"
            >
              删除
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="flex justify-end mt-4">
      <el-pagination
        v-model="currentPage"
        :page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增供应商' : '编辑供应商'"
      width="500px"
      class="animate-zoom-in"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
        class="mt-4"
      >
        <el-form-item label="供应商名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入供应商名称" />
        </el-form-item>
        <el-form-item label="联系方式" prop="contact">
          <el-input v-model="form.contact" placeholder="请输入联系方式" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="flex justify-end gap-2">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="submitting">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search, Phone, Edit, Delete } from '@element-plus/icons-vue'
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
</style> 