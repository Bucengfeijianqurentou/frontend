<template>
  <div class="p-4">
    <el-card class="w-full">
      <template #header>
        <div class="flex items-center">
          <el-icon class="mr-2"><DataLine /></el-icon>
          <span>数据分析</span>
        </div>
      </template>
      <div class="text-center py-8">
        <el-empty description="数据分析功能开发中...">
          <template #image>
            <el-icon class="text-6xl text-gray-400"><DataLine /></el-icon>
          </template>
          <template #description>
            <p class="text-gray-500">该功能将支持：</p>
            <ul class="text-left text-gray-500 mt-2 list-disc list-inside">
              <li>全局数据统计</li>
              <li>食品安全趋势</li>
              <li>用户行为分析</li>
              <li>系统性能监控</li>
              <li>业务数据报表</li>
            </ul>
          </template>
        </el-empty>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { DataLine } from '@element-plus/icons-vue'
</script> 