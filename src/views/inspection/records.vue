<template>
  <div class="p-4">
    <el-card class="w-full mb-4">
      <template #header>
        <div class="flex items-center">
          <el-icon class="mr-2 text-blue-500 text-xl"><List /></el-icon>
          <span class="text-lg font-medium">审查记录</span>
        </div>
      </template>

      <!-- 搜索表单 -->
      <div class="mb-4">
        <el-form :inline="true" class="flex items-center flex-wrap gap-2">
          <el-form-item label="开始时间">
            <el-date-picker
              v-model="queryParams.startTime"
              type="datetime"
              placeholder="请选择开始时间"
              value-format="YYYY-MM-DDTHH:mm:ss"
              format="YYYY-MM-DD HH:mm:ss"
              :shortcuts="dateShortcuts"
              clearable
              size="small"
            />
          </el-form-item>
          <el-form-item label="结束时间">
            <el-date-picker
              v-model="queryParams.endTime"
              type="datetime"
              placeholder="请选择结束时间"
              value-format="YYYY-MM-DDTHH:mm:ss"
              format="YYYY-MM-DD HH:mm:ss"
              :shortcuts="dateShortcuts"
              clearable
              size="small"
            />
          </el-form-item>
          <el-form-item label="检查结果">
            <el-select v-model="queryParams.result" placeholder="全部" clearable size="small">
              <el-option label="合格" value="PASS" />
              <el-option label="不合格" value="FAIL" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch" size="small">
              <el-icon class="mr-1"><Search /></el-icon>查询
            </el-button>
            <el-button @click="resetQuery" size="small">
              <el-icon class="mr-1"><Refresh /></el-icon>重置
            </el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 检查记录表格 -->
      <el-table
        :data="inspectionList"
        border
        stripe
        v-loading="loading"
        class="w-full"
        :header-cell-style="{
          background: '#f8fafc',
          color: '#475569',
          fontWeight: 600
        }"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="检查时间" width="160">
          <template #default="{ row }">
            {{ formatDateTime(row.inspectionTime) }}
          </template>
        </el-table-column>
        <el-table-column label="菜单信息" min-width="200">
          <template #default="{ row }">
            <div v-if="row.menu">
              <div>
                <span class="text-gray-500">日期:</span>
                <span class="ml-1">{{ formatDate(row.menu.menuDate) }}</span>
              </div>
              <div>
                <span class="text-gray-500">餐次:</span>
                <el-tag :type="getMealTypeTag(row.menu.mealType)" class="ml-1" size="small">
                  {{ row.menu.mealType }}
                </el-tag>
              </div>
              <div>
                  <span class="text-gray-500">菜品名称：</span>
                  <span>{{ row.menu.dishes }}</span>
              </div>
            </div>
            <span v-else-if="row.menuId" class="text-gray-500">菜单ID: {{ row.menuId }}</span>
            <span v-else class="text-gray-400">无菜单信息</span>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="检查内容" min-width="200" show-overflow-tooltip />
        <el-table-column label="检查结果" width="100">
          <template #default="{ row }">
            <el-tag :type="getResultTag(row.result)" size="small">
              {{ getResultText(row.result) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="issues" label="发现问题" min-width="180" show-overflow-tooltip />
        <el-table-column prop="suggestions" label="整改建议" min-width="180" show-overflow-tooltip />
        <el-table-column label="检查人员" width="120">
          <template #default="{ row }">
            <div>{{ getInspectorName(row) }}</div>
          </template>
        </el-table-column>
        <el-table-column label="监察凭证" width="100">
          <template #default="{ row }">
            <div class="text-center">
              <el-image 
                v-if="row.imagePath" 
                :src="getImageUrl(row.imagePath)" 
                style="width: 50px; height: 50px; border-radius: 4px;"
                fit="cover"
                :preview-src-list="[getImageUrl(row.imagePath)]"
                class="cursor-pointer"
                preview-teleported
              />
              <el-icon v-else class="text-gray-400"><Picture /></el-icon>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleViewDetail(row)">
              <el-icon class="mr-1"><View /></el-icon>详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="flex justify-end mt-4">
        <el-pagination
          :current-page="currentPage"
          :page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          background
        />
      </div>
    </el-card>

    <!-- 检查记录详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="查看审查记录详情"
      width="50%"
      center
      destroy-on-close
      close-on-click-modal
    >
      <el-descriptions border v-loading="detailLoading" :column="1" size="large">
        <el-descriptions-item label="记录ID">{{ currentInspection.id }}</el-descriptions-item>
        <el-descriptions-item label="审查时间">{{ formatDateTime(currentInspection.inspectionTime) }}</el-descriptions-item>
        <el-descriptions-item label="审查人员">
          <div class="whitespace-pre-line">{{ getInspectorDetail(currentInspection) }}</div>
        </el-descriptions-item>
        <el-descriptions-item label="菜单信息">{{ getMenuInfoText(currentInspection) }}</el-descriptions-item>
        <el-descriptions-item label="审查内容">{{ currentInspection.content || '无' }}</el-descriptions-item>
        <el-descriptions-item label="审查结果">
          <el-tag :type="getResultTag(currentInspection.result)" size="large">
            {{ getResultText(currentInspection.result) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="问题发现">{{ currentInspection.issues || '无' }}</el-descriptions-item>
        <el-descriptions-item label="改进建议">{{ currentInspection.suggestions || '无' }}</el-descriptions-item>
        <el-descriptions-item label="交易哈希">
          <div v-if="currentInspection.transactionHash" class="flex flex-col">
            <div class="flex items-center justify-between mb-2">
              <div class="bg-gray-50 p-2 rounded-md text-xs font-mono break-all">
                {{ currentInspection.transactionHash }}
              </div>
              <el-button
                type="primary"
                link
                size="small"
                class="ml-2 flex-shrink-0"
                @click="copyToClipboard(currentInspection.transactionHash)"
              >
                <el-icon class="mr-1"><DocumentCopy /></el-icon>复制
              </el-button>
            </div>
          </div>
          <span v-else class="text-gray-400">无</span>
        </el-descriptions-item>
        <el-descriptions-item label="监察凭证">
          <div v-if="currentInspection.imagePath" class="mt-2">
            <el-image
              :src="getImageUrl(currentInspection.imagePath)"
              style="max-width: 300px; max-height: 200px;"
              fit="contain"
              :preview-src-list="[getImageUrl(currentInspection.imagePath)]"
              preview-teleported
              :initial-index="0"
            />
          </div>
          <span v-else class="text-gray-400">无</span>
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="detailDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, List, Refresh, View, Picture, DocumentCopy } from '@element-plus/icons-vue'
import { useInspectionApi } from '@/api/inspection'
import { useMenuApi } from '@/api/menu'
import { useUserStore } from '@/stores/user'
import { getUserById } from '@/api/user'

const inspectionApi = useInspectionApi()
const menuApi = useMenuApi()
const userStore = useUserStore()

// 表格数据相关
const loading = ref(false)
const inspectionList = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
// 用户缓存，避免重复请求
const userCache = ref({})

// 查询参数
const queryParams = reactive({
  startTime: null,
  endTime: null,
  result: null
})

// 日期快捷选项
const dateShortcuts = [
  {
    text: '今天',
    value: () => {
      const today = new Date()
      return today
    },
  },
  {
    text: '昨天',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24)
      return date
    },
  },
  {
    text: '一周前',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
      return date
    },
  },
]

// 详情对话框相关
const detailDialogVisible = ref(false)
const detailLoading = ref(false)
const currentInspection = ref({})

// 初始化
onMounted(() => {
  fetchInspectionRecords()
})

// 获取检查记录列表
const fetchInspectionRecords = async () => {
  loading.value = true
  try {
    let res

    console.log('开始获取审查记录', {
      时间范围: [queryParams.startTime, queryParams.endTime],
      检查结果: queryParams.result,
      页码: currentPage.value,
      每页数量: pageSize.value
    })
    
    // 如果有查询参数，使用时间范围查询
    if (queryParams.startTime && queryParams.endTime) {
      res = await inspectionApi.getInspectionsByTimeRange(
        queryParams.startTime, 
        queryParams.endTime, 
        currentPage.value, 
        pageSize.value
      )
    } 
    // 如果只有检查结果，按结果查询
    else if (queryParams.result) {
      res = await inspectionApi.getInspectionsByResult(
        queryParams.result,
        currentPage.value, 
        pageSize.value
      )
    }
    // 否则获取全部
    else {
      res = await inspectionApi.getInspections(currentPage.value, pageSize.value)
    }

    console.log('获取审查记录结果', res)
    console.log('响应数据类型:', typeof res)
    console.log('是否为数组:', Array.isArray(res))
    if (res) {
      console.log('响应对象属性:', Object.keys(res))
      if (res.records) {
        console.log('records属性类型:', typeof res.records)
        console.log('records是否为数组:', Array.isArray(res.records))
        console.log('records长度:', res.records.length)
      }
    }
    
    // 处理响应数据
    if (res) {
      // 处理后端返回的不同数据格式
      let records, totalCount;
      
      if (res.code === 200 && res.data) {
        // 标准 Result<Page<T>> 格式
        console.log('处理标准Result<Page<T>>格式')
        records = res.data.records;
        totalCount = res.data.total;
      } else if (Array.isArray(res)) {
        // 直接返回数组格式
        console.log('处理数组格式')
        records = res;
        totalCount = res.length;
      } else if (res.records) {
        // 直接返回Page对象格式
        console.log('处理Page对象格式')
        records = res.records;
        totalCount = res.total || records.length;
      } else {
        console.log('未知响应格式')
        records = [];
        totalCount = 0;
      }
      
      inspectionList.value = records || [];
      total.value = totalCount || 0;
      
      console.log('最终处理的数据:', inspectionList.value);
      console.log('数据项数:', inspectionList.value.length);
      
      // 并行请求：收集所有需要获取的菜单和用户ID
      const menuPromises = [];
      const userPromises = [];
      
      // 为每条记录填充菜单信息（如果没有）
      inspectionList.value
        .filter(item => !item.menu && item.menuId)
        .forEach(item => {
          const promise = fetchMenuInfo(item);
          menuPromises.push(promise);
        });
      
      // 为每条记录填充用户信息（如果没有，且有ID）
      inspectionList.value
        .filter(item => !item.inspectorInfo && item.inspectorId)
        .forEach(item => {
          const promise = fetchUserInfo(item);
          userPromises.push(promise);
        });
      
      // 等待所有请求完成
      if (menuPromises.length > 0 || userPromises.length > 0) {
        await Promise.all([...menuPromises, ...userPromises]);
      }
      
    } else {
      ElMessage.error('获取检查记录失败：无返回数据')
      inspectionList.value = []
      total.value = 0
    }
  } catch (error) {
    console.error('获取检查记录失败:', error)
    ElMessage.error('获取检查记录失败: ' + (error.message || '未知错误'))
    inspectionList.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

// 获取菜单信息的方法
const fetchMenuInfo = async (item) => {
  try {
    console.log(`为记录ID=${item.id}请求菜单信息，菜单ID=${item.menuId}`);
    const menuData = await menuApi.getMenuById(item.menuId);
    const menuInfo = menuData.data || menuData;
    
    if (menuInfo) {
      console.log(`获取到菜单信息:`, menuInfo);
      item.menu = menuInfo;
    } else {
      console.log(`未获取到菜单ID=${item.menuId}的信息`);
      // 设置默认信息
      item.menu = {
        id: item.menuId,
        menuDate: new Date(),
        mealType: '未知餐次'
      }
    }
  } catch (err) {
    console.error(`获取菜单ID=${item.menuId}的信息失败:`, err);
    // 设置默认信息
    item.menu = {
      id: item.menuId,
      menuDate: new Date(),
      mealType: '未知餐次'
    }
  }
}

// 获取用户信息的方法
const fetchUserInfo = async (item) => {
  try {
    // 检查缓存中是否已有该用户信息
    if (userCache.value[item.inspectorId]) {
      item.inspectorInfo = userCache.value[item.inspectorId];
      return;
    }
    
    console.log(`为记录ID=${item.id}请求用户信息，用户ID=${item.inspectorId}`);
    const userData = await getUserById(item.inspectorId);
    const userInfo = userData.data || userData;
    
    if (userInfo) {
      console.log(`获取到用户信息:`, userInfo);
      // 更新缓存
      userCache.value[item.inspectorId] = userInfo;
      // 更新记录
      item.inspectorInfo = userInfo;
    } else {
      console.log(`未获取到用户ID=${item.inspectorId}的信息`);
    }
  } catch (err) {
    console.error(`获取用户ID=${item.inspectorId}的信息失败:`, err);
  }
}

// 查询按钮点击事件
const handleSearch = () => {
  currentPage.value = 1
  fetchInspectionRecords()
}

// 重置查询条件
const resetQuery = () => {
  queryParams.startTime = null
  queryParams.endTime = null
  queryParams.result = null
  currentPage.value = 1
  fetchInspectionRecords()
}

// 分页处理
const handleSizeChange = (size) => {
  pageSize.value = size
  fetchInspectionRecords()
}

const handleCurrentChange = (page) => {
  currentPage.value = page
  fetchInspectionRecords()
}

// 查看详情
const handleViewDetail = async (row) => {
  console.log('查看详情:', row)
  currentInspection.value = { ...row }
  detailDialogVisible.value = true
  
  if (row.id) {
    detailLoading.value = true
    try {
      // 获取检查记录详情
      const res = await inspectionApi.getInspectionById(row.id)
      console.log('获取详情结果:', res)
      
      // 处理不同的响应格式
      if (res && res.code === 200 && res.data) {
        currentInspection.value = { ...currentInspection.value, ...res.data }
      } else if (res && typeof res === 'object' && !res.code) {
        // 直接返回对象
        currentInspection.value = { ...currentInspection.value, ...res }
      }
      
      // 获取关联数据
      const promises = [];
      
      // 如果有菜单ID但没有菜单信息，获取菜单详情
      if (currentInspection.value.menuId && !currentInspection.value.menu) {
        promises.push(
          (async () => {
            try {
              const menuRes = await menuApi.getMenuById(currentInspection.value.menuId);
              const menuInfo = menuRes.data || menuRes;
              
              if (menuInfo) {
                console.log('获取详情菜单信息:', menuInfo);
                currentInspection.value.menu = menuInfo;
              }
            } catch (menuErr) {
              console.error('获取菜单详情失败:', menuErr);
            }
          })()
        );
      }
      
      // 如果有检查人员ID但没有详细信息，获取用户详情
      if (currentInspection.value.inspectorId && !currentInspection.value.inspectorInfo) {
        promises.push(
          (async () => {
            // 检查缓存中是否已有该用户信息
            if (userCache.value[currentInspection.value.inspectorId]) {
              currentInspection.value.inspectorInfo = userCache.value[currentInspection.value.inspectorId];
              return;
            }
            
            try {
              const userRes = await getUserById(currentInspection.value.inspectorId);
              const userInfo = userRes.data || userRes;
              
              if (userInfo) {
                console.log('获取检查人员信息:', userInfo);
                // 更新缓存
                userCache.value[currentInspection.value.inspectorId] = userInfo;
                // 更新当前记录
                currentInspection.value.inspectorInfo = userInfo;
              }
            } catch (userErr) {
              console.error('获取用户详情失败:', userErr);
            }
          })()
        );
      }
      
      // 等待所有请求完成
      if (promises.length > 0) {
        await Promise.all(promises);
      }
      
      console.log('最终详情数据:', currentInspection.value)
    } catch (error) {
      console.error('获取检查记录详情失败:', error)
      ElMessage.error('获取详情失败: ' + (error.message || '未知错误'))
    } finally {
      detailLoading.value = false
    }
  }
}

// 工具函数
const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString()
}

const formatDateTime = (dateTimeStr) => {
  if (!dateTimeStr) return '-'
  return new Date(dateTimeStr).toLocaleString()
}

// 获取餐次标签类型
const getMealTypeTag = (type) => {
  switch (type) {
    case '早餐':
      return 'success'
    case '午餐':
      return 'warning'
    case '晚餐':
      return 'danger'
    default:
      return 'info'
  }
}

// 获取检查结果文本
const getResultText = (result) => {
  if (!result) return '未知'
  
  // 处理对象格式
  if (typeof result === 'object' && result.description) {
    return result.description
  }
  
  // 处理字符串格式
  switch (result) {
    case 'PASS': return '合格'
    case 'FAIL': return '不合格'
    default: return result
  }
}

// 获取检查结果标签类型
const getResultTag = (result) => {
  if (!result) return 'info'
  
  // 处理对象格式
  const resultValue = typeof result === 'object' ? result.name : result
  
  switch (resultValue) {
    case 'PASS': return 'success'
    case 'FAIL': return 'danger'
    default: return 'info'
  }
}

// 获取菜单信息文本，从后端返回的记录中提取
const getMenuInfoText = (record) => {
  if (record.menu) {
    const mealTypeText = record.menu.mealType || '';
    const menuItems = record.menu.menuItems && record.menu.menuItems.length 
      ? `(包含${record.menu.menuItems.length}个菜品)` 
      : '';
    
    return `${formatDate(record.menu.menuDate)} ${mealTypeText} ${menuItems}`;
  } else if (record.menuId) {
    return `菜单ID: ${record.menuId}`;
  } else {
    return '无菜单信息';
  }
}

// 直接获取检查人员信息
const getInspectorName = (record) => {
  // 优先使用已获取的用户信息
  if (record.inspectorInfo) {
    const user = record.inspectorInfo;
    // 优先显示真实姓名，其次显示用户名
    return user.realName || user.username || `ID: ${record.inspectorId}`;
  } else if (record.inspectorName) {
    return record.inspectorName;
  } else if (record.inspectorId) {
    return `ID: ${record.inspectorId}`;
  } else {
    return '未知';
  }
}

// 获取检查人员详细信息
const getInspectorDetail = (record) => {
  if (!record.inspectorInfo) {
    return getInspectorName(record);
  }
  
  const user = record.inspectorInfo;
  let details = [];
  
  if (user.realName || user.username) {
    details.push(user.realName || user.username);
  }
  
  if (user.phone) {
    details.push(`电话: ${user.phone}`);
  }
  
  if (user.email) {
    details.push(`邮箱: ${user.email}`);
  }
  
  if (user.department) {
    details.push(`部门: ${user.department}`);
  }
  
  if (user.role) {
    let roleName = typeof user.role === 'object' ? user.role.name : user.role;
    details.push(`角色: ${roleName}`);
  }
  
  return details.length > 0 ? details.join('\n') : `ID: ${record.inspectorId}`;
}

// 获取图片URL
const getImageUrl = (path) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${import.meta.env.VITE_API_BASE_URL}${path}`
}

// 复制交易哈希到剪贴板
const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).then(() => {
    ElMessage.success('交易哈希已复制到剪贴板')
  }).catch(() => {
    ElMessage.error('复制失败，请手动复制')
  })
}
</script>

<style scoped>
.whitespace-pre-line {
  white-space: pre-line;
}
</style> 