<template>
  <div>
    <h1>IP 摄像头实时流</h1>
    <video id="video" autoplay width="640" height="480" style="border: 1px solid black;"></video>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';

let webRtcServer = null;

// 组件挂载时执行
onMounted(() => {
  const videoElement = document.getElementById('video');
  webRtcServer = new WebRtcStreamer(videoElement, 'http://localhost:8000');
  webRtcServer.connect('rtsp://admin:123456@192.168.62.104:554/cam/realmonitor?channel=1&subtype=0');
});

// 组件卸载时执行
onUnmounted(() => {
  if (webRtcServer) {
    webRtcServer.disconnect();
  }
});
</script>

<style scoped>
/* 组件专属样式 */
</style>