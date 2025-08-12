<script setup lang="ts">
import { NSpace } from 'naive-ui'
import { INFO_LINKS } from '~/contants'
import { formatLinkText } from '~/utils'

// 组件名称，用于调试
defineOptions({
  name: 'info',
})
</script>

<template>
  <NSpace justify="space-around" class="py-2">
    <a
      v-for="link in INFO_LINKS"
      :key="link.key"
      :href="link.url"
      :title="link.title"
      target="_blank"
      rel="noopener noreferrer"
      class="flex-center gap-2"
    >
      <component
        :is="link.icon"
        class="size-4 flex-shrink-0 transition-transform duration-200 ease-in-out hover:scale-110"
      />
      <span class="text-sm font-medium whitespace-nowrap ease-in-out sm:text-xs">
        {{ formatLinkText(link.text) }}
      </span>
    </a>
  </NSpace>
</template>
