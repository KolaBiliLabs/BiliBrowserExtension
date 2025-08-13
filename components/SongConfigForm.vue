<script setup lang="ts">
import { NInput, NSlider } from 'naive-ui'

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

// 格式化时间显示
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}
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
      >
        <template #password-visible-icon>
          <EyeIcon class="size-4" />
        </template>
      </NInput>
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
          v-model:value="formData.startTime"
          :min="0"
          :max="600"
          :step="1"
          :tooltip="false"
          class="custom-slider"
        />
      </div>

      <!-- 结束时间滑块 -->
      <div class="space-y-2 slider-container-glass">
        <div class="flex items-center justify-between">
          <span class="text-xs text-white/70">结束时间</span>
          <span class="text-xs text-white/90 font-mono">{{ formatTime(formData.endTime) }}</span>
        </div>

        <NSlider
          v-model:value="formData.endTime"
          :min="0"
          :max="600"
          :step="1"
          :tooltip="false"
        />
      </div>

      <!-- 时间范围指示器 -->
      <div class="relative h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          class="absolute h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-300"
          :style="{
            left: `${(formData.startTime / 600) * 100}%`,
            width: `${((formData.endTime - formData.startTime) / 600) * 100}%`,
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
</style>
