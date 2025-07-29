<script setup lang="ts">
import { sendCheckConnection } from '@/utils';
import { NTag } from 'naive-ui';

const isConnected = defineModel()

async function checkConnection() {
  await sendCheckConnection((connected: boolean) => {
    isConnected.value = connected
  })
}

function retry(fn: (...args: any[]) => void, times: number = 5, delay: number = 3000) {
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
