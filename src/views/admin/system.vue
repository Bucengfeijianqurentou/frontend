<template>
  <div class="p-4">
    <el-card class="w-full">
      <template #header>
        <div class="flex items-center">
          <el-icon class="mr-2"><Monitor /></el-icon>
          <span>系统监控</span>
        </div>
      </template>
      <div class="text-center py-8">
        <el-empty description="系统监控功能开发中...">
          <template #image>
            <el-icon class="text-6xl text-gray-400"><Monitor /></el-icon>
          </template>
          <template #description>
            <p class="text-gray-500">该功能将支持：</p>
            <ul class="text-left text-gray-500 mt-2 list-disc list-inside">
              <li>服务器状态监控</li>
              <li>系统性能分析</li>
              <li>访问日志记录</li>
              <li>异常情况报警</li>
              <li>实时数据监测</li>
            </ul>
          </template>
        </el-empty>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { Monitor } from '@element-plus/icons-vue'
</script> 