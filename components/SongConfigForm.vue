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
}

// 组件名称
defineOptions({
  name: 'song-config-form',
})

// 定义 props
const props = defineProps<{
  modelValue: FormData
  videoSelector?: string // 视频选择器
}>()

// 定义 emits
const emit = defineEmits<{
  'update:modelValue': [value: FormData]
}>()

// 表单数据
const formData = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

// 视频选择器
const videoSelector = computed(() => props.videoSelector || DEFAULT_VIDEO_SELECTOR)

// 是否正在拖动滑块
const isDragging = ref(false)
// 拖动时的临时时间值
const dragTime = ref(0)
// 视频最大时长
const maxDuration = ref(600)

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
      maxDuration.value = Math.ceil(videoInfo.duration)
      console.log('视频时长更新为:', maxDuration.value)

      // 如果结束时间超过新的最大时长，则调整
      if (formData.value.endTime > maxDuration.value) {
        formData.value.endTime = maxDuration.value
      }
    }
  })
}

// 滑块开始拖动
function onSliderStart(value: number, type: 'start' | 'end') {
  isDragging.value = true
  dragTime.value = value
  console.log(`开始拖动${type === 'start' ? '开始' : '结束'}时间滑块:`, value)

  // 设置视频时间戳进行预览
  setVideoTimeStamp(value)
}

// 防抖定时器
let debounceTimer: NodeJS.Timeout | null = null

// 滑块拖动中
function onSliderUpdate(value: number, type: 'start' | 'end') {
  if (isDragging.value) {
    dragTime.value = value
    console.log(`拖动${type === 'start' ? '开始' : '结束'}时间滑块:`, value)

    // 防抖处理，避免频繁设置视频时间
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    debounceTimer = setTimeout(() => {
      setVideoTimeStamp(value)
    }, 100) // 100ms 防抖延迟
  }
}

// 滑块结束拖动
function onSliderEnd(value: number, type: 'start' | 'end') {
  isDragging.value = false
  dragTime.value = 0
  console.log(`结束拖动${type === 'start' ? '开始' : '结束'}时间滑块:`, value)

  // 最终设置视频时间戳
  setVideoTimeStamp(value)
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
      <div class="space-y-2 slider-container-glass" :class="{ dragging: isDragging }">
        <div class="flex-between">
          <span class="text-xs text-white/70">开始时间</span>
          <span class="text-xs text-white/90 font-mono">{{ formatTime(formData.startTime) }}</span>
        </div>
        <NSlider
          v-model:value="formData.startTime"
          :min="0"
          :max="maxDuration"
          :step="1"
          :tooltip="false"
          class="custom-slider"
          @mousedown="onSliderStart(formData.startTime, 'start')"
          @update:value="onSliderUpdate($event, 'start')"
          @mouseup="onSliderEnd(formData.startTime, 'start')"
        />
      </div>

      <!-- 结束时间滑块 -->
      <div class="space-y-2 slider-container-glass" :class="{ dragging: isDragging }">
        <div class="flex items-center justify-between">
          <span class="text-xs text-white/70">结束时间</span>
          <span class="text-xs text-white/90 font-mono">{{ formatTime(formData.endTime) }}</span>
        </div>

        <NSlider
          v-model:value="formData.endTime"
          :min="0"
          :max="maxDuration"
          :step="1"
          :tooltip="false"
          @mousedown="onSliderStart(formData.endTime, 'end')"
          @update:value="onSliderUpdate($event, 'end')"
          @mouseup="onSliderEnd(formData.endTime, 'end')"
        />
      </div>

      <!-- 时间范围指示器 -->
      <div class="relative h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          class="absolute h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-300"
          :style="{
            left: `${(formData.startTime / maxDuration) * 100}%`,
            width: `${((formData.endTime - formData.startTime) / maxDuration) * 100}%`,
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

/* 输入框样式 */
:deep(.n-input) {
  background: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  border-radius: 8px !important;
}

:deep(.n-input:focus-within) {
  border-color: #3b82f6 !important;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2) !important;
}

:deep(.n-input__input) {
  color: white !important;
}

:deep(.n-input__input::placeholder) {
  color: rgba(255, 255, 255, 0.5) !important;
}

/* 滑块样式优化 */
:deep(.n-slider) {
  cursor: pointer;
}

:deep(.n-slider__rail) {
  background: rgba(255, 255, 255, 0.2) !important;
}

:deep(.n-slider__fill) {
  background: linear-gradient(90deg, #3b82f6, #8b5cf6) !important;
}

:deep(.n-slider__thumb) {
  background: #3b82f6 !important;
  border: 2px solid white !important;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3) !important;
  transition: all 0.2s ease !important;
}

:deep(.n-slider__thumb:hover) {
  transform: scale(1.1) !important;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4) !important;
}

:deep(.n-slider__thumb:active) {
  transform: scale(1.05) !important;
}

/* 拖动时的视觉反馈 */
.slider-container-glass.dragging {
  background: rgba(59, 130, 246, 0.1) !important;
  border-color: rgba(59, 130, 246, 0.3) !important;
}
</style>
