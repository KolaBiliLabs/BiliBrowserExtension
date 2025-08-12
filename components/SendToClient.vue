<script setup lang="ts">
import { useIsDev } from '@/hooks';
import {
  parseBilibiliVideoUrl,
  sendEventToBackground,
  showWarning
} from '@/utils/index';
import { NButton, NSpace } from 'naive-ui';

const { url } = defineProps<{
  url: string
}>()

const { isDev } = useIsDev()

const urlParams = ref<Record<string, string>>({});

// 解析 URL 参数
const handleParseUrl = () => {
  console.log('url => ', url)
  if (!url) {
    showWarning('请等待URL加载或确保在有效页面。');
    return false
  }

  const params = parseBilibiliVideoUrl(url)
  if (!params) {
    showWarning('请确认当前源为b站视频播放页面')
    return false
  }

  urlParams.value = params
  return true
};

// 处理参数发送
const handleProcessParams = () => {
  if (!Object.keys(urlParams.value).length) {
    showWarning('没有可处理的参数。请先解析URL。');
    return
  }

  sendEventToBackground('sendParamsToBackground', urlParams.value)
};

// 主要发送函数
function send() {
  const parseResult = handleParseUrl()
  if (parseResult) {
    handleProcessParams()
  }
}
</script>

<template>
  <NSpace vertical :size="15">
    <span v-if="isDev">url => {{ url }}</span>

    <NButton type="primary" block class="w-full rounded-md shadow-md hover:shadow-lg transition-all duration-200"
      @click="send">
      添加到播放列表
    </NButton>
  </NSpace>
</template>
