<template>
  <NSpace justify="space-around" class="py-2">
    <a href="https://github.com/colaBiliHelper/cola-be" target="_blank" rel="noopener noreferrer" class="link">
      <GithubIcon class="size-4" />
      <span>插件源码</span>
    </a>

    <a href="https://github.com/colaBiliHelper/cola-be" target="_blank" rel="noopener noreferrer" class="link">
      <CirclePercentIcon class="size-4" />
      <span>客户端地址</span>
    </a>
  </NSpace>
</template>

<script setup lang="ts">
import { CirclePercentIcon, GithubIcon } from 'lucide-vue-next';
import { NSpace } from 'naive-ui';
</script>

<style scoped>
a {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 500ms ease-in-out;

  &:hover {
    color: oklch(62.3% 0.214 259.815);
  }
}
</style>
