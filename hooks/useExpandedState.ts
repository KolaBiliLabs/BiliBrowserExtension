import { onMounted, readonly, ref, watch } from 'vue'

/**
 * 管理展开状态的本地存储 Hook
 * @param storageKey 存储键名，默认为 'formExpandedState'
 * @param defaultValue 默认值，默认为 false
 * @param debounceDelay 防抖延迟时间，默认为 300ms
 * @returns 展开状态和设置函数
 */
export function useExpandedState(
  storageKey: string = 'formExpandedState',
  defaultValue: boolean = false,
  debounceDelay: number = 300,
) {
  // 展开状态
  const isExpanded = ref(defaultValue)

  // 是否已初始化
  const isInitialized = ref(false)
  
  // 防抖定时器
  let debounceTimer: NodeJS.Timeout | null = null
  
  // 是否正在切换状态
  const isTransitioning = ref(false)

  // 从本地存储加载状态
  const loadExpandedState = () => {
    try {
      chrome.storage.local.get([storageKey], (result) => {
        if (result[storageKey] !== undefined) {
          isExpanded.value = result[storageKey]
        }
        isInitialized.value = true
        console.log(`已从本地存储加载展开状态: ${isExpanded.value}`)
      })
    } catch (error) {
      console.error('加载展开状态失败:', error)
      isInitialized.value = true
    }
  }

  // 保存状态到本地存储
  const saveExpandedState = (value: boolean) => {
    try {
      chrome.storage.local.set({
        [storageKey]: value,
      }, () => {
        console.log(`展开状态已保存到本地存储: ${value}`)
      })
    } catch (error) {
      console.error('保存展开状态失败:', error)
    }
  }

  // 设置展开状态（带防抖）
  const setExpanded = (value: boolean) => {
    // 如果正在切换状态，则忽略
    if (isTransitioning.value) {
      return
    }
    
    // 清除之前的定时器
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }
    
    // 设置正在切换状态
    isTransitioning.value = true
    
    // 防抖处理
    debounceTimer = setTimeout(() => {
      isExpanded.value = value
      saveExpandedState(value)
      isTransitioning.value = false
    }, debounceDelay)
  }

  // 切换展开状态（带防抖）
  const toggleExpanded = () => {
    // 如果正在切换状态，则忽略
    if (isTransitioning.value) {
      return
    }
    
    const newValue = !isExpanded.value
    setExpanded(newValue)
  }

  // 重置为默认值
  const resetExpanded = () => {
    setExpanded(defaultValue)
  }

  // 监听状态变化并自动保存
  watch(isExpanded, (newValue) => {
    if (isInitialized.value) {
      saveExpandedState(newValue)
    }
  })

  // 组件挂载时加载状态
  onMounted(() => {
    loadExpandedState()
  })

  return {
    isExpanded: readonly(isExpanded),
    setExpanded,
    toggleExpanded,
    resetExpanded,
    isInitialized: readonly(isInitialized),
    isTransitioning: readonly(isTransitioning),
  }
}
