<template>
  <div class="p-4">
    <el-card class="w-full">
      <template #header>
        <div class="flex items-center">
          <el-icon class="mr-2"><List /></el-icon>
          <span>采购记录</span>
        </div>
      </template>
      <div class="text-center py-8">
        <el-empty description="采购记录功能开发中...">
          <template #image>
            <el-icon class="text-6xl text-gray-400"><List /></el-icon>
          </template>
        </el-empty>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { List } from '@element-plus/icons-vue'
</script> 