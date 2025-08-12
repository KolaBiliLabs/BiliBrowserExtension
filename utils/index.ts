// ==================== 连接相关工具函数 ====================
export { sendCheckConnection, sendEventToBackground } from '../utils'

// ==================== URL 解析工具函数 ====================
export {
  getPageTypeDescription,
  isBilibiliDomain,
  isBilibiliVideoPage,
  isValidUrl,
  parseBilibiliVideoUrl,
} from '../utils'

// ==================== 页面类型信息工具函数 ====================
export { getPageTypeInfo } from '../utils'
export type { PageTypeInfo } from '../utils'

// ==================== 浏览器操作工具函数 ====================
export {
  copyToClipboard,
  getCurrentTabUrl,
  goToBilibili,
} from '../utils'

// ==================== 错误处理工具函数 ====================
export {
  showError,
  showSuccess,
  showWarning,
} from '../utils'
