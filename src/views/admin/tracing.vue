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
              <li>全链路追踪</li>
              <li>供应商资质审核</li>
              <li>食品安全追溯</li>
              <li>问题定位分析</li>
              <li>溯源报告生成</li>
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