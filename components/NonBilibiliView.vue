<script setup lang="ts">
import { Info, VideoOff } from 'lucide-vue-next'
import { NAlert, NButton, NIcon, NSpace } from 'naive-ui'
import { copyToClipboard, getPageTypeDescription, getPageTypeInfo, goToBilibili } from '@/utils/index'

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
  <NSpace vertical :size="15" align="center">
    <NAlert
      :type="pageInfo.color"
      :title="pageType"
      :show-icon="false"
      class="w-full"
    >
      <template #icon>
        <NIcon>
          <component :is="pageInfo.icon" />
        </NIcon>
      </template>
      {{ pageInfo.message }}
    </NAlert>

    <NSpace vertical :size="10" class="w-full">
      <NButton
        type="primary"
        block
        class="rounded-md shadow-md hover:shadow-lg transition-all duration-200"
        @click="goToBilibili"
      >
        前往 Bilibili
      </NButton>

      <NButton
        type="default"
        block
        class="rounded-md shadow-md hover:shadow-lg transition-all duration-200"
        @click="copyCurrentUrl"
      >
        复制页面链接
      </NButton>
    </NSpace>

    <div class="text-xs text-gray-500 text-center">
      提示：本扩展仅支持 Bilibili 视频播放页面的助手功能
    </div>
  </NSpace>
</template>
