import type { ElectronMessageData, PageTypeInfo, SendMessageResponse } from './app'
import { MESSAGE_TYPES } from './constants'

// ==================== 连接相关工具函数 ====================

/**
 * 发送检查连接状态的消息到后台脚本
 * @param callback 连接状态回调函数
 */
export async function sendCheckConnection(callback: (connected: boolean) => void) {
  const eventType = MESSAGE_TYPES.CHECK_CONNECTION
  const response: SendMessageResponse<{ isConnected: boolean }> = await chrome.runtime.sendMessage({
    type: eventType,
  })

  if (!response) {
    window.$message.warning(`事件 "${eventType}" 已发送，但后台脚本未响应。`)
    return
  }
  const { data } = response
  callback(data.isConnected)
}

/**
 * 发送事件到后台脚本
 * @param eventName 事件名称
 * @param data 事件数据
 */
export async function sendEventToBackground(eventName: string, data: any) {
  try {
    const response = await chrome.runtime.sendMessage({
      type: eventName,
      payload: data,
    })

    if (!response) {
      window.$message.warning(`事件 "${eventName}" 已发送，但后台脚本未响应。`)
      return
    }

    window.$message[response.status as 'success' | 'error'](response.message)
    return response
  } catch (error: any) {
    window.$message.error(`发送事件 "${eventName}" 失败: ${error.message}`)
    throw error
  }
}

// ==================== URL 解析工具函数 ====================

/**
 * 检测当前页面是否为 Bilibili 视频播放页面
 * @param url 页面 URL
 * @returns 是否为 Bilibili 视频页面
 */
export function isBilibiliVideoPage(url: string): boolean {
  try {
    const urlObj = new URL(url)

    // 检查是否为 Bilibili 域名
    if (!urlObj.hostname.includes('bilibili.com')) {
      return false
    }

    // 检查是否包含视频标识
    const bvId = getBvId(url)

    // 检查是否为 BV 开头的视频 ID
    return !!(bvId && bvId.toLowerCase().startsWith('bv'))
  } catch (error) {
    console.error('URL 解析失败:', error)
    return false
  }
}

/**
 * 解析 Bilibili 视频 URL 参数
 * @param url Bilibili 视频页面 URL
 * @returns 解析后的参数对象，如果解析失败返回 null
 */
export function parseBilibiliVideoUrl(url: string): Record<string, string> | null {
  try {
    const urlObj = new URL(url)
    const params: Record<string, string> = {}

    // 解析查询参数
    urlObj.searchParams.forEach((value, key) => {
      params[key] = value
    })

    // 解析 BV ID
    const bvId = getBvId(url)
    if (!bvId || !bvId.toLowerCase().startsWith('bv')) {
      return null
    }

    params.bvId = bvId
    return params
  } catch (error) {
    console.error('解析 Bilibili URL 失败:', error)
    return null
  }
}

/**
 * 获取页面类型描述
 * @param url 页面 URL
 * @returns 页面类型描述
 */
export function getPageTypeDescription(url: string): string {
  if (!url)
    return '未知页面'

  try {
    const urlObj = new URL(url)
    const hostname = urlObj.hostname

    if (hostname.includes('bilibili.com')) {
      if (isBilibiliVideoPage(url)) {
        return 'Bilibili 视频页面'
      } else {
        return 'Bilibili 其他页面'
      }
    }

    return `${hostname} 页面`
  } catch (error) {
    console.error(error)
    return '无效页面'
  }
}

/**
 * 获取 Bilibili 视频 ID
 * @param url 视频 URL
 * @returns Bilibili 视频 ID
 */
export function getBvId(url: string) {
  // 正则表达式匹配 "BV" 后紧跟的10位字母或数字
  const regex = /BV[a-zA-Z0-9]{10}/
  const match = url.match(regex)

  if (match) {
    return match[0] // match[0] 包含了匹配到的完整字符串
  }
  return null // 如果没有找到匹配项，则返回 null
}

// ==================== 页面类型信息工具函数 ====================

/**
 * 获取页面类型对应的图标和颜色
 * @param type 页面类型
 * @returns 页面类型信息
 */
export function getPageTypeInfo(type: string): PageTypeInfo {
  switch (type) {
    case 'Bilibili 其他页面':
      return {
        icon: 'Info',
        color: 'info',
        message: '当前页面不是 Bilibili 视频播放页面，无法使用视频助手功能。',
      }
    case 'YouTube 页面':
      return {
        icon: 'VideoOff',
        color: 'warning',
        message: '当前为 YouTube 页面，本扩展仅支持 Bilibili 视频助手功能。',
      }
    case '优酷页面':
    case '爱奇艺页面':
      return {
        icon: 'VideoOff',
        color: 'warning',
        message: '当前为国内视频平台页面，本扩展仅支持 Bilibili 视频助手功能。',
      }
    default:
      return {
        icon: 'Info',
        color: 'info',
        message: '当前页面不支持视频助手功能，请访问 Bilibili 视频播放页面。',
      }
  }
}

// ==================== 浏览器操作工具函数 ====================

/**
 * 跳转到 Bilibili 首页
 */
export function goToBilibili() {
  chrome.tabs.create({ url: 'https://www.bilibili.com' })
}

/**
 * 获取当前活动标签页的 URL
 * @returns Promise<string> 当前标签页的 URL
 */
export function getCurrentTabUrl(): Promise<string> {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0] || !tabs[0].url) {
        reject(new Error('无法获取当前标签页 URL'))
        return
      }
      resolve(tabs[0].url)
    })
  })
}

// ==================== 错误处理工具函数 ====================

/**
 * 显示警告消息
 * @param message 警告消息
 */
export function showWarning(message: string) {
  window.$message.warning(message)
}

export function showSuccess(message: string) {
  window.$message.success(message)
}

// ==================== 格式化工具函数 ====================

// 格式化链接显示文本
export function formatLinkText(text: string, maxLength: number = 20): string {
  if (text.length <= maxLength) {
    return text
  }
  return `${text.slice(0, maxLength)}...`
}

// ==================== 视频控制工具函数 ====================

/**
 * 获取视频元素信息
 * @param cssSelector 视频元素选择器，默认为 'video'
 * @param callback 回调函数，接收视频信息
 */
export function getVideoInfo(cssSelector: string = 'video', callback: (videoInfo: any) => void): void {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs[0] || !tabs[0].id) {
      console.error('无法获取当前标签页')
      callback(null)
      return
    }

    const tabId = tabs[0].id

    console.log('cssSelector => ', cssSelector)

    chrome.scripting.executeScript({
      target: { tabId },
      func: (selector: string) => {
        // 在目标页面上下文中执行，使用传入的选择器参数
        const videoElement = document.querySelector(selector) as HTMLVideoElement
        console.log('videoElement => ', videoElement)
        if (videoElement) {
          return {
            currentTime: videoElement.currentTime,
            duration: videoElement.duration,
            paused: videoElement.paused,
            src: videoElement.src,
            title: document.title,
            url: window.location.href,
            videoWidth: videoElement.videoWidth,
            videoHeight: videoElement.videoHeight,
            readyState: videoElement.readyState,
          }
        }
        return null
      },
      args: [cssSelector], // 将选择器作为参数传递给函数
    }, (results) => {
      if (chrome.runtime.lastError) {
        console.error('执行脚本失败:', chrome.runtime.lastError)
        callback(null)
        return
      }

      if (results && results[0]) {
        callback(results[0].result)
      } else {
        callback(null)
      }
    })
  })
}

/**
 * 设置视频时间戳
 * @param cssSelector 视频元素选择器
 * @param time 时间戳（秒）
 * @param callback 回调函数
 */
export function setVideoTime(
  cssSelector: string = 'video',
  time: number,
  callback?: (success: boolean) => void,
): void {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs[0] || !tabs[0].id) {
      console.error('无法获取当前标签页')
      callback?.(false)
      return
    }

    const tabId = tabs[0].id

    chrome.scripting.executeScript({
      target: { tabId },
      func: (selector: string, targetTime: number) => {
        const videoElement = document.querySelector(selector) as HTMLVideoElement
        if (videoElement) {
          try {
            videoElement.currentTime = targetTime
            return true
          } catch (error) {
            console.error('设置视频时间失败:', error)
            return false
          }
        }
        return false
      },
      args: [cssSelector, time],
    }, (results) => {
      if (chrome.runtime.lastError) {
        console.error('执行脚本失败:', chrome.runtime.lastError)
        callback?.(false)
        return
      }

      const success = results?.[0]?.result || false
      callback?.(success)
    })
  })
}

/**
 * 获取视频当前时间
 * @param cssSelector 视频元素选择器
 * @param callback 回调函数
 */
export function getVideoCurrentTime(
  cssSelector: string = 'video',
  callback: (time: number | null) => void,
): void {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs[0] || !tabs[0].id) {
      console.error('无法获取当前标签页')
      callback(null)
      return
    }

    const tabId = tabs[0].id

    chrome.scripting.executeScript({
      target: { tabId },
      func: (selector: string) => {
        const videoElement = document.querySelector(selector) as HTMLVideoElement
        if (videoElement) {
          return videoElement.currentTime
        }
        return null
      },
      args: [cssSelector],
    }, (results) => {
      if (chrome.runtime.lastError) {
        console.error('执行脚本失败:', chrome.runtime.lastError)
        callback(null)
        return
      }

      callback(results?.[0]?.result || null)
    })
  })
}

// ==================== 数据构建工具函数 ====================

/**
 * 构建发送到 Electron 的统一数据格式
 * @returns 统一格式的数据
 */
export function buildElectronMessageData(
  params: Record<string, any>,
  videoInfo: any,
  songInfo: {
    name: string
    startTime: number
    endTime: number
  },
  metadata?: Record<string, any>,
): ElectronMessageData {
  return {
    // 基础信息
    timestamp: Date.now(),
    source: 'browser-extension',
    version: '1.0.0',

    // URL 参数信息
    params: {
      bvId: params.bvId,
      ...params,
    },

    // 视频信息
    video: {
      title: videoInfo.title || '',
      url: videoInfo.url || '',
      currentTime: videoInfo.currentTime || 0,
      duration: videoInfo.duration || 0,
      paused: videoInfo.paused || true,
      src: videoInfo.src || '',
      videoWidth: videoInfo.videoWidth || 0,
      videoHeight: videoInfo.videoHeight || 0,
      readyState: videoInfo.readyState || 0,
    },

    // 自定义歌曲信息
    song: {
      name: songInfo.name || '',
      startTime: songInfo.startTime || 0,
      endTime: songInfo.endTime || 0,
    },

    // 扩展信息
    metadata: metadata || {},
  }
}

/**
 * 发送统一格式的数据到 Electron
 */
export async function sendUnifiedDataToElectron(
  params: Record<string, any>,
  videoInfo: any,
  songInfo: {
    name: string
    startTime: number
    endTime: number
  },
  metadata?: Record<string, any>,
) {
  const unifiedData = buildElectronMessageData(params, videoInfo, songInfo, metadata)

  try {
    await sendEventToBackground(MESSAGE_TYPES.SEND_UNIFIED_DATA, unifiedData)
    return { success: true, data: unifiedData }
  } catch (error) {
    console.error('发送统一数据到 Electron 失败:', error)
    return { success: false, error }
  }
}
