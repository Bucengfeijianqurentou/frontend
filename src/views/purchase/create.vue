<template>
  <div class="p-4">
    <el-card class="w-full">
      <template #header>
        <div class="flex items-center">
          <el-icon class="mr-2"><ShoppingCart /></el-icon>
          <span>新建采购单</span>
        </div>
      </template>
      <div class="text-center py-8">
        <el-empty description="采购单功能开发中...">
          <template #image>
            <el-icon class="text-6xl text-gray-400"><ShoppingCart /></el-icon>
          </template>
        </el-empty>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ShoppingCart } from '@element-plus/icons-vue'
</script> 