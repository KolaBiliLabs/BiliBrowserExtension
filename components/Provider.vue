<script setup lang="ts">
import type { GlobalThemeOverrides } from 'naive-ui'
import { lightTheme, NConfigProvider, NMessageProvider, useMessage } from 'naive-ui'

defineSlots<{
  default: () => void
}>()

// 全局主题配置
const themeOverrides: GlobalThemeOverrides = {
  common: {
    borderRadius: '10px',
  },
  Modal: {
    borderRadius: '10px',
  },
  Card: {
    borderRadius: '10px',
  },
}

const NaiveContentProvider = defineComponent({
  setup() {
    window.$message = useMessage()

    return () => h('div', { class: 'main-tools' })
  },
})
</script>

<template>
  <NConfigProvider :theme-overrides :theme="lightTheme">
    <NMessageProvider
      :max="1"
      closable
      placement="bottom"
    >
      <slot />
      <NaiveContentProvider />
    </NMessageProvider>
  </NConfigProvider>
</template>
