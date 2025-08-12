import { CirclePercentIcon, GithubIcon } from 'lucide-vue-next'

// 定义链接配置接口
export interface LinkConfig {
  key: string
  url: string
  text: string
  title: string
  icon: any
}

// 链接配置
export const INFO_LINKS: LinkConfig[] = [
  {
    key: 'github',
    url: 'https://github.com/colaBiliHelper/cola-be',
    text: '插件源码',
    title: '查看插件源码',
    icon: GithubIcon,
  },
  {
    key: 'client',
    url: 'https://github.com/colaBiliHelper/cola-be',
    text: '客户端地址',
    title: '查看客户端地址',
    icon: CirclePercentIcon,
  },
]

// 获取链接配置
export function getInfoLinks(): LinkConfig[] {
  return INFO_LINKS
}

// 根据 key 获取特定链接
export function getInfoLinkByKey(key: string): LinkConfig | undefined {
  return INFO_LINKS.find(link => link.key === key)
}
