<script setup lang="ts">
import { GlobalThemeOverrides, lightTheme, NConfigProvider, NDialogProvider, NMessageProvider, NNotificationProvider, useDialog, useMessage, useNotification } from 'naive-ui';

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
    window.$dialog = useDialog()
    window.$notification = useNotification()

    return () => h('div', { class: 'main-tools' })
  },
})
</script>

<template>
  <NConfigProvider :theme-overrides :theme="lightTheme">
    <NMessageProvider>
      <NDialogProvider>
        <NNotificationProvider>
          <slot />
          <NaiveContentProvider />
        </NNotificationProvider>
      </NDialogProvider>
    </NMessageProvider>
  </NConfigProvider>
</template>
