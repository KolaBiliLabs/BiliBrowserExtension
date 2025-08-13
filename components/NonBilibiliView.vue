<script setup lang="ts">
import { Info, VideoOff } from 'lucide-vue-next'
import { NAlert, NButton, NIcon, NSpace } from 'naive-ui'
import {
  copyToClipboard,
  getPageTypeDescription,
  getPageTypeInfo,
  goToBilibili,
} from '~/utils'

const { url } = defineProps<{
  url: string
}>()

const pageType = computed(() => getPageTypeDescription(url))

// 获取页面类型对应的图标和颜色
function getPageTypeInfoWithIcon(type: string) {
  const info = getPageTypeInfo(type)

  // 根据图标名称返回对应的组件
  const iconMap = {
    Info,
    VideoOff,
  }

  return {
    ...info,
    icon: iconMap[info.icon as keyof typeof iconMap] || Info,
  }
}

const pageInfo = computed(() => getPageTypeInfoWithIcon(pageType.value))

// 复制当前页面 URL
function copyCurrentUrl() {
  copyToClipboard(url, '页面链接已复制到剪贴板', '复制失败')
}
</script>

<template>
  <div class="glass-effect-dark rounded-2xl p-6 text-center">
    <!-- 图标和标题 -->
    <div class="mb-6">
      <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-500/20 flex items-center justify-center">
        <NIcon size="24" class="text-orange-400">
          <component :is="pageInfo.icon" />
        </NIcon>
      </div>
      <h3 class="text-lg font-semibold text-white mb-2">{{ pageType }}</h3>
      <p class="text-gray-300 text-sm">{{ pageInfo.message }}</p>
    </div>

    <!-- 按钮组 -->
    <div class="space-y-3">
      <NButton
        type="primary"
        size="large"
        class="w-full glass-effect bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
        @click="goToBilibili"
      >
        前往 Bilibili
      </NButton>

      <NButton
        type="default"
        size="large"
        class="w-full glass-effect"
        @click="copyCurrentUrl"
      >
        复制页面链接
      </NButton>
    </div>

    <!-- 提示信息 -->
    <div class="mt-4 text-xs text-gray-400 text-center">
      提示：本扩展仅支持 Bilibili 视频播放页面的助手功能
    </div>
  </div>
</template>
