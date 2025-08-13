<script setup lang="ts">
import { NButton } from 'naive-ui'
import { sendCheckConnection } from '@/utils'

async function reConnected() {
  await sendCheckConnection((connected: boolean) => {
    console.log(connected)
  })
}
</script>

<template>
  <div class="glass-effect-dark rounded-2xl p-8 text-center">
    <div class="mb-6">
      <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
        <svg
          class="w-8 h-8 text-red-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-white mb-2">
        连接已断开
      </h3>
      <p class="text-gray-300 text-sm">
        无法连接到服务器，请检查网络连接
      </p>
    </div>

    <NButton
      type="warning"
      size="large"
      class="w-full glass-effect"
      @click="reConnected"
    >
      尝试重新连接
    </NButton>
  </div>
</template>
