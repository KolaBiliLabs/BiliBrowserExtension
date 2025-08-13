/// <reference path="./.wxt/wxt.d.ts" />

import type { DialogApiInjection } from 'naive-ui/es/dialog/src/DialogProvider'
import type { MessageApiInjection } from 'naive-ui/es/message/src/MessageProvider'
import type { NotificationApiInjection } from 'naive-ui/es/notification/src/NotificationProvider'

declare global {
  interface Window {
    $message: MessageApiInjection
    $dialog: DialogApiInjection
    $notification: NotificationApiInjection
  }
}

interface SendMessageResponse<T = any> {
  data: T
  status: 'success' | 'error'
  message: string
}

/**
 * 页面类型信息接口
 */
interface PageTypeInfo {
  icon: any
  color: 'info' | 'warning' | 'error' | 'success'
  message: string
}

// 定义链接配置接口
interface LinkConfig {
  key: string
  url: string
  text: string
  title: string
  icon: any
}

/**
 * 发送到 Electron 的统一数据格式
 */
export interface ElectronMessageData {
  // 基础信息
  timestamp: number
  source: 'browser-extension'
  version: string

  // URL 参数信息
  params: {
    bvId?: string
    [key: string]: any
  }

  // 视频信息
  video: {
    title: string
    url: string
    currentTime: number
    duration: number
    paused: boolean
    src: string
    videoWidth: number
    videoHeight: number
    readyState: number
  }

  // 自定义歌曲信息
  song: {
    name: string
    startTime: number
    endTime: number
  }

  // 扩展信息
  metadata?: {
    [key: string]: any
  }
}
