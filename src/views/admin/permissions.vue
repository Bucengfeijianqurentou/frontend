<template>
  <div class="p-4">
    <el-card class="w-full">
      <template #header>
        <div class="flex items-center">
          <el-icon class="mr-2"><Lock /></el-icon>
          <span>权限管理</span>
        </div>
      </template>
      <div class="text-center py-8">
        <el-empty description="权限管理功能开发中...">
          <template #image>
            <el-icon class="text-6xl text-gray-400"><Lock /></el-icon>
          </template>
          <template #description>
            <p class="text-gray-500">该功能将支持：</p>
            <ul class="text-left text-gray-500 mt-2 list-disc list-inside">
              <li>权限规则配置</li>
              <li>角色权限分配</li>
              <li>权限组管理</li>
              <li>访问控制策略</li>
              <li>权限变更审计</li>
            </ul>
          </template>
        </el-empty>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { Lock } from '@element-plus/icons-vue'
</script> 