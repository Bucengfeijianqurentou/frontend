<template>
  <div class="p-4">
    <el-card class="w-full">
      <template #header>
        <div class="flex items-center">
          <el-icon class="mr-2"><Search /></el-icon>
          <span>监管检查</span>
        </div>
      </template>
      <div class="text-center py-8">
        <el-empty description="监管检查功能开发中...">
          <template #image>
            <el-icon class="text-6xl text-gray-400"><Search /></el-icon>
          </template>
          <template #description>
            <p class="text-gray-500">该功能将支持：</p>
            <ul class="text-left text-gray-500 mt-2 list-disc list-inside">
              <li>日常检查记录</li>
              <li>食品安全检查</li>
              <li>卫生状况评估</li>
              <li>整改通知管理</li>
            </ul>
          </template>
        </el-empty>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { Search } from '@element-plus/icons-vue'
</script> 