<template>
  <div class="p-4">
    <el-card class="w-full">
      <template #header>
        <div class="flex items-center">
          <el-icon class="mr-2"><Link /></el-icon>
          <span>溯源查询</span>
        </div>
      </template>
      <div class="text-center py-8">
        <el-empty description="溯源查询功能开发中...">
          <template #image>
            <el-icon class="text-6xl text-gray-400"><Link /></el-icon>
          </template>
          <template #description>
            <p class="text-gray-500">该功能将支持：</p>
            <ul class="text-left text-gray-500 mt-2 list-disc list-inside">
              <li>食材来源追溯</li>
              <li>供应商资质查询</li>
              <li>加工流程追踪</li>
              <li>配送记录查询</li>
            </ul>
          </template>
        </el-empty>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { Link } from '@element-plus/icons-vue'
</script> 