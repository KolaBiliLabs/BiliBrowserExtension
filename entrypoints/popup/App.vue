<script lang="ts" setup>
import { NCard, NTag } from 'naive-ui'
import { computed, onMounted, ref } from 'vue'
import CheckConnection from '@/components/CheckConnection.vue'
import Info from '@/components/info/index.vue'
import NonBilibiliView from '@/components/NonBilibiliView.vue'
import Provider from '@/components/Provider.vue'
import SendToClient from '@/components/SendToClient.vue'
import UnlinkView from '@/components/UnlinkView.vue'
import { useIsDev } from '@/hooks'
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
      title="Kola 插件"
      style="width: 320px;"
      :segmented="{
        content: true,
        footer: 'soft',
      }"
      size="small"
      class="mx-auto shadow-lg rounded-lg"
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
        <span v-if="isDev" class="text-xs text-gray-500 block mt-1 text-center mb-2">
          页面类型: {{ isBilibiliVideo ? 'Bilibili 视频页面' : '非 Bilibili 视频页面' }}
        </span>

        <Transition mode="out-in" name="left">
          <!-- 已连接且是 Bilibili 视频页面 -->
          <SendToClient v-if="isConnected && isBilibiliVideo" :url="currentUrl" />

          <!-- 已连接但不是 Bilibili 视频页面 -->
          <NonBilibiliView v-else-if="isConnected && !isBilibiliVideo" :url="currentUrl" />

          <!-- 未连接 -->
          <UnlinkView v-else />
        </Transition>
      </template>

      <template #footer>
        <Info />
      </template>
    </NCard>
  </Provider>
</template>
