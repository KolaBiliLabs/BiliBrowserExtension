import type { LinkConfig } from './config';

// 防抖函数，用于优化点击事件
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

// 链接点击处理函数
export function handleLinkClick(link: LinkConfig) {
  // 记录点击事件
  console.log(`点击链接: ${link.text} - ${link.url}`);

  // 可以在这里添加更多逻辑，比如：
  // - 发送分析事件
  // - 记录用户行为
  // - 性能监控
}

// 防抖的链接点击处理函数
export const debouncedHandleLinkClick = debounce(handleLinkClick, 300);

// 检查链接是否有效
export function isValidLink(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// 获取链接域名
export function getLinkDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return '';
  }
}

// 格式化链接显示文本
export function formatLinkText(text: string, maxLength: number = 20): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + '...';
} 
