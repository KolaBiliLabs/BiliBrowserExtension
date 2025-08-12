<script setup lang="ts">
import type { LinkConfig } from './config'
import { NSpace } from 'naive-ui'
import { computed } from 'vue'
import { debouncedHandleLinkClick, formatLinkText } from '~/utils'
import { getInfoLinks } from './config'

// 组件名称，用于调试
defineOptions({
  name: 'info',
})

// 获取链接配置
const links = computed<LinkConfig[]>(() => getInfoLinks())

// 链接点击处理 - 使用防抖优化
const handleLinkClick = debouncedHandleLinkClick
</script>

<template>
  <NSpace justify="space-around" class="py-2">
    <a
      v-for="link in links"
      :key="link.key"
      :href="link.url"
      :title="link.title"
      target="_blank"
      rel="noopener noreferrer"
      class="flex items-center gap-2 px-2 py-1 rounded-md text-inherit no-underline transition-all duration-200 ease-in-out relative overflow-hidden hover:text-blue-600 dark:hover:text-blue-400 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:transition-transform active:duration-100 sm:gap-1 sm:px-1 sm:py-1 sm:text-sm"
      @click="handleLinkClick(link)"
    >
      <component
        :is="link.icon"
        class="w-4 h-4 flex-shrink-0 transition-transform duration-200 ease-in-out hover:scale-110"
      />
      <span class="text-sm font-medium whitespace-nowrap transition-colors duration-200 ease-in-out sm:text-xs">
        {{
          formatLinkText(link.text) }}
      </span>
    </a>
  </NSpace>
</template>
