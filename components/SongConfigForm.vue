<script setup lang="ts">
import { NInput, NSlider } from 'naive-ui'
import { onMounted } from 'vue'
import { DEFAULT_VIDEO_SELECTOR } from '@/constants'
import { getVideoInfo, setVideoTime } from '@/utils'

// 定义表单数据接口
interface FormData {
  songName: string
  startTime: number
  endTime: number
  maxDuration: number
}

const formData = defineModel<FormData>({
  required: true,
})

// 定义 props
const props = defineProps<{
  videoSelector?: string // 视频选择器
  loading: boolean
}>()

// 视频选择器
const videoSelector = computed(() => props.videoSelector || DEFAULT_VIDEO_SELECTOR)

// 格式化时间显示
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// 设置视频时间戳
function setVideoTimeStamp(time: number) {
  setVideoTime(videoSelector.value, time, (success) => {
    if (success) {
      console.log('视频时间设置成功:', time)
    } else {
      console.error('视频时间设置失败')
    }
  })
}

// 获取视频时长并更新最大时长
function updateVideoDuration() {
  getVideoInfo(videoSelector.value, (videoInfo) => {
    if (videoInfo && videoInfo.duration) {
      formData.value.endTime = formData.value.maxDuration = Math.ceil(videoInfo.duration)
      console.log('视频时长更新为:', formData.value.maxDuration)
    }
  })
}

// 防抖定时器
let debounceTimer: NodeJS.Timeout | null = null

// 滑块更新时触发
function onSliderUpdate(value: number, type: 'start' | 'end') {
  console.log(`拖动${type === 'start' ? '开始' : '结束'}时间滑块:`, value)

  if (type === 'start') {
    formData.value.startTime = Math.min(value, formData.value.endTime - 1)
  } else {
    formData.value.endTime = Math.max(value, formData.value.startTime + 1)
  }

  // 防抖处理，避免频繁设置视频时间
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }

  debounceTimer = setTimeout(() => {
    setVideoTimeStamp(type === 'start' ? formData.value.startTime : formData.value.endTime)
  }, 100) // 100ms 防抖延迟
}

// 组件挂载时获取视频时长
onMounted(() => {
  // 延迟一点时间确保页面加载完成
  setTimeout(() => {
    updateVideoDuration()
  }, 1000)
})
</script>

<template>
  <div>
    <!-- 歌曲名称输入 -->
    <div class="space-y-2">
      <label class="text-sm font-medium text-white/80">
        歌曲名称
      </label>
      <NInput
        v-model:value="formData.songName"
        placeholder="请输入歌曲名称"
        clearable
        class="glass-effect"
      />
    </div>

    <!-- 时间范围 -->
    <div class="flex-between mt-4">
      <label class="text-sm font-medium text-white/80">时间范围</label>
      <div class="text-xs text-white/60">
        {{ formatTime(formData.startTime) }} - {{ formatTime(formData.endTime) }}
      </div>
    </div>

    <!-- 时间范围滑块 -->
    <div class=" space-y-4">
      <!-- 开始时间滑块 -->
      <div class="space-y-2 slider-container-glass">
        <div class="flex-between">
          <span class="text-xs text-white/70">开始时间</span>
          <span class="text-xs text-white/90 font-mono">{{ formatTime(formData.startTime) }}</span>
        </div>
        <NSlider
          :value="formData.startTime"
          :min="0"
          :max="formData.maxDuration"
          :step="1"
          :tooltip="false"
          @update:value="onSliderUpdate($event, 'start')"
        />
      </div>

      <!-- 结束时间滑块 -->
      <div class="space-y-2 slider-container-glass">
        <div class="flex items-center justify-between">
          <span class="text-xs text-white/70">结束时间</span>
          <span class="text-xs text-white/90 font-mono">{{ formatTime(formData.endTime) }}</span>
        </div>

        <NSlider
          :value="formData.endTime"
          :min="0"
          :max="formData.maxDuration"
          :step="1"
          :tooltip="false"
          @update:value="onSliderUpdate($event, 'end')"
        />
      </div>

      <!-- 时间范围指示器 -->
      <div class="relative h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          class="absolute h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-300"
          :style="{
            left: `${(formData.startTime / formData.maxDuration) * 100}%`,
            width: `${((formData.endTime - formData.startTime) / formData.maxDuration) * 100}%`,
          }"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 滑块容器样式 */
.slider-container-glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 8px;
}
</style>
