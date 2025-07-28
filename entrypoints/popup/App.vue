<script lang="ts" setup>
/**
 * todo: 重连机制
 */
import CheckConnection from '@/components/CheckConnection.vue';
import Provider from '@/components/Provider.vue';
import { NButton, NCard, NSpace } from 'naive-ui';
import { onMounted, ref } from 'vue';

const currentUrl = ref('获取中...');
const urlParams = ref<Record<string, string>>({});

// 获取当前活动标签页的URL
function getUrl() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0] && tabs[0].url) {
      currentUrl.value = tabs[0].url;
      // 尝试在获取URL后立即解析参数
      parseUrlParams(tabs[0].url);
    } else {
      currentUrl.value = '无法获取当前页面URL。';
    }
  });
}

// 按钮点击事件处理函数
const handleParseUrl = () => {
  if (currentUrl.value && currentUrl.value !== '获取中...' && currentUrl.value !== '无法获取当前页面URL。') {
    parseUrlParams(currentUrl.value);
  } else {
    window.$message.warning('请等待URL加载或确保在有效页面。');
  }
};

// 解析URL参数的函数
const parseUrlParams = (url: string) => {
  try {
    const urlObj = new URL(url);
    const params: Record<string, string> = {};
    urlObj.searchParams.forEach((value, key) => {
      params[key] = value;
    });
    // 这里 /video/bvxxxx/ 最后一位为 ‘’
    const bvId = urlObj.pathname.split('/').at(-2)
    if (!bvId || !bvId.toLocaleLowerCase().startsWith('bv')) {
      window.$message.warning('请确认当前源为 bilibili 的视频播放页面')
      return
    }
    params.bvId = bvId
    urlParams.value = params;
  } catch (error) {
    console.error("解析 URL 失败:", error);
    window.$message.error('URL 解析失败，请确保是一个有效的URL。');
    urlParams.value = {};
  }
};

const handleProcessParams = () => {
  if (Object.keys(urlParams.value).length > 0) {
    sendEventToBackground('sendParamsToBackground', urlParams.value)
  } else {
    window.$message.warning('没有可处理的参数。请先解析URL。');
  }
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
  getUrl()
  handleParseUrl()
  handleProcessParams()
}

onMounted(getUrl);
</script>

<template>
  <Provider>
    <NCard title="Cola Bilibili Helper"
      style="width: 320px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;"
      :segmented="{
        content: true,
        footer: 'soft'
      }" size="small">

      <template #header-extra>
        <CheckConnection />
      </template>

      <NSpace vertical :size="15">
        <NButton type="success" block class="mt-4" @click="send">
          添加到播放列表
        </NButton>
      </NSpace>
    </NCard>
  </Provider>
</template>
