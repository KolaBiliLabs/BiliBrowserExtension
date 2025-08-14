import type { ElectronMessageData } from '@/app'
import { DEFAULT_VIDEO_SELECTOR } from '@/constants'
import { getVideoInfo } from '@/utils'

export function useVideoInfo(cb?: (...args: any[]) => void) {
// 视频信息缓存
  const videoInfoCache = ref<ElectronMessageData['video'] | null>(null)
  const isVideoInfoLoading = ref(false)
  const videoInfoError = ref<string | null>(null)

  async function run() {
    // 开始加载
    isVideoInfoLoading.value = true
    videoInfoError.value = null

    getVideoInfo(DEFAULT_VIDEO_SELECTOR, (videoInfo) => {
      if (videoInfo) {
        videoInfoCache.value = videoInfo
        cb && cb(videoInfo)
        videoInfoError.value = null
        console.log('获取到新的视频信息:', videoInfo)
      } else {
        videoInfoError.value = '未找到视频元素'
        console.error('获取视频信息失败')
      }
      isVideoInfoLoading.value = false
    })
  }

  function clearVideoInfoCache() {
    videoInfoCache.value = null
    videoInfoError.value = null
  }

  run()

  return {
    videoInfoCache,
    isVideoInfoLoading,
    videoInfoError,
    run,
    clearVideoInfoCache,
  }
}
