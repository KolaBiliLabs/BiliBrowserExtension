import { onMounted, ref } from 'vue'

export function useIsDev() {
  const isDev = ref(false)

  onMounted(() => {
    isDev.value = !!import.meta.env.DEV
  })

  return {
    isDev,
  }
}
