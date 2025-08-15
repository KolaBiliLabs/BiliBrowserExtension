<script setup lang="ts">
import { CogIcon, XIcon } from 'lucide-vue-next'
import { NButton, NButtonGroup, NIcon } from 'naive-ui'
import { DEFAULT_VIDEO_SELECTOR } from '@/constants'
import { useExpandedState } from '@/hooks/useExpandedState'
import { useVideoInfo } from '@/hooks/useVideoInfo'
import {
  parseBilibiliVideoUrl,
  sendUnifiedDataToElectron,
  showWarning,
} from '@/utils'
import SongConfigForm from './SongConfigForm.vue'

const { url } = defineProps<{
  url: string
}>()

// 表单数据
const formData = ref({
  songName: '',
  startTime: 0,
  endTime: 10,
  maxDuration: 10,
})

// 使用展开状态 hook（带防抖）
const { isExpanded, setExpanded, isTransitioning } = useExpandedState('sendToClientExpanded', false, 300)
// 视频信息
const { videoInfoCache, isVideoInfoLoading, clearVideoInfoCache } = useVideoInfo((videoInfo) => {
  if (videoInfo) {
    formData.value.endTime = formData.value.maxDuration = Math.floor(videoInfo.duration)
  }
})

const urlParams = ref<Record<string, string>>({})

// 解析 URL 参数
function handleParseUrl() {
  if (!url) {
    showWarning('请等待URL加载或确保在有效页面。')
    return false
  }

  const params = parseBilibiliVideoUrl(url)
  if (!params) {
    showWarning('请确认当前源为b站视频播放页面')
    return false
  }

  urlParams.value = params
  console.log('urlPrams =>', urlParams.value, params)
  return true
}

// 主要发送函数
async function send() {
  const parseResult = handleParseUrl()
  if (!parseResult) {
    return
  }

  if (!Object.keys(urlParams.value).length) {
    showWarning('没有可处理的参数。请先解析URL。')
    return
  }

  if (!videoInfoCache.value) {
    showWarning('未找到视频元素，请确保在视频播放页面')
    return
  }

  // 使用统一的数据格式发送
  const result = await sendUnifiedDataToElectron(
    urlParams.value,
    videoInfoCache.value,
    {
      name: formData.value.songName,
      startTime: formData.value.startTime,
      endTime: formData.value.endTime,
    },
    {
      action: 'sendParams',
      source: 'popup',
    },
  )

  if (result.success) {
    console.log('统一数据发送成功:', result.data)
  } else {
    console.error('统一数据发送失败:', result.error)
  }
}

async function sendWithConf() {
  console.log('sendWithConf')
  if (!videoInfoCache.value) {
    showWarning('未找到视频元素，请确保在视频播放页面')
    return
  }

  console.log('处理视频信息:', videoInfoCache.value)

  // 可以根据视频信息更新表单数据
  if (videoInfoCache.value.duration) {
    formData.value.endTime = Math.floor(videoInfoCache.value.duration)
  }

  handleParseUrl()

  // 使用统一的数据格式发送
  const result = await sendUnifiedDataToElectron(
    urlParams.value,
    videoInfoCache.value,
    {
      name: formData.value.songName,
      startTime: formData.value.startTime,
      endTime: formData.value.endTime,
    },
    {
      action: 'videoInfo',
      source: 'popup',
    },
  )

  if (result.success) {
    console.log('视频信息统一数据发送成功:', result.data)
  } else {
    console.error('视频信息统一数据发送失败:', result.error)
  }
}

// 展开表单处理函数
function handleExpand() {
  console.log('展开表单配置')
  setExpanded(true)

  // 清除视频信息缓存，确保获取最新信息
  clearVideoInfoCache()
  handleParseUrl()
}

// 关闭表单处理函数
function handleCollapse() {
  console.log('关闭表单配置')
  setExpanded(false)

  saveFormData()
}

// 保存表单数据到本地存储
function saveFormData() {
  try {
    const dataToSave = {
      songName: formData.value.songName,
      startTime: formData.value.startTime,
      endTime: formData.value.endTime,
      timestamp: Date.now(),
    }

    chrome.storage.local.set({
      formData: dataToSave,
    }, () => {
      console.log('表单数据已保存到本地存储')
    })
  } catch (error) {
    console.error('保存表单数据失败:', error)
  }
}

// 切换展开状态
function toggleExpand() {
  if (isExpanded.value) {
    handleCollapse()
  } else {
    handleExpand()
  }
}
</script>

<template>
  <Transition
    name="slide"
    mode="out-in"
  >
    <!-- 按钮区域 -->
    <NButtonGroup v-if="!isExpanded" class="py-8" size="large">
      <NButton
        type="primary"
        :loading="isVideoInfoLoading"
        @click="send"
      >
        添加到播放列表
      </NButton>
      <NButton
        type="default"
        class="rounded-r-lg border-0 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm"
        :disabled="isTransitioning"
        @click="toggleExpand"
      >
        <NIcon size="16" :class="{ 'animate-spin': isTransitioning }">
          <CogIcon />
        </NIcon>
      </NButton>
    </NButtonGroup>

    <div v-else class="flex-1 flex-col-center bg-black/10 backdrop-blur-lg rounded-lg border border-white/10 p-4 gap-4">
      <header class="flex-between w-full">
        <!-- 按钮 -->
        <NButton
          type="primary"
          size="small"
          :loading="isVideoInfoLoading"
          @click="sendWithConf"
        >
          添加到播放列表
        </NButton>
        <NButton
          type="default"
          size="small"
          :disabled="isTransitioning"
          @click="toggleExpand"
        >
          <XIcon class="size-4" :class="{ 'animate-pulse': isTransitioning }" />
        </NButton>
      </header>

      <SongConfigForm
        v-model="formData"
        :video-selector="DEFAULT_VIDEO_SELECTOR"
        :loading="isVideoInfoLoading"
      />
    </div>
  </Transition>
</template>
