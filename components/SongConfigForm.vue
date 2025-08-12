<script setup lang="ts">
import { NForm, NFormItem, NInput, NInputNumber } from 'naive-ui'

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
</script>

<template>
  <div class="p-4 bg-black/5 dark:bg-white/5 rounded-lg border border-black/10 dark:border-white/10">
    <NForm :model="formData" label-placement="left" label-width="80">
      <NFormItem label="歌曲名称">
        <NInput v-model:value="formData.songName" placeholder="请输入歌曲名称" clearable />
      </NFormItem>

      <NFormItem label="开始时间">
        <NInputNumber
          v-model:value="formData.startTime"
          placeholder="开始时间(秒)"
          :min="0"
          :precision="2"
          clearable
        />
      </NFormItem>

      <NFormItem label="结束时间">
        <NInputNumber
          v-model:value="formData.endTime"
          placeholder="结束时间(秒)"
          :min="0"
          :precision="2"
          clearable
        />
      </NFormItem>
    </NForm>
  </div>
</template>
