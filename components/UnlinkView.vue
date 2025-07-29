<script setup lang="ts">
import { sendCheckConnection } from '@/utils';
import { NButton, NSpace } from 'naive-ui';


async function reConnected() {
  await sendCheckConnection((connected: boolean) => {
    console.log(connected)
  })
}
</script>

<template>
  <NSpace vertical :size="15" align="center">
    当前链接已断开
    <NButton block type="warning" @click="reConnected">尝试重新连接</NButton>
  </NSpace>
</template>
