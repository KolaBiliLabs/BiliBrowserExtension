<script lang="ts" setup>
import Provider from '@/components/Provider.vue';
import { NButton, NCard, NInput, NSpace, NTag } from 'naive-ui';
import { onMounted, ref } from 'vue';

// Composition API setup
const currentUrl = ref('获取中...');
const urlParams = ref<Record<string, string>>({});

// 在组件挂载时获取当前活动标签页的URL
onMounted(() => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0] && tabs[0].url) {
      currentUrl.value = tabs[0].url;
      // 尝试在获取URL后立即解析参数
      parseUrlParams(tabs[0].url);
    } else {
      currentUrl.value = '无法获取当前页面URL。';
    }
  });
});

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
    if (bvId) {
      params.bvId = bvId
    }
    urlParams.value = params;
    console.log('params', params)
    window.$message.success('URL 参数解析成功！');
  } catch (error) {
    console.error("解析 URL 失败:", error);
    window.$message.error('URL 解析失败，请确保是一个有效的URL。');
    urlParams.value = {};
  }
};

// 按钮点击事件处理函数
const handleParseUrl = () => {
  if (currentUrl.value && currentUrl.value !== '获取中...' && currentUrl.value !== '无法获取当前页面URL。') {
    parseUrlParams(currentUrl.value);
    // sendDataToElectron('sendDataToElectron', urlParams.value)
  } else {
    window.$message.warning('请等待URL加载或确保在有效页面。');
  }
};

// 模拟后续处理，这里只是简单地打印到控制台
const handleProcessParams = () => {
  if (Object.keys(urlParams.value).length > 0) {
    console.log('开始后续处理参数:', urlParams.value);
    sendEventToBackground('sendParamsToBackground', urlParams.value)
    window.$message.info('参数已提交进行后续处理。');
  } else {
    window.$message.warning('没有可处理的参数。请先解析URL。');
  }
};

// **重点：发送消息到后台脚本的函数**
const sendEventToBackground = async (eventName: string, data: any) => {
  try {
    const response = await chrome.runtime.sendMessage({
      type: eventName, // 定义你的事件类型，例如 'PARSE_URL_EVENT'
      payload: data    // 你要发送的数据，例如解析出的 URL 参数
    });

    // 接收后台脚本的响应 (如果后台脚本调用了 sendResponse)
    if (response) {
      console.log('收到后台脚本的响应:', response);
      window.$message.success(`事件 "${eventName}" 已发送，后台响应: ${response.status}`);
    } else {
      window.$message.warning(`事件 "${eventName}" 已发送，但后台脚本未响应。`);
    }
  } catch (error: any) {
    console.error('发送消息到后台脚本失败:', error);
    window.$message.error(`发送事件 "${eventName}" 失败: ${error.message}`);
  }
};
</script>

<template>
  <Provider>
    <NCard title="Bilibili 助手 - URL 解析"
      style="width: 320px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;"
      :segmented="{
        content: true,
        footer: 'soft'
      }" size="small">

      <NSpace vertical :size="15">
        <div>
          <p class="text-sm mb-1" style="color: #616161;">当前页面 URL:</p>
          <n-input v-model:value="currentUrl" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" readonly
            placeholder="等待获取URL..." style="color: #2196F3;" />
        </div>

        <NButton type="primary" block @click="handleParseUrl">
          解析当前 URL 参数
        </NButton>

        <div v-if="Object.keys(urlParams).length > 0">
          <p class="text-sm mb-1" style="color: #616161;">解析出的参数:</p>
          <NCard size="small" :bordered="true">
            <NSpace vertical :size="5">
              <div v-for="(value, key) in urlParams" :key="key">
                <NTag type="success" size="small" round>
                  {{ key }}
                </NTag>
                <span class="ml-2 text-sm" style="word-break: break-all;">{{ value }}</span>
              </div>
            </NSpace>
          </NCard>
          <NButton type="success" block class="mt-4" @click="handleProcessParams">
            进行后续处理
          </NButton>
        </div>
      </NSpace>

      <template #footer>
        <p class="text-xs text-gray-500 text-center" style="color: #9E9E9E;">
          插件由 Vue 3 和 Naive UI 驱动
        </p>
      </template>
    </NCard>
  </Provider>
</template>
