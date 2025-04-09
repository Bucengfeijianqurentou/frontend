<template>
  <div class="p-4">
    <el-card class="w-full">
      <template #header>
        <div class="flex items-center">
          <el-icon class="mr-2"><KnifeFork /></el-icon>
          <span>食品加工</span>
        </div>
      </template>
      <div class="text-center py-8">
        <el-empty description="食品加工管理功能开发中...">
          <template #image>
            <el-icon class="text-6xl text-gray-400"><KnifeFork /></el-icon>
          </template>
        </el-empty>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { KnifeFork } from '@element-plus/icons-vue'
</script> 