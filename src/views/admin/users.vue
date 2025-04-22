<template>
  <div class="p-4">
    <el-card class="w-full">
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <el-icon class="mr-2"><UserFilled /></el-icon>
            <span>用户管理</span>
          </div>
          <div class="flex items-center">
            <el-input
              v-model="searchQuery"
              placeholder="搜索用户名/姓名/邮箱"
              class="w-60 mr-2"
              clearable
              @clear="loadUserList"
              @keyup.enter="loadUserList"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-button type="primary" @click="loadUserList">
              <el-icon><Search /></el-icon>搜索
            </el-button>
          </div>
        </div>
      </template>

      <!-- 用户列表表格 -->
      <el-table
        v-loading="loading"
        :data="userList"
        stripe
        border
        style="width: 100%"
      >
        <el-table-column prop="id" label="ID" width="70" align="center" />
        <el-table-column prop="username" label="用户名" min-width="120" />
        <el-table-column prop="realName" label="姓名" min-width="120" />
        <el-table-column label="角色" min-width="120">
          <template #default="scope">
            <el-tag
              :type="getRoleTagType(scope.row.role)"
              effect="plain"
            >
              {{ getRoleDisplayName(scope.row.role) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机" min-width="120" />
        <el-table-column prop="email" label="邮箱" min-width="160" />
        <el-table-column label="状态" width="100" align="center">
          <template #default="scope">
            <el-tag
              :type="scope.row.status === 0 ? 'success' : 'danger'"
              effect="dark"
            >
              {{ scope.row.status === 0 ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="区块链账户" min-width="280">
          <template #default="scope">
            <el-tooltip
              :content="scope.row.chainAccount"
              placement="top"
              :show-after="500"
            >
              <span class="truncate block">{{ scope.row.chainAccount }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="180" />
        <el-table-column label="操作" fixed="right" width="180" align="center">
          <template #default="scope">
            <el-button
              size="small"
              type="primary"
              link
              @click="handleEdit(scope.row)"
            >
              <el-icon><Edit /></el-icon>编辑
            </el-button>
            <el-button
              size="small"
              :type="scope.row.status === 0 ? 'danger' : 'success'"
              link
              @click="handleToggleStatus(scope.row)"
            >
              <el-icon v-if="scope.row.status === 0"><Lock /></el-icon>
              <el-icon v-else><Unlock /></el-icon>
              {{ scope.row.status === 0 ? '禁用' : '启用' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="flex justify-center mt-4">
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

      <!-- 用户编辑对话框 -->
      <el-dialog
        v-model="dialogVisible"
        :title="dialogType === 'edit' ? '编辑用户' : '添加用户'"
        width="500px"
      >
        <el-form
          ref="userFormRef"
          :model="userForm"
          :rules="userFormRules"
          label-width="100px"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="userForm.username" :disabled="dialogType === 'edit'" />
          </el-form-item>
          <el-form-item label="姓名" prop="realName">
            <el-input v-model="userForm.realName" />
          </el-form-item>
          <el-form-item label="手机" prop="phone">
            <el-input v-model="userForm.phone" />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="userForm.email" />
          </el-form-item>
          <el-form-item label="角色" prop="role">
            <el-select v-model="userForm.role" class="w-full">
              <el-option
                v-for="(label, value) in roleOptions"
                :key="value"
                :label="label"
                :value="value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="userForm.status">
              <el-radio :label="0">正常</el-radio>
              <el-radio :label="1">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submitUserForm">确认</el-button>
          </div>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { UserFilled, Search, Edit, Lock, Unlock } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getUserList, toggleUserStatus, updateUser } from '@/api/user'

// 状态数据
const loading = ref(false)
const userList = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const searchQuery = ref('')

// 编辑对话框相关
const dialogVisible = ref(false)
const dialogType = ref('edit') // 'edit' 或 'add'
const userForm = ref({
  id: null,
  username: '',
  realName: '',
  phone: '',
  email: '',
  role: '',
  status: 0
})
const userFormRef = ref(null)

// 表单验证规则
const userFormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  realName: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ]
}

// 角色选项
const roleOptions = {
  'ADMIN': '管理员',
  'INSPECTOR': '监管人员',
  'STAFF': '食堂工作人员',
  'STUDENT_PARENT': '学生/家长'
}

// 根据角色名获取展示名称
const getRoleDisplayName = (role) => {
  return roleOptions[role] || role
}

// 根据角色获取标签类型
const getRoleTagType = (role) => {
  const typeMap = {
    'ADMIN': 'danger',
    'INSPECTOR': 'warning',
    'STAFF': 'success',
    'STUDENT_PARENT': 'info'
  }
  return typeMap[role] || 'default'
}

// 加载用户列表
const loadUserList = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      size: pageSize.value,
      query: searchQuery.value || undefined
    }
    
    const res = await getUserList(params)
    if (res.code === 200) {
      userList.value = res.data.records
      total.value = res.data.total
    } else {
      ElMessage.error(res.message || '获取用户列表失败')
    }
  } catch (error) {
    console.error('加载用户列表失败:', error)
    ElMessage.error('获取用户列表失败')
  } finally {
    loading.value = false
  }
}

// 处理页大小变化
const handleSizeChange = (size) => {
  pageSize.value = size
  loadUserList()
}

// 处理当前页变化
const handleCurrentChange = (page) => {
  currentPage.value = page
  loadUserList()
}

// 切换用户状态
const handleToggleStatus = (row) => {
  const newStatus = row.status === 0 ? 1 : 0
  const statusText = newStatus === 0 ? '启用' : '禁用'
  
  ElMessageBox.confirm(
    `确定要${statusText}用户 "${row.username}" 吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      const res = await toggleUserStatus(row.id, newStatus)
      if (res.code === 200 && res.data) {
        ElMessage.success(`${statusText}成功`)
        row.status = newStatus
      } else {
        ElMessage.error(res.message || `${statusText}失败`)
      }
    } catch (error) {
      console.error(`${statusText}用户失败:`, error)
      ElMessage.error(`${statusText}失败`)
    }
  }).catch(() => {
    // 用户取消操作
  })
}

// 打开编辑对话框
const handleEdit = (row) => {
  dialogType.value = 'edit'
  userForm.value = { ...row }
  dialogVisible.value = true
}

// 提交用户表单
const submitUserForm = async () => {
  userFormRef.value.validate(async (valid) => {
    if (!valid) return
    
    try {
      if (dialogType.value === 'edit') {
        const res = await updateUser(userForm.value.id, userForm.value)
        if (res.code === 200 && res.data) {
          ElMessage.success('更新成功')
          loadUserList()
          dialogVisible.value = false
        } else {
          ElMessage.error(res.message || '更新失败')
        }
      }
    } catch (error) {
      console.error('提交用户表单失败:', error)
      ElMessage.error('操作失败')
    }
  })
}

// 页面加载时获取用户列表
onMounted(() => {
  loadUserList()
})
</script>

<style scoped>
.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style> 