<script lang="ts" setup>
import CheckConnection from '@/components/CheckConnection.vue';
import Info from '@/components/Info.vue';
import Provider from '@/components/Provider.vue';
import SendToClient from '@/components/SendToClient.vue';
import UnlinkView from '@/components/UnlinkView.vue';
import { NCard } from 'naive-ui';
import { onMounted, ref } from 'vue';

const isConnected = ref(false)
const currentUrl = ref('');

// 获取当前活动标签页的URL
function getUrl() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs[0] || !tabs[0].url) {
      return
    }

    currentUrl.value = tabs[0].url;
  });
}


onMounted(getUrl);
</script>

<template>
  <Provider>
    <NCard title="Cola Bilibili Helper" style="width: 320px;" :segmented="{
      content: true,
      footer: 'soft'
    }" size="small" class="mx-auto shadow-lg rounded-lg">
      <template #header-extra>
        <CheckConnection v-model="isConnected" />
      </template>

      <template #default>
        <Transition mode="out-in" name="left">
          <SendToClient v-if="isConnected" :url="currentUrl" />
          <UnlinkView v-else />
        </Transition>
      </template>

      <template #footer>
        <Info />
      </template>
    </NCard>
  </Provider>
</template>
