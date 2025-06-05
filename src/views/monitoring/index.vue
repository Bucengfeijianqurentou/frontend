<template>
  <div class="monitoring-container p-4">
    <el-card class="w-full shadow-md mb-4">
      <template #header>
        <div class="flex justify-between items-center">
          <div class="flex items-center">
            <el-icon class="mr-2 text-blue-500"><VideoCamera /></el-icon>
            <span class="text-xl font-medium">食堂实时监控系统</span>
          </div>
          <div class="flex items-center">
            <el-tag v-if="isConnected" type="success" effect="dark" class="mr-2">
              <el-icon class="mr-1"><VideoPlay /></el-icon>实时监控中
            </el-tag>
            <el-tag v-else type="danger" effect="dark" class="mr-2">
              <el-icon class="mr-1"><VideoPause /></el-icon>连接断开
            </el-tag>
            <el-button-group>
              <el-tooltip content="刷新监控">
                <el-button type="primary" :icon="Refresh" circle @click="refreshStreams" :loading="isRefreshing"></el-button>
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
          </div>
          <video 
            id="main-video" 
            ref="mainVideo"
            autoplay 
            class="main-video"
          ></video>
        </div>
      </div>
      
      <!-- 四画面视图 -->
      <div v-else-if="currentView === 'quad'" class="video-container quad-view">
        <el-row :gutter="10">
          <el-col :span="12">
            <div class="video-wrapper" @click="setActiveQuad('main')">
              <div class="video-overlay" :class="{'active-quad': currentArea === 'main'}">
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
              <div class="video-overlay" :class="{'active-quad': currentArea === 'processing'}">
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
              <div class="video-overlay" :class="{'active-quad': currentArea === 'storage'}">
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
              <div class="video-overlay" :class="{'active-quad': currentArea === 'dining'}">
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
              <div class="video-overlay" :class="{'active-quad': currentArea === area.value}">
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
          <el-icon><InfoFilled /></el-icon>
          <span class="ml-2">监控详情</span>
        </el-divider>
        
        <el-row :gutter="20">
          <el-col :xs="24" :md="12">
            <div class="camera-details p-4 bg-gray-50 rounded-lg">
              <h3 class="text-lg font-medium mb-2">当前监控信息</h3>
              <div class="mt-2">
                <el-descriptions :column="1" border>
                  <el-descriptions-item label="监控区域">{{ getAreaName(currentArea) }}</el-descriptions-item>
                  <el-descriptions-item label="摄像头编号">{{ currentArea }}-CAM-{{ Math.floor(Math.random() * 1000) + 1 }}</el-descriptions-item>
                  <el-descriptions-item label="画面分辨率">1280 × 720 (HD)</el-descriptions-item>
                  <el-descriptions-item label="流媒体协议">RTSP</el-descriptions-item>
                  <el-descriptions-item label="连接状态">
                    <el-tag :type="isConnected ? 'success' : 'danger'" size="small">
                      {{ isConnected ? '已连接' : '未连接' }}
                    </el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item label="连接时长">{{ connectionTime }}</el-descriptions-item>
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
                      <el-icon class="mr-1"><Camera /></el-icon>拍照截图
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
                
                <div class="mt-4">
                  <el-slider v-model="zoomLevel" :min="1" :max="5" :step="0.5" show-stops>
                    <template #prepend>
                      <el-icon><ZoomOut /></el-icon>
                    </template>
                    <template #append>
                      <el-icon><ZoomIn /></el-icon>
                    </template>
                  </el-slider>
                </div>
                
                <el-row class="mt-4">
                  <el-col :span="24">
                    <div class="camera-controls flex flex-col items-center">
                      <el-button circle class="direction-btn up-btn" @click="controlCamera('up')">
                        <el-icon><ArrowUp /></el-icon>
                      </el-button>
                      <div class="flex justify-center items-center">
                        <el-button circle class="mr-4 direction-btn left-btn" @click="controlCamera('left')">
                          <el-icon><ArrowLeft /></el-icon>
                        </el-button>
                        <el-button circle class="direction-btn center-btn" @click="controlCamera('center')">
                          <el-icon><Aim /></el-icon>
                        </el-button>
                        <el-button circle class="ml-4 direction-btn right-btn" @click="controlCamera('right')">
                          <el-icon><ArrowRight /></el-icon>
                        </el-button>
                      </div>
                      <el-button circle class="direction-btn down-btn" @click="controlCamera('down')">
                        <el-icon><ArrowDown /></el-icon>
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
        <div class="flex items-center">
          <el-icon class="mr-2 text-red-500"><Warning /></el-icon>
          <span class="text-xl font-medium">异常行为检测</span>
          <el-badge :value="alertCount" class="ml-2" type="danger" v-if="alertCount > 0" />
        </div>
      </template>
      
      <div v-if="alerts.length === 0" class="text-center py-8">
        <el-empty description="暂无异常行为检测记录">
          <template #image>
            <el-icon class="text-6xl text-gray-400"><SuccessFilled /></el-icon>
          </template>
        </el-empty>
      </div>
      
      <el-timeline v-else>
        <el-timeline-item
          v-for="(alert, index) in alerts"
          :key="index"
          :type="alert.level === 'error' ? 'danger' : alert.level"
          :color="alert.color"
          :timestamp="alert.time"
          placement="top"
        >
          <el-card shadow="hover">
            <div class="flex items-start">
              <el-icon class="mt-1 mr-2 text-red-500 text-xl">
                <Warning />
              </el-icon>
              <div>
                <h4 class="font-medium">{{ alert.title }}</h4>
                <p class="text-gray-600 mt-1">{{ alert.description }}</p>
                <div class="flex justify-between items-center mt-2">
                  <span class="text-xs text-gray-500">摄像头: {{ getAreaName(alert.camera) }}</span>
                  <div>
                    <el-button type="primary" size="small" @click="viewAlert(alert)" class="mr-2">查看详情</el-button>
                    <el-button type="danger" size="small" @click="acknowledgeAlert(index)">确认处理</el-button>
                  </div>
                </div>
              </div>
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-card>
    
    <!-- 截图查看对话框 -->
    <el-dialog
      v-model="imageDialogVisible"
      title="监控截图"
      width="70%"
    >
      <div class="text-center">
        <img :src="capturedImage" class="max-w-full" />
      </div>
      <template #footer>
        <div class="flex justify-between">
          <span class="text-gray-500">{{ getAreaName(currentArea) }} - {{ formatDate(new Date()) }}</span>
          <div>
            <el-button @click="imageDialogVisible = false">关闭</el-button>
            <el-button type="primary" @click="downloadImage">
              <el-icon class="mr-1"><Download /></el-icon>下载
            </el-button>
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { 
  VideoCamera, VideoPlay, VideoPause, Camera, 
  Download, FullScreen, Refresh, Warning, InfoFilled,
  ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Aim,
  ZoomIn, ZoomOut, SuccessFilled
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

// 告警信息
const alertCount = ref(2);
const alerts = reactive([
  {
    id: 1,
    title: '检测到未佩戴帽子',
    description: '食品加工区检测到有工作人员未佩戴工作帽，请及时处理',
    level: 'warning',
    color: '#E6A23C',
    camera: 'processing',
    time: formatDate(new Date(Date.now() - 1000 * 60 * 5))
  },
  {
    id: 2,
    title: '异常温度警告',
    description: '食材储存区温度异常升高，当前温度8.5°C，超过设定阈值',
    level: 'error',
    color: '#F56C6C',
    camera: 'storage',
    time: formatDate(new Date(Date.now() - 1000 * 60 * 15))
  }
]);

// 定时器
let timeUpdateInterval = null;
let connectionTimeInterval = null;
let startTime = null;

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
  // 根据区域选择不同的摄像头地址
  // 一半区域使用第一个摄像头，一半区域使用第二个摄像头
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
      const server = new WebRtcStreamer(videoElement, import.meta.env.VITE_WEBRTC_SERVER_URL);
      server.connect(getCameraUrl(area));
      webRtcServers[area] = server;
    }
  });
}

// 连接网格视图
function connectGridStreams() {
  monitoringAreas.forEach((area, index) => {
    const videoElement = document.getElementById(`grid-video-${index + 1}`);
    if (videoElement) {
      const server = new WebRtcStreamer(videoElement, import.meta.env.VITE_WEBRTC_SERVER_URL);
      server.connect(getCameraUrl(area.value));
      webRtcServers[area.value] = server;
    }
  });
}

// 断开所有流
function disconnectAllStreams() {
  Object.values(webRtcServers).forEach(server => {
    if (server) {
      server.disconnect();
    }
  });
  
  webRtcServers = {};
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
    ElMessage.success('监控画面已刷新');
  }, 1000);
}

// 截图
function captureImage() {
  let videoElement;
  
  if (currentView.value === 'single') {
    videoElement = document.getElementById('main-video');
  } else if (currentView.value === 'quad') {
    const index = ['main', 'processing', 'storage', 'dining'].indexOf(currentArea.value);
    videoElement = document.getElementById(`quad-video-${index + 1}`);
  } else {
    const index = monitoringAreas.findIndex(a => a.value === currentArea.value);
    videoElement = document.getElementById(`grid-video-${index + 1}`);
  }
  
  if (videoElement) {
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    
    // 添加水印
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillRect(10, canvas.height - 40, 350, 30);
    ctx.font = '14px Arial';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillText(`${getAreaName(currentArea.value)} - ${formatDate(new Date())}`, 20, canvas.height - 20);
    
    capturedImage.value = canvas.toDataURL('image/png');
    imageDialogVisible.value = true;
    
    ElMessage.success('已成功截取监控画面');
  }
}

// 下载图片
function downloadImage() {
  const link = document.createElement('a');
  link.download = `监控截图_${currentArea.value}_${Date.now()}.png`;
  link.href = capturedImage.value;
  link.click();
}

// 摄像头控制
function controlCamera(direction) {
  ElMessage.success(`摄像头${direction === 'center' ? '回中' : direction}操作已发送`);
  // 实际项目中这里需要调用控制摄像头的API
}

// 切换录制状态
function toggleRecording() {
  isRecording.value = !isRecording.value;
  
  if (isRecording.value) {
    ElMessage.success('开始录制监控画面');
  } else {
    ElMessage.success('录制已停止，文件已保存');
  }
}

// 查看告警详情
function viewAlert(alert) {
  ElMessage.info(`查看告警详情: ${alert.title}`);
  currentArea.value = alert.camera;
  if (currentView.value !== 'single') {
    currentView.value = 'single';
    setTimeout(() => {
      connectMainStream();
    }, 100);
  }
}

// 确认处理告警
function acknowledgeAlert(index) {
  alerts.splice(index, 1);
  alertCount.value = alerts.length;
  ElMessage.success('告警已确认处理');
}

// 更新时间显示
function updateTime() {
  const now = new Date();
  currentTime.value = formatDate(now);
}

// 更新连接时长
function updateConnectionTime() {
  if (!startTime) return;
  
  const now = new Date();
  const diff = Math.floor((now - startTime) / 1000);
  
  const hours = Math.floor(diff / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  const seconds = diff % 60;
  
  connectionTime.value = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// 组件挂载
onMounted(() => {
  // 初始化时间和定时器
  updateTime();
  startTime = new Date();
  
  timeUpdateInterval = setInterval(updateTime, 1000);
  connectionTimeInterval = setInterval(updateConnectionTime, 1000);
  
  // 初始化连接
  if (currentView.value === 'single') {
    connectMainStream();
  } else if (currentView.value === 'quad') {
    connectQuadStreams();
  } else if (currentView.value === 'grid') {
    connectGridStreams();
  }
  
  // 随机模拟连接状态变化
  setInterval(() => {
    isConnected.value = Math.random() > 0.1; // 90%概率保持连接
  }, 15000);
});

// 组件卸载
onUnmounted(() => {
  disconnectAllStreams();
  
  // 清除定时器
  if (timeUpdateInterval) {
    clearInterval(timeUpdateInterval);
  }
  
  if (connectionTimeInterval) {
    clearInterval(connectionTimeInterval);
  }
});
</script>

<style scoped>
.monitoring-container {
  min-height: 100%;
  width: 100%;
}

.video-container {
  width: 100%;
  min-height: 400px;
}

.video-wrapper {
  position: relative;
  width: 100%;
  margin-bottom: 10px;
  overflow: hidden;
  border-radius: 4px;
  border: 1px solid #ebeef5;
  background-color: #000;
  aspect-ratio: 16 / 9;
}

.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  pointer-events: none;
  border: 2px solid transparent;
  transition: all 0.3s;
}

.active-quad {
  border-color: #409eff;
  box-shadow: 0 0 10px rgba(64, 158, 255, 0.5);
}

.camera-info {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  display: flex;
  justify-content: space-between;
  width: calc(100% - 20px);
}

.camera-name {
  font-weight: bold;
}

.main-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.quad-video, .grid-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.direction-btn {
  margin: 5px;
}

.camera-controls {
  margin-top: 10px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .camera-info {
    font-size: 10px;
  }
  
  .camera-controls {
    transform: scale(0.9);
  }
}
</style>