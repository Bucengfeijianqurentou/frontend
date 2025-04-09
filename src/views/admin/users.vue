<template>
  <div class="p-4">
    <el-card class="w-full">
      <template #header>
        <div class="flex items-center">
          <el-icon class="mr-2"><UserFilled /></el-icon>
          <span>用户管理</span>
        </div>
      </template>
      <div class="text-center py-8">
        <el-empty description="用户管理功能开发中...">
          <template #image>
            <el-icon class="text-6xl text-gray-400"><UserFilled /></el-icon>
          </template>
          <template #description>
            <p class="text-gray-500">该功能将支持：</p>
            <ul class="text-left text-gray-500 mt-2 list-disc list-inside">
              <li>用户信息管理</li>
              <li>角色分配</li>
              <li>账号状态管理</li>
              <li>用户操作日志</li>
              <li>批量导入导出</li>
            </ul>
          </template>
        </el-empty>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { UserFilled } from '@element-plus/icons-vue'
</script> 