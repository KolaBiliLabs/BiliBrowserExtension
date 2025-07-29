<script setup lang="ts">
import { NButton, NSpace } from 'naive-ui';

const { url } = defineProps<{
  url: string
}>()

const urlParams = ref<Record<string, string>>({});

// 按钮点击事件处理函数
const handleParseUrl = () => {
  if (!url) {
    window.$message.warning('请等待URL加载或确保在有效页面。');
    return
  }

  try {
    const urlObj = new URL(url);
    const params: Record<string, string> = {};
    urlObj.searchParams.forEach((value, key) => {
      params[key] = value;
    });
    // 这里 /video/bvxxxx/ 最后一位为 ‘’
    const bvId = urlObj.pathname.split('/').at(-2)
    if (!bvId || !bvId.toLocaleLowerCase().startsWith('bv')) {
      window.$message.warning('请确认当前源为b站视频播放页面')
      return
    }
    params.bvId = bvId
    urlParams.value = params;
    return true
  } catch (error) {
    console.error("解析 URL 失败:", error);
    window.$message.error('请确保是一个有效的URL。');
    urlParams.value = {};
  }
};


const handleProcessParams = () => {
  if (!Object.keys(urlParams.value).length) {
    window.$message.warning('没有可处理的参数。请先解析URL。');
    return
  }

  sendEventToBackground('sendParamsToBackground', urlParams.value)
};

const sendEventToBackground = async (eventName: string, data: any) => {
  try {
    const response = await chrome.runtime.sendMessage({
      type: eventName,
      payload: data
    });

    if (!response) {
      window.$message.warning(`事件 "${eventName}" 已发送，但后台脚本未响应。`);
    }

    window.$message[response.status as 'success' | 'error'](response.message)
  } catch (error: any) {
    window.$message.error(`发送事件 "${eventName}" 失败: ${error.message}`);
  }
};

function send() {
  const parseResult = handleParseUrl()

  if (parseResult) {
    handleProcessParams()
  }
}
</script>

<template>
  <NSpace vertical :size="15">
    <NButton type="primary" block class="w-full rounded-md shadow-md hover:shadow-lg transition-all duration-200"
      @click="send">
      添加到播放列表
    </NButton>
  </NSpace>
</template>
