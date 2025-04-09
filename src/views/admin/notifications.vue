<template>
  <div class="p-4">
    <el-card class="w-full">
      <template #header>
        <div class="flex items-center">
          <el-icon class="mr-2"><Bell /></el-icon>
          <span>通知管理</span>
        </div>
      </template>
      <div class="text-center py-8">
        <el-empty description="通知管理功能开发中...">
          <template #image>
            <el-icon class="text-6xl text-gray-400"><Bell /></el-icon>
          </template>
          <template #description>
            <p class="text-gray-500">该功能将支持：</p>
            <ul class="text-left text-gray-500 mt-2 list-disc list-inside">
              <li>系统公告发布</li>
              <li>消息模板管理</li>
              <li>定时通知设置</li>
              <li>通知发送记录</li>
              <li>消息推送配置</li>
            </ul>
          </template>
        </el-empty>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { Bell } from '@element-plus/icons-vue'
</script> 