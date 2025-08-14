<script setup lang="ts">
import { MessageCircleWarningIcon } from 'lucide-vue-next'
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
        <MessageCircleWarningIcon class="text-red-500" />
      </div>
      <h3 class="text-lg font-semibold text-white mb-2">
        连接已断开
      </h3>
      <p class="text-gray-300 text-sm">
        无法连接到客户端，请检查客户端是否启动，或重启客户端再次尝试
      </p>
    </div>

    <NButton
      type="warning"
      size="large"
      class="w-full"
      @click="reConnected"
    >
      尝试重新连接
    </NButton>
  </div>
</template>
