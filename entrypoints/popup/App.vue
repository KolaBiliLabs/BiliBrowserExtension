<script lang="ts" setup>
import { NCard, NTag } from 'naive-ui'
import { computed, onMounted, ref } from 'vue'
import CheckConnection from '@/components/CheckConnection.vue'
import Info from '@/components/info/index.vue'
import NonBilibiliView from '@/components/NonBilibiliView.vue'
import Provider from '@/components/Provider.vue'
import SendToClient from '@/components/SendToClient.vue'
import UnlinkView from '@/components/UnlinkView.vue'
import { useIsDev } from '@/hooks/useIsDev'
import { getCurrentTabUrl, isBilibiliVideoPage } from '~/utils'

const { isDev } = useIsDev()

const isConnected = ref(false)
const currentUrl = ref('')

// 计算属性：是否为 Bilibili 视频页面
const isBilibiliVideo = computed(() => {
  return isBilibiliVideoPage(currentUrl.value)
})

// 获取当前活动标签页的URL
async function getUrl() {
  try {
    currentUrl.value = await getCurrentTabUrl()
  } catch (error) {
    console.error('获取当前标签页 URL 失败:', error)
  }
}

onMounted(getUrl)
</script>

<template>
  <Provider>
    <NCard
      :segmented="{ content: true, footer: 'soft' }"
      :footer-style="{
        padding: '8px',
      }"
      title="Kola 插件"
      class="w-full rounded-none glass-effect"
      size="small"
    >
      <template #header-extra>
        <NTag
          v-if="isDev"
          size="small"
          round
          class="mr-2"
          type="info"
        >
          dev
        </NTag>
        <CheckConnection v-model="isConnected" />
      </template>

      <template #default>
        <div class="flex-center">
          <span v-if="isDev" class="text-xs text-gray-400 block mt-1 text-center mb-2 absolute top-2 left-1/2 transform -translate-x-1/2">
            页面类型: {{ isBilibiliVideo ? 'Bilibili 视频页面' : '非 Bilibili 视频页面' }}
          </span>

          <Transition v-if="isConnected" mode="out-in" name="fade">
            <!-- 已连接且是 Bilibili 视频页面 -->
            <SendToClient v-if="isBilibiliVideo" :url="currentUrl" />

            <!-- 已连接但不是 Bilibili 视频页面 -->
            <NonBilibiliView v-else :url="currentUrl" />
          </Transition>

          <!-- 未连接 -->
          <UnlinkView v-else />
        </div>
      </template>

      <template #footer>
        <Info />
      </template>
    </NCard>
  </Provider>
</template>
