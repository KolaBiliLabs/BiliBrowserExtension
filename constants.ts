import { CirclePercentIcon, GithubIcon } from 'lucide-vue-next'

// 定义链接配置接口
export interface LinkConfig {
  key: string
  url: string
  text: string
  title: string
  icon: any
}

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
