<script setup lang="ts">
import { CogIcon } from 'lucide-vue-next'
import { NButton, NButtonGroup, NIcon } from 'naive-ui'
import {
  parseBilibiliVideoUrl,
  sendEventToBackground,
  showWarning,
} from '@/utils/index'
import SongConfigForm from './SongConfigForm.vue'

const { url } = defineProps<{
  url: string
}>()

const urlParams = ref<Record<string, string>>({})
const isExpanded = ref(false)

// 表单数据
const formData = ref({
  songName: '',
  startTime: 0,
  endTime: 0,
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
  return true
}

// 处理参数发送
function handleProcessParams() {
  if (!Object.keys(urlParams.value).length) {
    showWarning('没有可处理的参数。请先解析URL。')
    return
  }

  sendEventToBackground('sendParamsToBackground', urlParams.value)
}

// 主要发送函数
function send() {
  const parseResult = handleParseUrl()
  if (parseResult) {
    handleProcessParams()
  }
}

// 展开表单处理函数
function handleExpand() {
  console.log('展开表单配置')
  isExpanded.value = true

  // 展开时的处理逻辑
  // 1. 解析当前 URL 参数
  handleParseUrl()

  // 2. 可以在这里添加其他展开时的初始化逻辑
  // 例如：从本地存储加载上次的配置
  // 例如：获取视频信息并预填充表单
}

// 关闭表单处理函数
function handleCollapse() {
  console.log('关闭表单配置')
  isExpanded.value = false

  // 关闭时的处理逻辑
  // 1. 保存当前配置到本地存储
  saveFormData()

  // 2. 清理表单数据（可选）
  // clearFormData()

  // 3. 可以在这里添加其他关闭时的清理逻辑
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

// 从本地存储加载表单数据
function _loadFormData() {
  try {
    chrome.storage.local.get(['formData'], (result) => {
      if (result.formData) {
        const savedData = result.formData
        formData.value.songName = savedData.songName || ''
        formData.value.startTime = savedData.startTime || 0
        formData.value.endTime = savedData.endTime || 0
        console.log('已从本地存储加载表单数据')
      }
    })
  } catch (error) {
    console.error('加载表单数据失败:', error)
  }
}

// 清理表单数据
function _clearFormData() {
  formData.value = {
    songName: '',
    startTime: 0,
    endTime: 0,
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
  <div
    class="transition-all duration-300 ease-in-out rounded-lg overflow-hidden"
    :class="{
      'bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/20 dark:border-blue-500/30 p-4': isExpanded,
    }"
  >
    <!-- 按钮区域 -->
    <div class="flex justify-center items-center py-2">
      <NButtonGroup>
        <NButton
          :type="isExpanded ? 'primary' : 'primary'"
          class="relative overflow-hidden transition-all duration-200 ease-in-out"
          :class="[
            isExpanded ? 'bg-gradient-to-r from-blue-500 to-blue-700 border-blue-500' : '',
          ]"
          @click="send"
        >
          <span
            v-if="isExpanded"
            class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"
          />
          添加到播放列表
        </NButton>
        <NButton
          :type="isExpanded ? 'primary' : 'default'"
          class="relative overflow-hidden transition-all duration-200 ease-in-out"
          :class="[
            isExpanded ? 'bg-gradient-to-r from-blue-500 to-blue-700 border-blue-500' : '',
          ]"
          @click="toggleExpand"
        >
          <span
            v-if="isExpanded"
            class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"
          />
          <NIcon size="14">
            <CogIcon />
          </NIcon>
        </NButton>
      </NButtonGroup>
    </div>

    <!-- 可展开的表单区域 -->
    <div
      class="transition-all duration-300 ease-in-out overflow-hidden"
      :class="{
        'max-h-0 opacity-0': !isExpanded,
        'max-h-80 opacity-100 mt-4': isExpanded,
      }"
    >
      <SongConfigForm v-model="formData" />
    </div>
  </div>
</template>
