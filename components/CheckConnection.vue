<script setup lang="ts">
import { SendMessageResponse } from '@/app';
import { NTag } from 'naive-ui';

const isConnected = ref(false)

async function checkConnection() {
  const eventType = 'checkConnection'
  const response: SendMessageResponse<{ isConnected: boolean }> = await chrome.runtime.sendMessage({
    type: eventType,
  })

  if (!response) {
    window.$message.warning(`事件 "${eventType}" 已发送，但后台脚本未响应。`);
  }
  const { data } = response
  isConnected.value = data.isConnected
}

function retry(fn: (...args: any[]) => void, times: number = 99, delay: number = 3000) {
  const timer = setInterval(() => {
    fn()
    times--
    if (times === 0) {
      clearInterval(timer)
    }
  }, delay)

  return () => {
    clearInterval(timer)
  }
}

let cleanupRetry: () => void
onMounted(() => {
  checkConnection()
  cleanupRetry = retry(checkConnection)
})

onUnmounted(() => {
  cleanupRetry()
})
</script>

<template>
  <div>
    <NTag round :type="isConnected ? 'success' : 'error'" size="small">
      {{ isConnected ? '已连接' : '已断开' }}
    </NTag>
  </div>
</template>


<style scoped></style>
