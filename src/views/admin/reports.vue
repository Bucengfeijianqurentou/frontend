<template>
  <div class="p-4">
    <el-card class="w-full">
      <template #header>
        <div class="flex items-center">
          <el-icon class="mr-2"><Document /></el-icon>
          <span>报表生成</span>
        </div>
      </template>
      <div class="text-center py-8">
        <el-empty description="报表生成功能开发中...">
          <template #image>
            <el-icon class="text-6xl text-gray-400"><Document /></el-icon>
          </template>
          <template #description>
            <p class="text-gray-500">该功能将支持：</p>
            <ul class="text-left text-gray-500 mt-2 list-disc list-inside">
              <li>自定义报表模板</li>
              <li>数据导出配置</li>
              <li>定时报表生成</li>
              <li>多格式导出</li>
              <li>报表分发管理</li>
            </ul>
          </template>
        </el-empty>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { Document } from '@element-plus/icons-vue'
</script> 