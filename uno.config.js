import { defineConfig } from '@unocss/vite'

export default defineConfig({
  // 启用预设
  presets: [],
  // 自定义规则
  rules: [],
  // 自定义快捷方式
  shortcuts: {
    'glass-effect': 'backdrop-filter-blur-sm bg-white/80 shadow-lg',
    'hover-scale': 'transition-transform hover:scale-102',
  },
  // 主题配置
  theme: {
    colors: {
      primary: '#409EFF',
      success: '#67C23A',
      warning: '#E6A23C',
      danger: '#F56C6C',
      info: '#909399',
    },
  },
}) 