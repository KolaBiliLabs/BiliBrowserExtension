<template>
  <NSpace justify="space-around" class="info-container">
    <a v-for="link in links" :key="link.key" :href="link.url" :title="link.title" target="_blank"
      rel="noopener noreferrer" class="info-link" @click="handleLinkClick(link)">
      <component :is="link.icon" class="info-icon" />
      <span class="info-text">{{ formatLinkText(link.text) }}</span>
    </a>
  </NSpace>
</template>

<script setup lang="ts">
import { NSpace } from 'naive-ui';
import { computed } from 'vue';
import { getInfoLinks, type LinkConfig } from './config';
import { debouncedHandleLinkClick, formatLinkText } from './utils';

// 获取链接配置
const links = computed<LinkConfig[]>(() => getInfoLinks());

// 链接点击处理 - 使用防抖优化
const handleLinkClick = debouncedHandleLinkClick;

// 组件名称，用于调试
defineOptions({
  name: 'Info'
});
</script>

<style scoped>
.info-container {
  padding: 0.5rem 0;
}

.info-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s ease-in-out;
  position: relative;
  overflow: hidden;
}

.info-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.5s ease-in-out;
}

.info-link:hover::before {
  left: 100%;
}

.info-link:hover {
  color: oklch(62.3% 0.214 259.815);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.info-link:active {
  transform: translateY(0);
  transition: transform 0.1s ease-in-out;
}

.info-icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  transition: transform 0.2s ease-in-out;
}

.info-link:hover .info-icon {
  transform: scale(1.1);
}

.info-text {
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  transition: color 0.2s ease-in-out;
}

/* 响应式设计 */
@media (max-width: 320px) {
  .info-text {
    font-size: 0.75rem;
  }

  .info-link {
    gap: 0.25rem;
    padding: 0.25rem;
  }
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  .info-link:hover {
    color: oklch(80% 0.214 259.815);
  }
}

/* 减少动画偏好 */
@media (prefers-reduced-motion: reduce) {

  .info-link,
  .info-link::before,
  .info-icon {
    transition: none;
  }

  .info-link:hover {
    transform: none;
  }

  .info-link:hover .info-icon {
    transform: none;
  }
}
</style>
