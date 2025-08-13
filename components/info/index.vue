<script setup lang="ts">
import { NSpace } from 'naive-ui'
import { INFO_LINKS } from '~/constants'
import { formatLinkText } from '~/utils'

// 组件名称，用于调试
defineOptions({
  name: 'info',
})
</script>

<template>
  <div class="glass-effect rounded-lg p-2">
    <NSpace justify="space-around" class="py-1">
      <a
        v-for="link in INFO_LINKS"
        :key="link.key"
        :href="link.url"
        :title="link.title"
        target="_blank"
        rel="noopener noreferrer"
        class="flex-center gap-1.5"
      >
        <component
          :is="link.icon"
          class="size-3.5 flex-shrink-0 transition-transform duration-200 ease-in-out hover:scale-110"
        />
        <span class="text-xs font-medium whitespace-nowrap text-white/80 hover:text-white transition-colors">
          {{ formatLinkText(link.text) }}
        </span>
      </a>
    </NSpace>
  </div>
</template>
