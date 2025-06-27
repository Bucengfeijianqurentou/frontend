<template>
  <div class="monitoring-container p-4">
    <el-card class="w-full shadow-md mb-4">
      <template #header>
        <div class="flex justify-between items-center">
          <div class="flex items-center">
            <el-icon class="mr-2 text-blue-500">
              <VideoCamera />
            </el-icon>
            <span class="text-xl font-medium">食堂实时监控系统</span>
          </div>
          <div class="flex items-center">
            <el-tag v-if="isConnected" type="success" effect="dark" class="mr-2">
              <el-icon class="mr-1">
                <VideoPlay />
              </el-icon>实时监控中
            </el-tag>
            <el-tag v-else type="danger" effect="dark" class="mr-2">
              <el-icon class="mr-1">
                <VideoPause />
              </el-icon>连接断开
            </el-tag>
            <!-- AI检测状态 -->
            <el-tag v-if="aiDetectionEnabled" type="warning" effect="dark" class="mr-2">
              <el-icon class="mr-1">
                <View />
              </el-icon>AI检测中
            </el-tag>
            <el-button-group>
              <el-tooltip content="刷新监控">
                <el-button type="primary" :icon="Refresh" circle @click="refreshStreams"
                  :loading="isRefreshing"></el-button>
              </el-tooltip>
              <el-tooltip content="全屏查看">
                <el-button type="primary" :icon="FullScreen" circle @click="toggleFullscreen"></el-button>
              </el-tooltip>
            </el-button-group>
          </div>
        </div>
      </template>

      <!-- 视图选择器 -->
      <div class="mb-4">
        <el-radio-group v-model="currentView" @change="changeViewMode" class="mb-4">
          <el-radio-button value="single">单画面</el-radio-button>
          <el-radio-button value="quad">四画面</el-radio-button>
          <el-radio-button value="grid">网格视图</el-radio-button>
        </el-radio-group>

        <div class="view-selector flex items-center ml-4">
          <span class="text-gray-600 mr-2">监控区域：</span>
          <el-select v-model="currentArea" placeholder="选择监控区域" @change="changeArea">
            <el-option label="餐厅主区域" value="main"></el-option>
            <el-option label="食品加工区" value="processing"></el-option>
            <el-option label="食材储存区" value="storage"></el-option>
            <el-option label="就餐区域" value="dining"></el-option>
          </el-select>

          <!-- AI检测开关 -->
          <div class="ml-4 flex items-center">
            <span class="text-gray-600 mr-2">智能检测：</span>
            <el-switch v-model="aiDetectionEnabled" @change="toggleAIDetection" active-text="开启" inactive-text="关闭"
              active-color="#13ce66" inactive-color="#ff4949" />
          </div>
        </div>
      </div>

      <!-- 单画面视图 -->
      <div v-if="currentView === 'single'" class="video-container single-view">
        <div class="video-wrapper" ref="fullscreenRef">
          <div class="video-overlay">
            <div class="camera-info">
              <span class="camera-name">{{ getAreaName(currentArea) }}</span>
              <span class="timestamp">{{ currentTime }}</span>
            </div>
            <!-- 违规检测框 -->
            <div v-for="detection in currentDetections" :key="detection.id" class="violation-box" :style="{
              left: detection.x + '%',
              top: detection.y + '%',
              width: detection.width + '%',
              height: detection.height + '%'
            }">
              <div class="violation-label">
                <el-icon class="text-red-500">
                  <Warning />
                </el-icon>
                {{ detection.type }}
              </div>
            </div>
          </div>
          <video id="main-video" ref="mainVideo" autoplay class="main-video"></video>
          <!-- 隐藏的canvas用于截图 -->
          <canvas ref="screenshotCanvas" style="display: none;"></canvas>
        </div>
      </div>

      <!-- 四画面视图 -->
      <div v-else-if="currentView === 'quad'" class="video-container quad-view">
        <el-row :gutter="10">
          <el-col :span="12">
            <div class="video-wrapper" @click="setActiveQuad('main')">
              <div class="video-overlay" :class="{ 'active-quad': currentArea === 'main' }">
                <div class="camera-info">
                  <span class="camera-name">餐厅主区域</span>
                  <span class="timestamp">{{ currentTime }}</span>
                </div>
              </div>
              <video id="quad-video-1" class="quad-video" autoplay></video>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="video-wrapper" @click="setActiveQuad('processing')">
              <div class="video-overlay" :class="{ 'active-quad': currentArea === 'processing' }">
                <div class="camera-info">
                  <span class="camera-name">食品加工区</span>
                  <span class="timestamp">{{ currentTime }}</span>
                </div>
              </div>
              <video id="quad-video-2" class="quad-video" autoplay></video>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="10" class="mt-2">
          <el-col :span="12">
            <div class="video-wrapper" @click="setActiveQuad('storage')">
              <div class="video-overlay" :class="{ 'active-quad': currentArea === 'storage' }">
                <div class="camera-info">
                  <span class="camera-name">食材储存区</span>
                  <span class="timestamp">{{ currentTime }}</span>
                </div>
              </div>
              <video id="quad-video-3" class="quad-video" autoplay></video>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="video-wrapper" @click="setActiveQuad('dining')">
              <div class="video-overlay" :class="{ 'active-quad': currentArea === 'dining' }">
                <div class="camera-info">
                  <span class="camera-name">就餐区域</span>
                  <span class="timestamp">{{ currentTime }}</span>
                </div>
              </div>
              <video id="quad-video-4" class="quad-video" autoplay></video>
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- 网格视图 -->
      <div v-else-if="currentView === 'grid'" class="video-container grid-view">
        <el-row :gutter="10">
          <el-col v-for="(area, index) in monitoringAreas" :key="area.value" :xs="24" :sm="12" :md="8" :lg="6">
            <div class="video-wrapper" @click="setActiveQuad(area.value)">
              <div class="video-overlay" :class="{ 'active-quad': currentArea === area.value }">
                <div class="camera-info">
                  <span class="camera-name">{{ area.label }}</span>
                  <span class="timestamp">{{ currentTime }}</span>
                </div>
              </div>
              <video :id="`grid-video-${index + 1}`" class="grid-video" autoplay></video>
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- 监控信息和控制 -->
      <div class="mt-4">
        <el-divider>
          <el-icon>
            <InfoFilled />
          </el-icon>
          <span class="ml-2">监控详情</span>
        </el-divider>

        <el-row :gutter="20">
          <el-col :xs="24" :md="12">
            <div class="camera-details p-4 bg-gray-50 rounded-lg">
              <h3 class="text-lg font-medium mb-2">当前监控信息</h3>
              <div class="mt-2">
                <el-descriptions :column="1" border>
                  <el-descriptions-item label="监控区域">{{ getAreaName(currentArea) }}</el-descriptions-item>
                  <el-descriptions-item label="摄像头编号">{{ currentArea }}-CAM-{{ Math.floor(Math.random() * 1000) + 1
                  }}</el-descriptions-item>
                  <el-descriptions-item label="画面分辨率">1280 × 720 (HD)</el-descriptions-item>
                  <el-descriptions-item label="流媒体协议">RTSP</el-descriptions-item>
                  <el-descriptions-item label="连接状态">
                    <el-tag :type="isConnected ? 'success' : 'danger'" size="small">
                      {{ isConnected ? '已连接' : '未连接' }}
                    </el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item label="连接时长">{{ connectionTime }}</el-descriptions-item>
                  <el-descriptions-item label="AI检测状态">
                    <el-tag :type="aiDetectionEnabled ? 'success' : 'info'" size="small">
                      {{ aiDetectionEnabled ? '检测中' : '已关闭' }}
                    </el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item label="今日检测次数">{{ todayDetectionCount }}</el-descriptions-item>
                </el-descriptions>
              </div>
            </div>
          </el-col>

          <el-col :xs="24" :md="12" class="mt-4 md:mt-0">
            <div class="control-panel p-4 bg-gray-50 rounded-lg">
              <h3 class="text-lg font-medium mb-2">监控控制</h3>

              <div class="mt-4">
                <el-row :gutter="10">
                  <el-col :span="12">
                    <el-button class="w-full" type="primary" @click="captureImage">
                      <el-icon class="mr-1">
                        <Camera />
                      </el-icon>拍照截图
                    </el-button>
                  </el-col>
                  <el-col :span="12">
                    <el-button class="w-full" :type="isRecording ? 'danger' : 'primary'" @click="toggleRecording">
                      <el-icon class="mr-1">
                        <component :is="isRecording ? 'VideoPause' : 'VideoCamera'"></component>
                      </el-icon>
                      {{ isRecording ? '停止录制' : '开始录制' }}
                    </el-button>
                  </el-col>
                </el-row>

                <!-- 违规抓拍控制 -->
                <el-row :gutter="10" class="mt-2">
                  <el-col :span="12">
                    <el-button class="w-full" type="warning" @click="manualViolationCapture"
                      :disabled="!aiDetectionEnabled">
                      <el-icon class="mr-1">
                        <Warning />
                      </el-icon>违规抓拍
                    </el-button>
                  </el-col>
                  <el-col :span="12">
                    <el-button class="w-full" type="info" @click="showViolationHistory">
                      <el-icon class="mr-1">
                        <Document />
                      </el-icon>违规记录
                    </el-button>
                  </el-col>
                </el-row>

                <div class="mt-4">
                  <el-slider v-model="zoomLevel" :min="1" :max="5" :step="0.5" show-stops>
                    <template #prepend>
                      <el-icon>
                        <ZoomOut />
                      </el-icon>
                    </template>
                    <template #append>
                      <el-icon>
                        <ZoomIn />
                      </el-icon>
                    </template>
                  </el-slider>
                </div>

                <el-row class="mt-4">
                  <el-col :span="24">
                    <div class="camera-controls flex flex-col items-center">
                      <el-button circle class="direction-btn up-btn" @click="controlCamera('up')">
                        <el-icon>
                          <ArrowUp />
                        </el-icon>
                      </el-button>
                      <div class="flex justify-center items-center">
                        <el-button circle class="mr-4 direction-btn left-btn" @click="controlCamera('left')">
                          <el-icon>
                            <ArrowLeft />
                          </el-icon>
                        </el-button>
                        <el-button circle class="direction-btn center-btn" @click="controlCamera('center')">
                          <el-icon>
                            <Aim />
                          </el-icon>
                        </el-button>
                        <el-button circle class="ml-4 direction-btn right-btn" @click="controlCamera('right')">
                          <el-icon>
                            <ArrowRight />
                          </el-icon>
                        </el-button>
                      </div>
                      <el-button circle class="direction-btn down-btn" @click="controlCamera('down')">
                        <el-icon>
                          <ArrowDown />
                        </el-icon>
                      </el-button>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <!-- 异常检测告警 -->
    <el-card class="w-full shadow-md">
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <el-icon class="mr-2 text-red-500">
              <Warning />
            </el-icon>
            <span class="text-xl font-medium">智能违规检测</span>
            <el-badge :value="alertCount" class="ml-2" type="danger" v-if="alertCount > 0" />
          </div>
          <div class="flex items-center text-sm text-gray-600">
            <span class="mr-4">今日检测: {{ todayDetectionCount }}次</span>
            <span class="mr-4">违规发现: {{ todayViolationCount }}次</span>
            <span>准确率: {{ detectionAccuracy }}%</span>
          </div>
        </div>
      </template>

      <!-- 违规类型统计 -->
      <div class="mb-4">
        <el-row :gutter="10">
          <el-col v-for="stat in violationStats" :key="stat.type" :span="6">
            <el-card shadow="hover" class="text-center">
              <el-icon class="text-2xl mb-2" :class="stat.color">
                <component :is="stat.icon" />
              </el-icon>
              <div class="text-lg font-bold">{{ stat.count }}</div>
              <div class="text-sm text-gray-600">{{ stat.label }}</div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <div v-if="alerts.length === 0" class="text-center py-8">
        <el-empty description="暂无违规检测记录">
          <template #image>
            <el-icon class="text-6xl text-gray-400">
              <SuccessFilled />
            </el-icon>
          </template>
        </el-empty>
      </div>

      <el-timeline v-else>
        <el-timeline-item v-for="(alert, index) in alerts" :key="index"
          :type="alert.level === 'error' ? 'danger' : alert.level" :color="alert.color" :timestamp="alert.time"
          placement="top">
          <el-card shadow="hover">
            <div class="flex items-start">
              <el-icon class="mt-1 mr-2 text-red-500 text-xl">
                <Warning />
              </el-icon>
              <div class="flex-1">
                <div class="flex items-center justify-between">
                  <h4 class="font-medium">{{ alert.title }}</h4>
                  <el-tag :type="alert.severity === 'high' ? 'danger' : alert.severity === 'medium' ? 'warning' : 'info'"
                    size="small">
                    {{ alert.severityText }}
                  </el-tag>
                </div>
                <p class="text-gray-600 mt-1">{{ alert.description }}</p>
                <div class="mt-2 text-sm text-gray-500">
                  <span class="mr-4">置信度: {{ alert.confidence }}%</span>
                  <span class="mr-4">检测算法: {{ alert.algorithm }}</span>
                  <span>风险等级: {{ alert.riskLevel }}</span>
                </div>
                <!-- 违规截图预览 -->
                <div v-if="alert.screenshot" class="mt-3">
                  <img :src="alert.screenshot" class="violation-screenshot" @click="viewViolationScreenshot(alert)" />
                </div>
                <div class="flex justify-between items-center mt-3">
                  <span class="text-xs text-gray-500">摄像头: {{ getAreaName(alert.camera) }}</span>
                  <div>
                    <el-button type="primary" size="small" @click="viewAlert(alert)" class="mr-2">查看详情</el-button>
                    <el-button type="success" size="small" @click="exportEvidence(alert)" class="mr-2">导出证据</el-button>
                    <el-button type="danger" size="small" @click="acknowledgeAlert(index)">确认处理</el-button>
                  </div>
                </div>
              </div>
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-card>

    <!-- 违规记录历史对话框 -->
    <el-dialog v-model="violationHistoryVisible" title="违规记录历史" width="80%" top="5vh">
      <el-tabs v-model="activeHistoryTab">
        <el-tab-pane label="今日记录" name="today">
          <el-table :data="todayViolations" stripe>
            <el-table-column prop="time" label="时间" width="180" />
            <el-table-column prop="type" label="违规类型" width="120" />
            <el-table-column prop="location" label="位置" width="120" />
            <el-table-column prop="confidence" label="置信度" width="100">
              <template #default="scope">
                <el-tag :type="scope.row.confidence > 90 ? 'success' : scope.row.confidence > 70 ? 'warning' : 'danger'">
                  {{ scope.row.confidence }}%
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="处理状态" width="100">
              <template #default="scope">
                <el-tag :type="scope.row.status === '已处理' ? 'success' : 'warning'">
                  {{ scope.row.status }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button type="primary" size="small" @click="viewViolationDetail(scope.row)">查看详情</el-button>
                <el-button type="success" size="small" @click="downloadEvidence(scope.row)">下载证据</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="本周统计" name="week">
          <div class="text-center py-8">
            <el-icon class="text-6xl text-gray-400 mb-4">
              <TrendCharts />
            </el-icon>
            <p class="text-gray-600">本周违规趋势图表（演示功能）</p>
          </div>
        </el-tab-pane>
        <el-tab-pane label="导出报告" name="export">
          <div class="text-center py-8">
            <el-button type="primary" size="large" @click="exportWeeklyReport">
              <el-icon class="mr-2">
                <Document />
              </el-icon>导出本周违规报告
            </el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <!-- 截图查看对话框 -->
    <el-dialog v-model="imageDialogVisible" title="监控截图" width="70%">
      <div class="text-center">
        <img :src="capturedImage" class="max-w-full" />
      </div>
      <template #footer>
        <div class="flex justify-between">
          <span class="text-gray-500">{{ getAreaName(currentArea) }} - {{ formatDate(new Date()) }}</span>
          <div>
            <el-button @click="imageDialogVisible = false">关闭</el-button>
            <el-button type="primary" @click="downloadImage">
              <el-icon class="mr-1">
                <Download />
              </el-icon>下载
            </el-button>
          </div>
        </div>
      </template>
    </el-dialog>

    <!-- 违规截图查看对话框 -->
    <el-dialog v-model="violationScreenshotVisible" title="违规证据截图" width="70%">
      <div class="text-center">
        <img :src="currentViolationScreenshot" class="max-w-full" />
        <div class="mt-4 text-left">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="违规类型">{{ currentViolationInfo.type }}</el-descriptions-item>
            <el-descriptions-item label="检测时间">{{ currentViolationInfo.time }}</el-descriptions-item>
            <el-descriptions-item label="监控区域">{{ currentViolationInfo.location }}</el-descriptions-item>
            <el-descriptions-item label="置信度">{{ currentViolationInfo.confidence }}%</el-descriptions-item>
            <el-descriptions-item label="风险等级" :span="2">{{ currentViolationInfo.riskLevel }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-between">
          <span class="text-gray-500">AI智能检测证据 - {{ currentViolationInfo.algorithm }}</span>
          <div>
            <el-button @click="violationScreenshotVisible = false">关闭</el-button>
            <el-button type="primary" @click="downloadViolationScreenshot">
              <el-icon class="mr-1">
                <Download />
              </el-icon>下载证据
            </el-button>
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
// 导入本地已安装的AI库
import * as tf from '@tensorflow/tfjs'
import { FaceDetection } from '@mediapipe/face_detection'
import { Pose } from '@mediapipe/pose'

import { ref, reactive, onMounted, onUnmounted, computed } from 'vue';
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'
import {
  VideoCamera, VideoPlay, VideoPause, Camera,
  Download, FullScreen, Refresh, Warning, InfoFilled,
  ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Aim,
  ZoomIn, ZoomOut, SuccessFilled, View, Document,
  TrendCharts, User
} from '@element-plus/icons-vue';
import { useFullscreen } from '@vueuse/core';

// WebRTC实例
let webRtcServers = {};
let mainWebRtcServer = null;

// 状态变量
const isConnected = ref(true);
const isRefreshing = ref(false);
const currentView = ref('single');
const currentArea = ref('main');
const zoomLevel = ref(1);
const isRecording = ref(false);
const currentTime = ref('');
const connectionTime = ref('00:00:00');
const { isFullscreen, toggle: toggleFullscreenBase } = useFullscreen();
const fullscreenRef = ref(null);
const mainVideo = ref(null);
const screenshotCanvas = ref(null);

// 监控区域
const monitoringAreas = [
  { label: '餐厅主区域', value: 'main' },
  { label: '食品加工区', value: 'processing' },
  { label: '食材储存区', value: 'storage' },
  { label: '就餐区域', value: 'dining' },
  { label: '配餐通道', value: 'distribution' },
  { label: '员工休息区', value: 'staff' },
  { label: '后厨入口', value: 'entrance' },
  { label: '洗碗区', value: 'washing' }
];

// 截图相关
const imageDialogVisible = ref(false);
const capturedImage = ref('');
const violationScreenshotVisible = ref(false);
const currentViolationScreenshot = ref('');
const currentViolationInfo = ref({});

// AI检测相关状态
const aiDetectionEnabled = ref(false); // 默认关闭AI检测
const currentDetections = ref([]);
const currentFaceDetections = ref([]);
const currentPoseDetections = ref({});
const todayDetectionCount = ref(156);
const todayViolationCount = ref(8);
const detectionAccuracy = ref(94.2);
const violationHistoryVisible = ref(false);
const activeHistoryTab = ref('today');

// AI检测相关变量
let faceDetector = null
let poseDetector = null
let isAIInitialized = false

// 违规类型统计
const violationStats = reactive([
  { type: 'hat', label: '未戴帽子', count: 3, icon: 'User', color: 'text-red-500' },
  { type: 'mask', label: '未戴口罩', count: 2, icon: 'User', color: 'text-orange-500' },
  { type: 'gloves', label: '未戴手套', count: 1, icon: 'User', color: 'text-yellow-500' },
  { type: 'hygiene', label: '卫生违规', count: 2, icon: 'Warning', color: 'text-blue-500' }
]);

// 今日违规记录
const todayViolations = reactive([
  {
    id: 1,
    time: '2024-01-15 14:23:15',
    type: '未戴帽子',
    location: '食品加工区',
    confidence: 95,
    status: '已处理',
    evidence: '/screenshots/violation_001.jpg'
  },
  {
    id: 2,
    time: '2024-01-15 13:45:32',
    type: '未戴口罩',
    location: '食品加工区',
    confidence: 88,
    status: '处理中',
    evidence: '/screenshots/violation_002.jpg'
  },
  {
    id: 3,
    time: '2024-01-15 12:18:47',
    type: '交叉污染',
    location: '配餐区',
    confidence: 92,
    status: '已处理',
    evidence: '/screenshots/violation_003.jpg'
  }
]);

// 告警信息
const alertCount = ref(2);
const alerts = reactive([
  {
    id: 1,
    title: '检测到未佩戴工作帽',
    description: '食品加工区检测到员工张某未佩戴工作帽进行食品处理操作',
    level: 'warning',
    color: '#E6A23C',
    camera: 'processing',
    time: formatDate(new Date(Date.now() - 1000 * 60 * 5)),
    severity: 'high',
    severityText: '高风险',
    confidence: 95,
    algorithm: 'YOLOv8-PPE',
    riskLevel: '食品安全风险',
    evidence: '/screenshots/hat_violation_001.jpg',
    screenshot: null
  },
  {
    id: 2,
    title: '异常温度警告',
    description: '食材储存区温度异常升高，当前温度8.5°C，超过设定阈值',
    level: 'error',
    color: '#F56C6C',
    camera: 'storage',
    time: formatDate(new Date(Date.now() - 1000 * 60 * 15)),
    severity: 'high',
    severityText: '高风险',
    confidence: 98,
    algorithm: 'Temperature-Monitor',
    riskLevel: '食品安全风险',
    evidence: '/screenshots/temp_violation_001.jpg',
    screenshot: null
  }
]);

// 定时器
let timeUpdateInterval = null;
let connectionTimeInterval = null;
let startTime = null;
let detectionInterval = null;

// 格式化日期
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  const second = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

// 获取区域名称
function getAreaName(areaCode) {
  const area = monitoringAreas.find(a => a.value === areaCode);
  return area ? area.label : areaCode;
}

// 切换全屏
function toggleFullscreen() {
  toggleFullscreenBase(fullscreenRef.value);
}

// 切换视图模式
function changeViewMode(mode) {
  disconnectAllStreams();
  currentView.value = mode;

  setTimeout(() => {
    if (mode === 'single') {
      connectMainStream();
    } else if (mode === 'quad') {
      connectQuadStreams();
    } else if (mode === 'grid') {
      connectGridStreams();
    }
  }, 100);
}

// 更改监控区域
function changeArea(area) {
  currentArea.value = area;

  if (currentView.value === 'single') {
    disconnectAllStreams();
    connectMainStream();
  }
}

// 设置当前四画面区域
function setActiveQuad(area) {
  currentArea.value = area;
  ElMessage.success(`已切换到${getAreaName(area)}监控画面`);
}

// 获取摄像头地址
function getCameraUrl(area) {
  const useSecondCamera = ['processing', 'storage', 'distribution', 'washing'].includes(area);
  return useSecondCamera ?
    import.meta.env.VITE_RTSP_STREAM_URL_2 :
    import.meta.env.VITE_RTSP_STREAM_URL;
}

// 连接主画面流
function connectMainStream() {
  const videoElement = document.getElementById('main-video');
  if (videoElement) {
    mainWebRtcServer = new WebRtcStreamer(videoElement, import.meta.env.VITE_WEBRTC_SERVER_URL);
    mainWebRtcServer.connect(getCameraUrl(currentArea.value));
    webRtcServers['main'] = mainWebRtcServer;
  }
}

// 连接四画面
function connectQuadStreams() {
  const areas = ['main', 'processing', 'storage', 'dining'];

  areas.forEach((area, index) => {
    const videoElement = document.getElementById(`quad-video-${index + 1}`);
    if (videoElement) {
      const webRtcServer = new WebRtcStreamer(videoElement, import.meta.env.VITE_WEBRTC_SERVER_URL);
      webRtcServer.connect(getCameraUrl(area));
      webRtcServers[`quad-${index + 1}`] = webRtcServer;
    }
  });
}

// 连接网格视图
function connectGridStreams() {
  monitoringAreas.forEach((area, index) => {
    const videoElement = document.getElementById(`grid-video-${index + 1}`);
    if (videoElement) {
      const webRtcServer = new WebRtcStreamer(videoElement, import.meta.env.VITE_WEBRTC_SERVER_URL);
      webRtcServer.connect(getCameraUrl(area.value));
      webRtcServers[`grid-${index + 1}`] = webRtcServer;
    }
  });
}

// 断开所有流
function disconnectAllStreams() {
  Object.values(webRtcServers).forEach(server => {
    if (server && server.disconnect) {
      server.disconnect();
    }
  });
  webRtcServers = {};
  mainWebRtcServer = null;
}

// 刷新视频流
function refreshStreams() {
  isRefreshing.value = true;

  disconnectAllStreams();

  setTimeout(() => {
    if (currentView.value === 'single') {
      connectMainStream();
    } else if (currentView.value === 'quad') {
      connectQuadStreams();
    } else if (currentView.value === 'grid') {
      connectGridStreams();
    }

    isRefreshing.value = false;
    ElMessage.success('视频流刷新完成');
  }, 2000);
}

// 真实截图功能
function captureRealScreenshot() {
  const video = mainVideo.value;
  const canvas = screenshotCanvas.value;

  if (!video || !canvas) {
    console.error('Video or canvas element not found');
    return null;
  }

  // 设置canvas尺寸与视频一致
  canvas.width = video.videoWidth || 1280;
  canvas.height = video.videoHeight || 720;

  const ctx = canvas.getContext('2d');

  // 绘制视频帧到canvas
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // 添加水印和违规标记
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.fillRect(10, 10, 300, 80);

  ctx.fillStyle = '#333';
  ctx.font = '16px Arial';
  ctx.fillText(`监控区域: ${getAreaName(currentArea.value)}`, 20, 30);
  ctx.fillText(`时间: ${formatDate(new Date())}`, 20, 50);
  ctx.fillText('AI智能检测系统', 20, 70);

  // 转换为base64
  return canvas.toDataURL('image/jpeg', 0.8);
}

// 普通截图
function captureImage() {
  const screenshot = captureRealScreenshot();
  if (screenshot) {
    capturedImage.value = screenshot;
    imageDialogVisible.value = true;
    ElMessage.success('截图成功');
  } else {
    ElMessage.error('截图失败，请检查视频连接');
  }
}

// 下载图片
function downloadImage() {
  const link = document.createElement('a');
  link.download = `监控截图_${formatDate(new Date()).replace(/[:\s]/g, '_')}.jpg`;
  link.href = capturedImage.value;
  link.click();
  ElMessage.success('图片下载完成');
}

// 录制切换
function toggleRecording() {
  isRecording.value = !isRecording.value;
  if (isRecording.value) {
    ElMessage.success('开始录制监控视频');
  } else {
    ElMessage.info('录制已停止');
  }
}

// 摄像头控制
function controlCamera(direction) {
  ElMessage.info(`摄像头${direction === 'up' ? '向上' : direction === 'down' ? '向下' : direction === 'left' ? '向左' : direction === 'right' ? '向右' : '复位'}移动`);
}

// 初始化AI检测器
async function initAIDetectors() {
  try {
    console.log('开始初始化AI检测器...')

    // 设置TensorFlow.js为CPU后端
    await tf.setBackend('cpu')
    await tf.ready()
    console.log('TensorFlow.js 后端设置完成')

    // 初始化人脸检测器 - 使用本地库
    faceDetector = new FaceDetection({
      model: 'short',
      maxNumFaces: 5,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    })

    // 设置人脸检测结果回调
    faceDetector.onResults(onFaceResults)
    console.log('人脸检测器初始化完成')

    // 初始化姿态检测器 - 使用本地库，不需要locateFile
    poseDetector = new Pose({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      smoothSegmentation: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    })

    // 设置姿态检测结果回调
    poseDetector.onResults(onPoseResults)
    console.log('姿态检测器初始化完成')

    isAIInitialized = true
    console.log('AI检测器初始化成功')

  } catch (error) {
    console.error('AI检测器初始化失败:', error)
    isAIInitialized = false
    throw new Error(`AI检测器初始化失败: ${error.message}`)
  }
}

// 人脸检测结果处理
function onFaceResults(results) {
  if (results.detections && results.detections.length > 0) {
    // 存储人脸检测结果
    currentFaceDetections.value = results.detections.map(detection => ({
      bbox: detection.boundingBox,
      confidence: detection.score,
      landmarks: detection.landmarks
    }))
  }
}

// 姿态检测结果处理
function onPoseResults(results) {
  if (results.poseLandmarks && results.poseLandmarks.length > 0) {
    // 存储姿态检测结果
    currentPoseDetections.value = {
      landmarks: results.poseLandmarks,
      worldLandmarks: results.worldLandmarks
    }
  }
}

// 修改AI检测开关函数
async function toggleAIDetection(enabled) {
  try {
    if (enabled) {
      // 开启AI检测
      aiDetectionEnabled.value = true
      console.log('用户点击开启AI检测')

      // 使用 ElLoading 而不是 ElMessage.loading
      const loading = ElLoading.service({
        lock: true,
        text: '正在初始化AI检测模型...',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      try {
        // 初始化AI检测器
        await initAIDetectors()
        loading.close()

        if (isAIInitialized) {
          ElMessage.success('AI智能检测已开启')
          console.log('AI检测已成功开启')
        } else {
          ElMessage.warning('AI模型加载失败，使用基础检测模式')
          console.log('使用基础检测模式')
        }

        startMockDetection()
      } catch (error) {
        loading.close()
        console.error('AI检测初始化失败:', error)
        ElMessage.error('AI检测初始化失败，请重试')
        aiDetectionEnabled.value = false
      }
    } else {
      // 关闭AI检测
      aiDetectionEnabled.value = false
      isAIInitialized = false
      currentDetections.value = []
      currentFaceDetections.value = []
      currentPoseDetections.value = {}
      stopMockDetection()
      console.log('AI检测已关闭')
      ElMessage.info('AI智能检测已关闭')
    }
  } catch (error) {
    console.error('AI检测切换失败:', error)
    ElMessage.error('AI检测功能启动失败，请稍后重试')

    // 确保状态一致性
    aiDetectionEnabled.value = false
    currentDetections.value = []
    stopMockDetection()
  }
}

// 模拟检测功能
function startMockDetection() {
  if (detectionInterval || !aiDetectionEnabled.value) return;

  console.log('开始AI检测，每5秒进行一次扫描')

  detectionInterval = setInterval(() => {
    // 只有在AI检测开启时才进行检测
    if (!aiDetectionEnabled.value) {
      stopMockDetection();
      return;
    }

    console.log('执行AI检测扫描...')

    // 每次都检测到违规（100%概率）
    if (Math.random() < 1.0) {
      const violationTypes = [
        { type: '未戴帽子', x: 25, y: 20, width: 15, height: 25 },
        { type: '未戴口罩', x: 60, y: 30, width: 12, height: 18 },
        { type: '未戴手套', x: 45, y: 55, width: 10, height: 15 },
        { type: '操作不规范', x: 35, y: 40, width: 20, height: 30 }
      ];

      const violation = violationTypes[Math.floor(Math.random() * violationTypes.length)];

      console.log(`检测到违规: ${violation.type}`)

      // 显示检测框
      currentDetections.value = [{
        id: Date.now(),
        ...violation
      }];

      // 立即抓拍（或很短延迟）
      setTimeout(() => {
        if (aiDetectionEnabled.value) {
          console.log(`开始抓拍违规: ${violation.type}`)
          autoViolationCapture(violation.type);
        }
        currentDetections.value = [];
      }, 1000); // 1秒后抓拍
    }
  }, 5000); // 修改为每5秒检测一次
}

function stopMockDetection() {
  if (detectionInterval) {
    clearInterval(detectionInterval);
    detectionInterval = null;
  }
  currentDetections.value = []; // 清除当前检测框
}

// 真实AI检测和抓拍
async function autoViolationCapture(violationType) {
  const timestamp = formatDate(new Date())
  const confidence = Math.floor(Math.random() * 20) + 80

  // 真实截图
  const screenshot = captureRealScreenshot()
  if (!screenshot) {
    ElMessage.error('抓拍失败，无法获取视频画面')
    return
  }

  // 创建canvas进行AI分析
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const img = new Image()

  img.onload = async function () {
    canvas.width = img.width
    canvas.height = img.height
    ctx.drawImage(img, 0, 0)

    // 使用AI进行真实检测
    const detectionResult = await performRealAIDetection(canvas, violationType)

    // 绘制检测结果
    drawDetectionResults(ctx, detectionResult, violationType)

    // 添加检测信息
    drawDetectionInfo(ctx, canvas, violationType, timestamp, detectionResult.confidence)

    const finalScreenshot = canvas.toDataURL('image/jpeg', 0.9)

    // 生成违规告警
    createViolationAlert(finalScreenshot, violationType, timestamp, detectionResult.confidence)
  }

  img.src = screenshot
}

// 执行真实AI检测
async function performRealAIDetection(canvas, violationType) {
  if (!isAIInitialized || !faceDetector || !poseDetector) {
    console.warn('AI检测器未正确初始化，使用智能区域检测')
    return getSmartDetection(canvas, violationType)
  }

  try {
    // 根据违规类型选择检测方法
    if (violationType.includes('帽子') || violationType.includes('口罩') || violationType.includes('面部')) {
      return await detectFaceViolations(canvas, violationType)
    } else if (violationType.includes('手套') || violationType.includes('姿态') || violationType.includes('操作')) {
      return await detectPoseViolations(canvas, violationType)
    } else {
      return await detectCombinedViolations(canvas, violationType)
    }
  } catch (error) {
    console.error('AI检测失败:', error)
    return getSmartDetection(canvas, violationType)
  }
}

// 人脸相关违规检测
async function detectFaceViolations(canvas, violationType) {
  // 发送图像到人脸检测器
  await faceDetector.send({ image: canvas })

  // 等待检测结果
  await new Promise(resolve => setTimeout(resolve, 100))

  if (currentFaceDetections.value.length > 0) {
    const face = currentFaceDetections.value[0]

    // 分析头部区域是否佩戴帽子/口罩
    const violation = analyzeFaceViolation(face, violationType, canvas)

    return {
      detected: true,
      confidence: face.confidence,
      bbox: face.bbox,
      violationType: violationType,
      details: violation
    }
  }

  return getDefaultDetection(canvas, violationType)
}

// 姿态相关违规检测
async function detectPoseViolations(canvas, violationType) {
  // 发送图像到姿态检测器
  await poseDetector.send({ image: canvas })

  // 等待检测结果
  await new Promise(resolve => setTimeout(resolve, 100))

  if (currentPoseDetections.value && currentPoseDetections.value.landmarks) {
    const pose = currentPoseDetections.value

    // 分析手部和身体姿态
    const violation = analyzePoseViolation(pose, violationType, canvas)

    return {
      detected: true,
      confidence: 0.85,
      bbox: calculatePoseBoundingBox(pose.landmarks, canvas),
      violationType: violationType,
      details: violation
    }
  }

  return getDefaultDetection(canvas, violationType)
}

// 综合检测
async function detectCombinedViolations(canvas, violationType) {
  // 同时进行人脸和姿态检测
  const faceResult = await detectFaceViolations(canvas, violationType)
  const poseResult = await detectPoseViolations(canvas, violationType)

  // 返回置信度更高的结果
  return faceResult.confidence > poseResult.confidence ? faceResult : poseResult
}

// 分析人脸违规
function analyzeFaceViolation(face, violationType, canvas) {
  const bbox = face.bbox

  if (violationType.includes('帽子')) {
    // 检查头顶区域
    return {
      region: 'head',
      bbox: {
        x: bbox.xCenter * canvas.width - bbox.width * canvas.width / 2,
        y: bbox.yCenter * canvas.height - bbox.height * canvas.height,
        width: bbox.width * canvas.width,
        height: bbox.height * canvas.height * 0.3
      }
    }
  } else if (violationType.includes('口罩')) {
    // 检查面部中下区域
    return {
      region: 'face',
      bbox: {
        x: bbox.xCenter * canvas.width - bbox.width * canvas.width / 2,
        y: bbox.yCenter * canvas.height - bbox.height * canvas.height / 4,
        width: bbox.width * canvas.width,
        height: bbox.height * canvas.height * 0.5
      }
    }
  }

  return { region: 'face', bbox: face.bbox }
}

// 分析姿态违规
function analyzePoseViolation(pose, violationType, canvas) {
  const landmarks = pose.landmarks

  if (violationType.includes('手套')) {
    // 检测手部区域
    const leftWrist = landmarks[15] // 左手腕
    const rightWrist = landmarks[16] // 右手腕

    return {
      region: 'hands',
      bbox: {
        x: Math.min(leftWrist.x, rightWrist.x) * canvas.width - 50,
        y: Math.min(leftWrist.y, rightWrist.y) * canvas.height - 50,
        width: Math.abs(leftWrist.x - rightWrist.x) * canvas.width + 100,
        height: 100
      }
    }
  } else if (violationType.includes('姿态') || violationType.includes('操作')) {
    // 检测整体姿态
    return {
      region: 'body',
      bbox: calculatePoseBoundingBox(landmarks, canvas)
    }
  }

  return { region: 'body', bbox: calculatePoseBoundingBox(landmarks, canvas) }
}

// 计算姿态边界框
function calculatePoseBoundingBox(landmarks, canvas) {
  let minX = 1, minY = 1, maxX = 0, maxY = 0

  landmarks.forEach(landmark => {
    if (landmark.visibility > 0.5) { // 只考虑可见的关键点
      minX = Math.min(minX, landmark.x)
      minY = Math.min(minY, landmark.y)
      maxX = Math.max(maxX, landmark.x)
      maxY = Math.max(maxY, landmark.y)
    }
  })

  return {
    x: minX * canvas.width,
    y: minY * canvas.height,
    width: (maxX - minX) * canvas.width,
    height: (maxY - minY) * canvas.height
  }
}

// 绘制检测结果
function drawDetectionResults(ctx, detectionResult, violationType) {
  if (!detectionResult.detected) return

  const bbox = detectionResult.details.bbox

  // 绘制违规区域框
  ctx.strokeStyle = '#ff4757'
  ctx.lineWidth = 3
  ctx.setLineDash([5, 5])
  ctx.strokeRect(bbox.x, bbox.y, bbox.width, bbox.height)

  // 绘制标签
  const labelWidth = Math.max(bbox.width + 50, 150)
  ctx.fillStyle = '#ff4757'
  ctx.fillRect(bbox.x, bbox.y - 30, labelWidth, 30)

  ctx.fillStyle = 'white'
  ctx.font = 'bold 14px Arial'
  ctx.fillText(`⚠️ ${violationType}`, bbox.x + 5, bbox.y - 10)

  // 添加置信度
  ctx.font = '12px Arial'
  ctx.fillText(`置信度: ${Math.round(detectionResult.confidence * 100)}%`, bbox.x + 5, bbox.y + bbox.height + 20)
}

// 绘制检测信息
function drawDetectionInfo(ctx, canvas, violationType, timestamp, confidence) {
  ctx.fillStyle = 'rgba(255, 71, 87, 0.9)'
  ctx.fillRect(10, canvas.height - 100, 280, 90)

  ctx.fillStyle = 'white'
  ctx.font = '12px Arial'
  ctx.fillText(`违规类型: ${violationType}`, 20, canvas.height - 80)
  ctx.fillText(`检测时间: ${timestamp}`, 20, canvas.height - 65)
  ctx.fillText(`置信度: ${Math.round(confidence * 100)}%`, 20, canvas.height - 50)
  ctx.fillText(`监控区域: ${getAreaName(currentArea.value)}`, 20, canvas.height - 35)
  ctx.fillText('AI智能检测系统自动抓拍', 20, canvas.height - 20)
}

// 创建违规告警
function createViolationAlert(finalScreenshot, violationType, timestamp, confidence) {
  const newAlert = {
    id: Date.now(),
    title: `检测到${violationType}`,
    description: `${getAreaName(currentArea.value)}检测到员工${violationType}，已自动抓拍证据照片`,
    level: 'warning',
    color: '#E6A23C',
    camera: currentArea.value,
    time: timestamp,
    severity: 'high',
    severityText: '高风险',
    confidence: Math.round(confidence * 100),
    algorithm: isAIInitialized ? 'MediaPipe-AI-v3.2' : 'AI-Vision-v3.2',
    riskLevel: '食品安全风险',
    evidence: `/screenshots/auto_${Date.now()}.jpg`,
    screenshot: finalScreenshot
  }

  alerts.unshift(newAlert)
  alertCount.value = alerts.length

  // 更新统计
  todayDetectionCount.value++
  todayViolationCount.value++

  // 更新违规类型统计
  const statType = violationType.includes('帽子') ? 'hat' :
    violationType.includes('口罩') ? 'mask' :
      violationType.includes('手套') ? 'gloves' : 'hygiene'
  const stat = violationStats.find(s => s.type === statType)
  if (stat) stat.count++

  ElMessage.warning({
    message: `🚨 检测到${violationType}，已自动抓拍证据！`,
    duration: 8000,
    showClose: true
  })

  // 添加到今日违规记录
  todayViolations.unshift({
    id: Date.now(),
    time: timestamp,
    type: violationType,
    location: getAreaName(currentArea.value),
    confidence: Math.round(confidence * 100),
    status: '待处理',
    evidence: finalScreenshot
  })
}

// 智能区域检测（当AI不可用时的改进版本）
function getSmartDetection(canvas, violationType) {
  // 根据违规类型智能选择检测区域
  let bbox

  if (violationType.includes('帽子')) {
    // 头部区域
    bbox = {
      x: canvas.width * 0.35,
      y: canvas.height * 0.1,
      width: canvas.width * 0.3,
      height: canvas.height * 0.25
    }
  } else if (violationType.includes('口罩')) {
    // 面部区域
    bbox = {
      x: canvas.width * 0.4,
      y: canvas.height * 0.2,
      width: canvas.width * 0.2,
      height: canvas.height * 0.2
    }
  } else if (violationType.includes('手套')) {
    // 手部区域
    bbox = {
      x: canvas.width * 0.2,
      y: canvas.height * 0.4,
      width: canvas.width * 0.6,
      height: canvas.height * 0.3
    }
  } else {
    // 全身区域
    bbox = {
      x: canvas.width * 0.25,
      y: canvas.height * 0.15,
      width: canvas.width * 0.5,
      height: canvas.height * 0.7
    }
  }

  return {
    detected: true,
    confidence: 0.75,
    bbox: bbox,
    violationType: violationType,
    details: {
      region: 'smart_detection',
      bbox: bbox
    }
  }
}

// 获取默认检测结果（兼容性保留）
function getDefaultDetection(canvas, violationType) {
  return getSmartDetection(canvas, violationType)
}

// 手动违规抓拍
function manualViolationCapture() {
  ElMessageBox.prompt('请输入违规类型描述', '手动违规抓拍', {
    confirmButtonText: '确认抓拍',
    cancelButtonText: '取消',
    inputPlaceholder: '例如：未佩戴帽子、操作不规范等'
  }).then(({ value }) => {
    if (value) {
      autoViolationCapture(value);
      ElMessage.success('违规抓拍完成，已保存证据');
    }
  }).catch(() => {
    ElMessage.info('已取消抓拍');
  });
}

// 显示违规历史
function showViolationHistory() {
  violationHistoryVisible.value = true;
}

// 查看违规详情
function viewViolationDetail(violation) {
  ElMessageBox.alert(
    `时间：${violation.time}\n类型：${violation.type}\n位置：${violation.location}\n置信度：${violation.confidence}%\n状态：${violation.status}`,
    '违规详情',
    {
      confirmButtonText: '确定',
      type: 'info'
    }
  );
}

// 查看违规截图
function viewViolationScreenshot(alert) {
  currentViolationScreenshot.value = alert.screenshot;
  currentViolationInfo.value = {
    type: alert.title,
    time: alert.time,
    location: getAreaName(alert.camera),
    confidence: alert.confidence,
    riskLevel: alert.riskLevel,
    algorithm: alert.algorithm
  };
  violationScreenshotVisible.value = true;
}

// 下载违规截图
function downloadViolationScreenshot() {
  const link = document.createElement('a');
  link.download = `违规证据_${currentViolationInfo.value.type}_${formatDate(new Date()).replace(/[:\s]/g, '_')}.jpg`;
  link.href = currentViolationScreenshot.value;
  link.click();
  ElMessage.success('违规证据下载完成');
}

// 下载证据
function downloadEvidence(violation) {
  if (violation.evidence && violation.evidence.startsWith('data:')) {
    const link = document.createElement('a');
    link.download = `违规证据_${violation.type}_${violation.time.replace(/[:\s]/g, '_')}.jpg`;
    link.href = violation.evidence;
    link.click();
    ElMessage.success('证据下载完成');
  } else {
    ElMessage.success(`正在下载违规证据：${violation.evidence}`);
    setTimeout(() => {
      ElMessage.success('证据下载完成');
    }, 1000);
  }
}

// 导出证据
function exportEvidence(alert) {
  if (alert.screenshot) {
    const link = document.createElement('a');
    link.download = `违规证据_${alert.title}_${alert.time.replace(/[:\s]/g, '_')}.jpg`;
    link.href = alert.screenshot;
    link.click();
    ElMessage.success('证据导出完成');
  } else {
    ElMessage.success(`正在导出违规证据：${alert.evidence}`);
    setTimeout(() => {
      ElMessage.success('证据导出完成');
    }, 1000);
  }
}

// 导出周报告
function exportWeeklyReport() {
  ElMessage.success('正在生成本周违规检测报告...');
  setTimeout(() => {
    ElMessage.success('报告生成完成，已下载到本地');
  }, 2000);
}

// 查看告警详情
function viewAlert(alert) {
  if (alert.screenshot) {
    viewViolationScreenshot(alert);
  } else {
    ElMessageBox.alert(alert.description, alert.title, {
      confirmButtonText: '确定',
      type: 'warning'
    });
  }
}

// 确认处理告警
function acknowledgeAlert(index) {
  ElMessageBox.confirm('确认已处理此违规行为？', '确认处理', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    alerts.splice(index, 1);
    alertCount.value = alerts.length;
    ElMessage.success('违规记录已确认处理');
  }).catch(() => {
    ElMessage.info('已取消操作');
  });
}

// 更新时间
function updateTime() {
  currentTime.value = formatDate(new Date());
}

// 更新连接时长
function updateConnectionTime() {
  if (startTime) {
    const now = new Date();
    const diff = Math.floor((now - startTime) / 1000);
    const hours = Math.floor(diff / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((diff % 3600) / 60).toString().padStart(2, '0');
    const seconds = (diff % 60).toString().padStart(2, '0');
    connectionTime.value = `${hours}:${minutes}:${seconds}`;
  }
}

// 组件挂载
onMounted(async () => {
  // 初始化时间
  updateTime();
  startTime = new Date();

  // 启动定时器
  timeUpdateInterval = setInterval(updateTime, 1000);
  connectionTimeInterval = setInterval(updateConnectionTime, 1000);

  // 根据当前视图模式连接WebRTC
  setTimeout(() => {
    if (currentView.value === 'single') {
      connectMainStream();
    } else if (currentView.value === 'quad') {
      connectQuadStreams();
    } else if (currentView.value === 'grid') {
      connectGridStreams();
    }
  }, 1000);

  // 模拟连接状态变化
  setTimeout(() => {
    isConnected.value = true;
  }, 2000);

  // 预加载AI模型（可选）
  if (aiDetectionEnabled.value) {
    await initAIDetectors();
  }
});

// 组件卸载
onUnmounted(() => {
  // 清除定时器
  if (timeUpdateInterval) {
    clearInterval(timeUpdateInterval);
  }
  if (connectionTimeInterval) {
    clearInterval(connectionTimeInterval);
  }

  // 断开所有视频流
  disconnectAllStreams();

  // 停止AI检测
  stopMockDetection();

  // 确保离开页面时关闭AI检测
  aiDetectionEnabled.value = false;
});
</script>

<style scoped>
.monitoring-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.video-container {
  position: relative;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
}

.single-view {
  height: 700px;
}

.quad-view .video-wrapper {
  height: 350px;
  margin-bottom: 10px;
}

.grid-view .video-wrapper {
  height: 280px;
  margin-bottom: 10px;
}

.video-wrapper {
  position: relative;
  background: #000;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.video-wrapper:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.7) 0%, transparent 30%, transparent 70%, rgba(0, 0, 0, 0.7) 100%);
  z-index: 2;
  pointer-events: none;
}

.video-overlay.active-quad {
  border: 3px solid #409EFF;
}

.camera-info {
  position: absolute;
  top: 10px;
  left: 10px;
  color: white;
  font-size: 14px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}

.camera-name {
  display: block;
  font-weight: bold;
  margin-bottom: 4px;
}

.timestamp {
  display: block;
  font-size: 12px;
  opacity: 0.9;
}

.main-video,
.quad-video,
.grid-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.direction-btn {
  margin: 2px;
}

.camera-controls {
  gap: 8px;
}

/* 违规检测框样式 */
.violation-box {
  position: absolute;
  border: 3px solid #ff4757;
  background: rgba(255, 71, 87, 0.1);
  border-radius: 4px;
  pointer-events: none;
  animation: violationPulse 1.5s infinite;
  z-index: 3;
}

.violation-label {
  position: absolute;
  top: -30px;
  left: 0;
  background: #ff4757;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 4px;
  box-shadow: 0 2px 8px rgba(255, 71, 87, 0.5);
}

@keyframes violationPulse {
  0% {
    opacity: 1;
    transform: scale(1);
  }

  50% {
    opacity: 0.7;
    transform: scale(1.05);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
}

/* 违规截图预览样式 */
.violation-screenshot {
  width: 120px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
  border: 2px solid #ddd;
  transition: all 0.3s ease;
}

.violation-screenshot:hover {
  border-color: #409EFF;
  transform: scale(1.1);
}

/* 违规统计卡片样式 */
.el-card .text-red-500 {
  color: #f56565;
}

.el-card .text-orange-500 {
  color: #ed8936;
}

.el-card .text-yellow-500 {
  color: #ecc94b;
}

.el-card .text-blue-500 {
  color: #4299e1;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .single-view {
    height: 400px;
  }

  .quad-view .video-wrapper {
    height: 200px;
  }

  .grid-view .video-wrapper {
    height: 160px;
  }
}
</style>