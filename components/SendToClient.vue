<script setup lang="ts">
import { CogIcon, XIcon } from 'lucide-vue-next'
import { NButton, NButtonGroup, NIcon } from 'naive-ui'
import { DEFAULT_VIDEO_SELECTOR } from '@/constants'
import { useExpandedState } from '@/hooks/useExpandedState'
import {
  getVideoInfo,
  parseBilibiliVideoUrl,
  sendUnifiedDataToElectron,
  showWarning,
} from '@/utils'
import SongConfigForm from './SongConfigForm.vue'

const { url } = defineProps<{
  url: string
}>()

const urlParams = ref<Record<string, string>>({})

// 使用展开状态 hook（带防抖）
const { isExpanded, setExpanded, isTransitioning } = useExpandedState('sendToClientExpanded', false, 300)

// 表单数据
const formData = ref({
  songName: '',
  startTime: 0,
  endTime: 10,
})

// 解析 URL 参数
function handleParseUrl() {
  console.log('url => ', url)
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
function send() {
  const parseResult = handleParseUrl()
  if (!parseResult) {
    return
  }

  if (!Object.keys(urlParams.value).length) {
    showWarning('没有可处理的参数。请先解析URL。')
    return
  }

  // 获取视频信息
  getVideoInfo(DEFAULT_VIDEO_SELECTOR, (videoInfo) => {
    if (videoInfo) {
      // 使用统一的数据格式发送
      sendUnifiedDataToElectron(
        urlParams.value,
        videoInfo,
        undefined,
        {
          action: 'sendParams',
          source: 'popup',
        },
      ).then((result) => {
        if (result.success) {
          console.log('统一数据发送成功:', result.data)
        } else {
          console.error('统一数据发送失败:', result.error)
        }
      })
    } else {
      // 如果没有视频信息, 则提示用户
      showWarning('未找到视频元素，请确保在视频播放页面')
    }
  })
}

function sendWithConf() {
  console.log('sendWithConf')

  // 获取视频信息
  // 使用常量中的视频选择器
  getVideoInfo(DEFAULT_VIDEO_SELECTOR, (videoInfo) => {
    if (videoInfo) {
      console.log('获取到的视频信息:', videoInfo)
      handleVideoInfo(videoInfo)
    } else {
      showWarning('未找到视频元素，请确保在视频播放页面')
    }
  })
}

// 处理获取到的视频信息
function handleVideoInfo(videoInfo: any) {
  console.log('处理视频信息:', videoInfo)

  // 可以根据视频信息更新表单数据
  if (videoInfo.duration) {
    formData.value.endTime = Math.floor(videoInfo.duration)
  }

  handleParseUrl()

  // 使用统一的数据格式发送
  sendUnifiedDataToElectron(
    urlParams.value,
    videoInfo,
    {
      name: formData.value.songName,
      startTime: formData.value.startTime,
      endTime: formData.value.endTime,
    },
    {
      action: 'videoInfo',
      source: 'popup',
    },
  ).then((result) => {
    if (result.success) {
      console.log('视频信息统一数据发送成功:', result.data)
    } else {
      console.error('视频信息统一数据发送失败:', result.error)
    }
  })
}

// 展开表单处理函数
function handleExpand() {
  console.log('展开表单配置')
  setExpanded(true)

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

    <div v-else class="flex-1 flex-col-center form-container-glass p-4 gap-4">
      <header class="flex-between w-full">
        <!-- 按钮 -->
        <NButton
          type="primary"
          size="small"
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
      />
    </div>
  </Transition>
</template>

<style scoped>
/* 表单容器样式 */
.form-container-glass {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  /* box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2); */
}

/* 展开按钮的条纹扫过动画效果 */
.expanded-button {
  background: linear-gradient(45deg, #3b82f6, #1d4ed8) !important;
  border: 1px solid #3b82f6 !important;
  position: relative;
  overflow: hidden;
}

.expanded-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  animation: stripe 2s infinite;
}

@keyframes stripe {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}
</style>
