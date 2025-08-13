import type { LinkConfig } from './app'
import { CirclePercentIcon, GithubIcon } from 'lucide-vue-next'

// 视频选择器常量
export const VIDEO_SELECTORS = {
  // Bilibili 视频选择器
  BILIBILI: '.bpx-player-video-wrap video',
  // 通用视频选择器
  GENERIC: 'video',
  // YouTube 视频选择器（备用）
  YOUTUBE: 'video',
} as const

// 默认视频选择器
export const DEFAULT_VIDEO_SELECTOR = VIDEO_SELECTORS.BILIBILI

// ==================== 数据格式定义 ====================

// 消息类型常量
export const MESSAGE_TYPES = {
  // 发送到后台的消息类型
  SEND_UNIFIED_DATA: 'sendUnifiedDataToElectron',
  CHECK_CONNECTION: 'checkConnection',

  // 发送到 Electron 的事件类型
  UNIFIED_DATA_TO_ELECTRON: 'unifiedDataToElectron',

  // Socket.IO 连接事件
  BROWSER_PLUGIN_CONNECTED: 'browserPluginConnected',
  DATA_FROM_ELECTRON: 'dataFromElectron',
  DATA_RECEIVED_ACK: 'dataReceivedAck',
} as const

// 链接配置
export const INFO_LINKS: LinkConfig[] = [
  {
    key: 'github',
    url: 'https://github.com/KolaBiliLabs/BiliBrowserExtension',
    text: '插件源码',
    title: '查看插件源码',
    icon: GithubIcon,
  },
  {
    key: 'client',
    url: 'https://github.com/KolaBiliLabs/BiliHelper',
    text: '客户端地址',
    title: '查看客户端地址',
    icon: CirclePercentIcon,
  },
]
