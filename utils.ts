import type { SendMessageResponse } from './app'
import type { LinkConfig } from './components/info/config'

// ==================== 连接相关工具函数 ====================

/**
 * 发送检查连接状态的消息到后台脚本
 * @param callback 连接状态回调函数
 */
export async function sendCheckConnection(callback: (connected: boolean) => void) {
  const eventType = 'checkConnection'
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

    // 检查路径是否包含视频标识
    const pathname = urlObj.pathname
    const bvId = pathname.split('/').at(-2)

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
    const bvId = urlObj.pathname.split('/').at(-2)
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

// ==================== 页面类型信息工具函数 ====================

/**
 * 页面类型信息接口
 */
export interface PageTypeInfo {
  icon: any
  color: 'info' | 'warning' | 'error' | 'success'
  message: string
}

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
 * 复制文本到剪贴板
 * @param text 要复制的文本
 * @param successMessage 成功提示消息
 * @param errorMessage 错误提示消息
 */
export async function copyToClipboard(
  text: string,
  successMessage: string = '已复制到剪贴板',
  errorMessage: string = '复制失败',
): Promise<void> {
  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text)
      window.$message.success(successMessage)
    } catch {
      window.$message.error(errorMessage)
    }
  } else {
    // 降级方案
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    try {
      document.execCommand('copy')
      window.$message.success(successMessage)
    } catch {
      window.$message.error(errorMessage)
    }
    document.body.removeChild(textArea)
  }
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

// ==================== 验证工具函数 ====================

/**
 * 验证 URL 是否有效
 * @param url 要验证的 URL
 * @returns 是否为有效 URL
 */
export function isValidUrl(url: string): boolean {
  try {
    // eslint-disable-next-line no-new
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * 验证是否为 Bilibili 域名
 * @param url 要验证的 URL
 * @returns 是否为 Bilibili 域名
 */
export function isBilibiliDomain(url: string): boolean {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname.includes('bilibili.com')
  } catch {
    return false
  }
}

// ==================== 错误处理工具函数 ====================

/**
 * 显示错误消息
 * @param message 错误消息
 * @param error 错误对象（可选）
 */
export function showError(message: string, error?: any) {
  console.error(message, error)
  window.$message.error(message)
}

/**
 * 显示警告消息
 * @param message 警告消息
 */
export function showWarning(message: string) {
  window.$message.warning(message)
}

/**
 * 显示成功消息
 * @param message 成功消息
 */
export function showSuccess(message: string) {
  window.$message.success(message)
}

// 防抖函数，用于优化点击事件
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
}

// 链接点击处理函数
export function handleLinkClick(link: LinkConfig) {
  // 记录点击事件
  console.log(`点击链接: ${link.text} - ${link.url}`)

  // 可以在这里添加更多逻辑，比如：
  // - 发送分析事件
  // - 记录用户行为
  // - 性能监控
}

// 防抖的链接点击处理函数
export const debouncedHandleLinkClick = debounce(handleLinkClick, 300)

// 检查链接是否有效
export function isValidLink(url: string): boolean {
  try {
    // eslint-disable-next-line no-new
    new URL(url)
    return true
  } catch {
    return false
  }
}

// 获取链接域名
export function getLinkDomain(url: string): string {
  try {
    return new URL(url).hostname
  } catch {
    return ''
  }
}

// 格式化链接显示文本
export function formatLinkText(text: string, maxLength: number = 20): string {
  if (text.length <= maxLength) {
    return text
  }
  return `${text.slice(0, maxLength)}...`
}
